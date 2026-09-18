"use client";
import { useState, useRef, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import { getArea, getCurrentPeriod } from "@/types";
import type { ReportPeriodType, Report } from "@/types";
import { ArrowLeft, Upload, X, Monitor, Check, Pencil } from "lucide-react";

const RichTextEditor = dynamic(() => import("@/components/RichTextEditor"), { ssr: false });

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
  });
}

function ImageUploadBox({ label, value, onChange }: {
  label: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const processFile = async (file: File) => {
    if (!file.type.startsWith("image/")) return;
    if (file.size > 5 * 1024 * 1024) { alert("La imagen no puede superar 5MB"); return; }
    onChange(await fileToBase64(file));
  };

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) await processFile(file);
  };

  return (
    <div>
      <p className="text-sm font-semibold text-zinc-700 mb-2">{label}</p>
      {value ? (
        <div className="relative">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt={label} className="w-full h-44 object-contain rounded-xl border border-zinc-200 bg-zinc-50" />
          <button
            type="button"
            onClick={() => { onChange(undefined); if (inputRef.current) inputRef.current.value = ""; }}
            className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
          >
            <X size={13} />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={async (e) => {
            e.preventDefault();
            setIsDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) await processFile(file);
          }}
          className={`w-full h-44 border-2 border-dashed rounded-xl flex flex-col items-center justify-center gap-2 transition-colors bg-white ${
            isDragging
              ? "border-[#F5A623] text-[#F5A623] bg-amber-50"
              : "border-zinc-200 text-zinc-400 hover:border-[#F5A623] hover:text-[#F5A623]"
          }`}
        >
          <Upload size={22} />
          <span className="text-sm font-medium">Subir imagen</span>
          <span className="text-xs text-zinc-300">JPG, PNG — máx. 5MB</span>
          <span className="text-[10px] text-zinc-400 mt-1">
            Clic, arrastra o pega (Ctrl+V)
          </span>
        </button>
      )}
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

