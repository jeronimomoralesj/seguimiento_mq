"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getArea, getCurrentPeriod } from "@/types";
import type { Report, ReportPeriodType } from "@/types";
import { ArrowLeft, Plus, Monitor, Calendar, Clock, Pencil, Lock } from "lucide-react";

export default function AreaPage() {
  const params = useParams();
  const slug = params.slug as string;
  const area = getArea(slug);

  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<ReportPeriodType>("weekly");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  const editablePeriod = getCurrentPeriod(tab).period;

  useEffect(() => {
    if (!slug) return;
    setLoading(true);
    fetch(`/api/reports?area=${slug}&reportType=${tab}`)
      .then((r) => r.json())
      .then((data) => {
        setReports(data.reports || []);
        setSelectedReport(data.reports?.[0] || null);
      })
      .finally(() => setLoading(false));
  }, [slug, tab]);

  if (!area) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-50">
        <p className="text-zinc-400">Área no encontrada</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <Image src="/logo.jpeg" alt="Merquellantas" width={150} height={38} className="object-contain" />
          </div>
          <Link
            href="/presentation"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-500 transition-colors"
          >
            <Monitor size={15} />
            Modo Presentación
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Area title row */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-xl"
              style={{ backgroundColor: area.color }}
            >
              {area.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase()}
            </div>
            <div>
              <h1 className="text-xl font-bold text-zinc-900">{area.name}</h1>
              <p className="text-sm text-zinc-400">{area.type === "sales_zone" ? "Zona de Ventas" : "Departamento"}</p>
            </div>
          </div>
          <Link
            href={`/area/${slug}/upload`}
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
          >
            <Plus size={16} />
            Nuevo Reporte
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {(["weekly", "monthly"] as ReportPeriodType[]).map((type) => (
            <button
              key={type}
              onClick={() => setTab(type)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                tab === type
                  ? "bg-[#F5A623] text-white"
                  : "bg-white text-zinc-600 border border-zinc-200 hover:bg-zinc-50"
              }`}
            >
              {type === "weekly" ? <><Clock size={14} /> Semanal</> : <><Calendar size={14} /> Mensual</>}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-24">
            <div className="w-8 h-8 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : reports.length === 0 ? (
          <div className="bg-white rounded-2xl border border-zinc-100 text-center py-16 px-8">
            <p className="text-4xl mb-4">📋</p>
            <p className="text-zinc-500 mb-5">No hay reportes {tab === "weekly" ? "semanales" : "mensuales"} aún</p>
            <Link href={`/area/${slug}/upload`} className="btn-primary inline-flex items-center gap-2">
              <Plus size={16} /> Crear primer reporte
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {/* History sidebar */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-2xl border border-zinc-100 p-4">
                <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3 px-1">Historial</p>
                <div className="flex flex-col gap-1">
                  {reports.map((r) => {
                    const editable = r.period === editablePeriod;
                    const selected = selectedReport?._id === r._id;
                    return (
                      <div key={r._id} className="flex items-center gap-1">
                        <button
                          onClick={() => setSelectedReport(r)}
                          className={`flex-1 text-left px-3 py-2.5 rounded-xl text-sm transition-all ${
                            selected ? "bg-[#F5A623] text-white font-semibold" : "text-zinc-700 hover:bg-zinc-50"
                          }`}
                        >
                          <span className="block leading-tight">{r.periodLabel}</span>
                          {editable && (
                            <span className={`text-[10px] font-semibold ${selected ? "text-white/70" : "text-[#F5A623]"}`}>
                              editable
                            </span>
                          )}
                        </button>
                        {editable ? (
                          <Link
                            href={`/area/${slug}/upload`}
                            className="p-1.5 rounded-lg text-zinc-300 hover:text-[#F5A623] hover:bg-amber-50 transition-colors"
                          >
                            <Pencil size={13} />
                          </Link>
                        ) : (
                          <span className="p-1.5 text-zinc-200">
                            <Lock size={12} />
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Report detail */}
            <div className="lg:col-span-3">
              {selectedReport && (
                <ReportDetail
                  report={selectedReport}
                  slug={slug}
                  isEditable={selectedReport.period === editablePeriod}
                />
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function ReportDetail({ report, slug, isEditable }: { report: Report; slug: string; isEditable: boolean }) {
  const header = (
    <div className="bg-white rounded-2xl border border-zinc-100 p-5 flex items-start justify-between gap-4 mb-4">
      <div>
        <h3 className="font-bold text-zinc-900 text-lg leading-tight">{report.periodLabel}</h3>
        <p className="text-xs text-zinc-400 mt-0.5">
          {report.reportType === "weekly" ? "Informe Semanal" : "Informe Mensual"}
        </p>
      </div>
      {isEditable ? (
        <Link
          href={`/area/${slug}/upload`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#F5A623] border border-[#F5A623]/30 bg-amber-50 hover:bg-amber-100 px-3 py-1.5 rounded-xl transition-colors shrink-0"
        >
          <Pencil size={13} /> Editar
        </Link>
      ) : (
        <span className="inline-flex items-center gap-1.5 text-xs text-zinc-400 border border-zinc-200 px-3 py-1.5 rounded-xl shrink-0">
          <Lock size={11} /> Cerrado
        </span>
      )}
    </div>
  );

  if (report.areaType === "sales_zone") {
    return (
      <div>
        {header}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <ImgCard title="Informe de Ventas" src={report.salesReportImage} />
          <ImgCard title="Informe de Recaudo" src={report.collectionReportImage} />
          <ImgCard title="Top 5 Ventas" src={report.top5SalesImage} />
          <ImgCard title="Top 5 Recaudo" src={report.top5CollectionImage} />
        </div>
        {report.notes && (
          <div className="bg-white rounded-2xl border border-zinc-100 p-5 mt-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Comentarios</p>
            <p className="text-zinc-700 text-sm whitespace-pre-wrap leading-relaxed">{report.notes}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      {header}
      {report.photos && report.photos.length > 0 && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 mb-4">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">Fotos</p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {report.photos.map((photo, i) => (
              <a key={i} href={photo} target="_blank" rel="noopener noreferrer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-40 object-cover rounded-xl hover:opacity-90 transition-opacity cursor-pointer" />
              </a>
            ))}
          </div>
        </div>
      )}
      {report.notes && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-2">Metas / Comentarios</p>
          <p className="text-zinc-700 text-sm whitespace-pre-wrap leading-relaxed">{report.notes}</p>
        </div>
      )}
    </div>
  );
}

function ImgCard({ title, src }: { title: string; src?: string }) {
  return (
    <div className="bg-white rounded-2xl border border-zinc-100 p-4">
      <p className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 mb-3">{title}</p>
      {src ? (
        <a href={src} target="_blank" rel="noopener noreferrer">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={title} className="w-full h-44 object-contain rounded-xl bg-zinc-50 hover:opacity-90 transition-opacity cursor-pointer" />
        </a>
      ) : (
        <div className="w-full h-44 rounded-xl bg-zinc-50 border border-dashed border-zinc-200 flex items-center justify-center text-zinc-300 text-sm">
          Sin imagen
        </div>
      )}
    </div>
  );
}