export default function UploadPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params.slug as string;
  const area = getArea(slug);

  const [reportType, setReportType] = useState<ReportPeriodType>("weekly");
  const [notes, setNotes] = useState("");
  const [salesImg, setSalesImg] = useState<string | undefined>();
  const [collectionImg, setCollectionImg] = useState<string | undefined>();
  const [salesCommitment, setSalesCommitment] = useState("");
  const [collectionCommitment, setCollectionCommitment] = useState("");
  const [nichoImage, setNichoImage] = useState<string | undefined>();
  const [top5BestSellers, setTop5BestSellers] = useState<string | undefined>();
  const [top5OverdueCollection, setTop5OverdueCollection] = useState<string | undefined>();
  const [queVasAHacer, setQueVasAHacer] = useState("");
  const [photos, setPhotos] = useState<(string | undefined)[]>([undefined, undefined, undefined]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const latestImagesRef = useRef({
    salesImg, collectionImg, nichoImage, top5BestSellers, top5OverdueCollection, photos, area,
  });

  const periodInfo = getCurrentPeriod(reportType);

  const isGeneral = area?.slug === "general";

// Keep the ref in sync with state on every render
 useEffect(() => {
  latestImagesRef.current = {
    salesImg, collectionImg, nichoImage, top5BestSellers, top5OverdueCollection, photos, area,
  };
  });
  

useEffect(() => {
  const handlePaste = async (e: ClipboardEvent) => {
    // Don't hijack pastes inside text inputs / rich text editors
    const target = e.target as HTMLElement;
    if (
      target?.tagName === "INPUT" ||
      target?.tagName === "TEXTAREA" ||
      target?.isContentEditable
    ) {
      return;
    }

    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith("image/")) {
        const file = item.getAsFile();
        if (!file) return;
        if (file.size > 5 * 1024 * 1024) {
          alert("La imagen no puede superar 5MB");
          return;
        }
        e.preventDefault();
        const base64 = await fileToBase64(file);

        // Read the LATEST state from the ref, not the closure
        const { salesImg, collectionImg, nichoImage, top5BestSellers, top5OverdueCollection, photos, area } =
          latestImagesRef.current;

        if (area?.type === "sales_zone") {
          if (!salesImg)      { setSalesImg(base64);      return; }
          if (!collectionImg) { setCollectionImg(base64); return; }
          if (!nichoImage)    { setNichoImage(base64);    return; }
          // Only for the "general" area
          if (area.slug === "general") {
            if (!top5BestSellers)       { setTop5BestSellers(base64);       return; }
            if (!top5OverdueCollection) { setTop5OverdueCollection(base64); return; }
          }
          alert("Todas las imágenes ya están cargadas. Elimina una para reemplazarla.");
        } else {
          const idx = photos.findIndex((p) => !p);
          if (idx !== -1) {
            setPhotos((prev) => {
              const next = [...prev];
              next[idx] = base64;
              return next;
            });
          } else {
            alert("Las 3 fotos ya están cargadas. Elimina una para reemplazarla.");
          }
        }
        return;
      }
    }
  };

  document.addEventListener("paste", handlePaste);
  return () => document.removeEventListener("paste", handlePaste);
}, []); // ✅ empty deps — listener registered once, reads fresh state via ref 

  useEffect(() => {
    if (!slug || !area) return;
    setFetching(true);
    setIsEditing(false);
    setNotes(""); setSalesImg(undefined); setCollectionImg(undefined);
    setSalesCommitment(""); setCollectionCommitment("");
    setNichoImage(undefined); setQueVasAHacer("");
    setTop5BestSellers(undefined); setTop5OverdueCollection(undefined);
    setPhotos([undefined, undefined, undefined]);

    fetch(`/api/reports?area=${slug}&reportType=${reportType}&period=${periodInfo.period}`)
      .then((r) => r.json())
      .then((data) => {
        const ex: Report | undefined = data.reports?.[0];
        if (ex) {
          setIsEditing(true);
          setNotes(ex.notes || "");
          if (area.type === "sales_zone") {
            setSalesImg(ex.salesReportImage);
            setCollectionImg(ex.collectionReportImage);
            setNichoImage(ex.nichoImage);
            setTop5BestSellers(ex.top5BestSellersImage);
            setTop5OverdueCollection(ex.top5OverdueCollectionImage);
            setSalesCommitment(ex.salesCommitment || "");
            setCollectionCommitment(ex.collectionCommitment || "");
            setQueVasAHacer(ex.queVasAHacer || "");
          } else {
            const p = ex.photos || [];
            setPhotos([p[0], p[1], p[2]]);
          }
        }
      })
      .finally(() => setFetching(false));
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug, reportType]);

  if (!area) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <p className="text-zinc-400">Área no encontrada</p>
    </div>
  );

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true); setError("");

  const payload: Record<string, unknown> = {
    area: area.slug, areaType: area.type,
    reportType, period: periodInfo.period, periodLabel: periodInfo.label, notes,
  };

  if (area.type === "sales_zone") {
    Object.assign(payload, {
      salesReportImage: salesImg,
      collectionReportImage: collectionImg,
      nichoImage,
      salesCommitment,
      collectionCommitment,
      queVasAHacer,
    });

    if (area.slug === "general") {
      Object.assign(payload, {
        top5BestSellersImage: top5BestSellers,
        top5OverdueCollectionImage: top5OverdueCollection,
      });
    }
  } else {
    payload.photos = photos.filter(Boolean);
  }

  try {
    const res = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || "Error al guardar");
    setSuccess(true);
    setTimeout(() => router.push(`/area/${slug}`), 1400);
  } catch (err: unknown) {
    setError(err instanceof Error ? err.message : "Error desconocido");
  } finally {
    setLoading(false);
  }
};

  const areaLabel =
    area.type === "sales_zone" ? "Zona de Ventas" :
    area.type === "linea"      ? "Línea" :
                                 "Departamento";

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href={`/area/${slug}`} className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <Image src="/logo.jpeg" alt="Merquellantas" width={150} height={38} className="object-contain" />
          </div>
          <Link href="/presentation" className="inline-flex items-center gap-2 bg-[#F5A623] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-500 transition-colors">
            <Monitor size={15} /> Modo Presentación
          </Link>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        {/* Area badge */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-xl flex items-center justify-center text-white font-bold text-base" style={{ backgroundColor: area.color }}>
            {area.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
          </div>
          <div>
            <h1 className="text-lg font-bold text-zinc-900">{area.name}</h1>
            <p className="text-xs text-zinc-400 flex items-center gap-1">
              {isEditing && <><Pencil size={10} className="text-[#F5A623]" /><span className="text-[#F5A623] font-semibold">Editando reporte</span></>}
              {!isEditing && "Nuevo reporte"}
            </p>
          </div>
        </div>

        {fetching ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Period selector */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-5">
              <p className="text-sm font-bold text-zinc-800 mb-4">Tipo de reporte</p>
              <div className="grid grid-cols-2 gap-3 mb-4">
                {(["weekly", "monthly"] as ReportPeriodType[]).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setReportType(type)}
                    className={`py-3 rounded-xl text-sm font-semibold border-2 transition-all ${
                      reportType === type ? "border-[#F5A623] bg-[#F5A623] text-white" : "border-zinc-200 bg-white text-zinc-600 hover:bg-zinc-50"
                    }`}
                  >
                    {type === "weekly" ? "📅 Semanal" : "🗓️ Mensual"}
                  </button>
                ))}
              </div>
              <div className="bg-zinc-50 rounded-xl px-4 py-3 flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-zinc-400 uppercase tracking-wider font-bold">Período a reportar</p>
                  <p className="text-[#F5A623] font-bold text-base mt-0.5">{periodInfo.label}</p>
                </div>
                {isEditing && (
                  <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-200 px-2.5 py-1 rounded-full font-semibold flex items-center gap-1">
                    <Pencil size={9} /> Editando
                  </span>
                )}
              </div>
            </div>

            {/* Images + commitments (sales zones only) */}
            {area.type === "sales_zone" ? (
              <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-5">
                <p className="text-sm font-bold text-zinc-800">Informes e Imágenes</p>

                {/* Ventas row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploadBox label="Informe de Ventas" value={salesImg} onChange={setSalesImg} />
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-zinc-700 mb-2">Compromiso Informe de Ventas</label>
                    <RichTextEditor
                      key={`sales-${reportType}-${fetching}`}
                      value={salesCommitment}
                      onChange={setSalesCommitment}
                      placeholder="Escribe el compromiso de ventas para este período..."
                      rows={5}
                    />
                  </div>
                </div>

                {/* Recaudo row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <ImageUploadBox label="Informe de Recaudo" value={collectionImg} onChange={setCollectionImg} />
                  <div className="flex flex-col">
                    <label className="text-sm font-semibold text-zinc-700 mb-2">Compromiso Informe de Recaudo</label>
                    <RichTextEditor
                      key={`collection-${reportType}-${fetching}`}
                      value={collectionCommitment}
                      onChange={setCollectionCommitment}
                      placeholder="Escribe el compromiso de recaudo para este período..."
                      rows={5}
                    />
                  </div>
                </div>

                {/* Nicho */}
                  <div>
                    <ImageUploadBox
                      label="Composición de ventas por lista (flotas, distribución, uno a uno y debe salir con números de clientes)"
                      value={nichoImage}
                      onChange={setNichoImage}
                    />
                  </div>

                  {/* General-only fields */}
                  {isGeneral && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <ImageUploadBox
                        label="Top 5 Mejores Vendedores"
                        value={top5BestSellers}
                        onChange={setTop5BestSellers}
                      />
                      <ImageUploadBox
                        label="Top 5 Recaudo Vencido"
                        value={top5OverdueCollection}
                        onChange={setTop5OverdueCollection}
                      />
                    </div>
                  )}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-zinc-100 p-5">
                <p className="text-sm font-bold text-zinc-800 mb-4">Fotos (máx. 3) — {areaLabel}</p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[0, 1, 2].map((i) => (
                    <ImageUploadBox key={i} label={`Foto ${i + 1}`} value={photos[i]}
                      onChange={(v) => setPhotos((p) => { const n = [...p]; n[i] = v; return n; })} />
                  ))}
                </div>
              </div>
            )}

            {/* ¿Qué vas a hacer diferente? (sales zones only) */}
            {area.type === "sales_zone" && (
              <div className="bg-white rounded-2xl border border-zinc-100 p-5">
                <p className="text-sm font-bold text-zinc-800 mb-3">¿Qué vas a hacer diferente esta semana?</p>
                <RichTextEditor
                  key={`queva-${reportType}-${fetching}`}
                  value={queVasAHacer}
                  onChange={setQueVasAHacer}
                  placeholder="Describe qué harás diferente esta semana para mejorar resultados..."
                  rows={4}
                />
              </div>
            )}

            {/* Notes */}
            <div className="bg-white rounded-2xl border border-zinc-100 p-5">
              <p className="text-sm font-bold text-zinc-800 mb-3">
                {area.type === "sales_zone" ? "Comentarios adicionales" : "Metas / Comentarios"}
              </p>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={5}
                placeholder={area.type === "sales_zone" ? "Observaciones, highlights de la semana..." : "Metas, resultados, observaciones..."}
                className="input-field resize-none"
              />
            </div>

            {error && <div className="bg-red-50 border border-red-200 text-red-600 text-sm rounded-xl px-4 py-3">{error}</div>}

            {success && (
              <div className="bg-green-50 border border-green-200 text-green-700 text-sm rounded-xl px-4 py-3 flex items-center gap-2">
                <Check size={15} /> Guardado. Redirigiendo...
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="btn-primary w-full py-3.5 text-base flex items-center justify-center gap-2"
            >
              {loading
                ? <><div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" /> Guardando...</>
                : success ? <><Check size={17} /> Guardado</>
                : isEditing ? <><Pencil size={17} /> Actualizar Reporte</>
                : "Guardar Reporte"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
