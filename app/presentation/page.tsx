"use client";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { AREAS } from "@/types";
import type { Area, Report, ReportPeriodType } from "@/types";
import { X, ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

interface PeriodOption { period: string; periodLabel: string; count: number; }
interface TimerConfig { startTime: string; durationMinutes: number; }

function compromisoFontSize(html: string): string {
  const len = html.replace(/<[^>]*>/g, "").trim().length;
  if (len < 60)  return "text-lg leading-snug";
  if (len < 120) return "text-base leading-snug";
  if (len < 220) return "text-sm leading-relaxed";
  if (len < 380) return "text-xs leading-relaxed";
  return "text-[10px] leading-relaxed";
}

function formatTime(totalSecs: number): string {
  const h = Math.floor(totalSecs / 3600);
  const m = Math.floor((totalSecs % 3600) / 60);
  const s = totalSecs % 60;
  if (h > 0) return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function getTimerColor(idx: number, total: number, elapsed: number, totalSecs: number): string {
  if (totalSecs === 0 || elapsed <= 0) return "text-white/70";
  const timePerSlide = totalSecs / total;
  const slidesBehind = elapsed / timePerSlide - idx;
  if (slidesBehind <= 0) return "text-green-400";
  if (slidesBehind <= 1) return "text-yellow-400";
  return "text-red-400";
}

type SlideItem =
  | { kind: "sales-main"; area: Area; report: Report }
  | { kind: "sales-top5"; area: Area; report: Report }
  | { kind: "dept"; area: Area; report: Report };

function ini(name: string) {
  return name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
}
function areaLabel(area: Area) {
  if (area.type === "sales_zone") return "Zona de Ventas";
  if (area.type === "linea") return "Línea";
  return "Departamento";
}

// ─── Timer modal ──────────────────────────────────────────────────────────────
const DURATIONS = [
  { value: 30, label: "30 min" },
  { value: 45, label: "45 min" },
  { value: 60, label: "1 hora" },
  { value: 90, label: "1:30 h" },
  { value: 120, label: "2 horas" },
];

function TimerModal({ onStart, onSkip }: { onStart: (c: TimerConfig) => void; onSkip: () => void }) {
  const [startTime, setStartTime] = useState("08:00");
  const [duration, setDuration] = useState(60);

  return (
    <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-4">
      <div className="bg-[#181818] border border-white/10 rounded-2xl p-8 w-full max-w-[400px] text-white shadow-2xl">
        <div className="mb-7 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#F5A623]/10 border border-[#F5A623]/20 flex items-center justify-center mx-auto mb-4">
            <Image src="/logo.jpeg" alt="Merquellantas" width={32} height={32} className="object-contain" />
          </div>
          <h2 className="text-xl font-bold mb-1">Modo Presentación</h2>
          <p className="text-white/40 text-sm">Configura el temporizador de la sesión</p>
        </div>

        <div className="space-y-5 mb-7">
          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5 block">
              Hora de inicio
            </label>
            <input
              type="time"
              value={startTime}
              onChange={(e) => setStartTime(e.target.value)}
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:ring-2 focus:ring-[#F5A623] focus:border-transparent transition"
            />
          </div>

          <div>
            <label className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-2.5 block">
              Duración de la reunión
            </label>
            <div className="grid grid-cols-3 gap-2">
              {DURATIONS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setDuration(value)}
                  className={`py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    duration === value
                      ? "bg-[#F5A623] text-white"
                      : "bg-white/5 text-white/60 hover:bg-white/10 border border-white/5"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <button
            onClick={() => onStart({ startTime, durationMinutes: duration })}
            className="w-full bg-[#F5A623] text-white font-bold py-3.5 rounded-xl hover:bg-amber-500 transition-colors text-sm"
          >
            Comenzar Presentación
          </button>
          <button
            onClick={onSkip}
            className="w-full bg-white/5 text-white/40 text-sm py-2.5 rounded-xl hover:bg-white/8 transition-colors"
          >
            Continuar sin temporizador
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Cover slide ──────────────────────────────────────────────────────────────
function CoverSlide({ reportType, periodLabel, totalAreas }: {
  reportType: ReportPeriodType; periodLabel: string; totalAreas: number;
}) {
  const today = new Date().toLocaleDateString("es-CO", {
    weekday: "long", year: "numeric", month: "long", day: "numeric",
  });
  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-8 relative overflow-hidden">
      <div className="absolute -top-40 -right-40 w-[500px] h-[500px] rounded-full bg-[#F5A623]/5 pointer-events-none" />
      <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] rounded-full bg-[#F5A623]/5 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center w-full max-w-xl">
        <div className="bg-white rounded-3xl px-10 py-4 shadow-2xl shadow-black/50 mb-7">
          <Image src="/logo.jpeg" alt="Merquellantas" width={240} height={62} className="object-contain" priority />
        </div>
        <div className="w-12 h-1 bg-[#F5A623] rounded-full mb-5" />
        <h1 className="text-5xl font-bold text-white mb-3 leading-tight">
          Seguimiento{" "}
          <span className="text-[#F5A623]">{reportType === "weekly" ? "Semanal" : "Mensual"}</span>
        </h1>
        <p className="text-xl text-white/50 font-light mb-8">{periodLabel}</p>
        <div className="flex items-center gap-6 bg-white/5 border border-white/10 rounded-2xl px-8 py-4 mb-5">
          <div className="text-center">
            <p className="text-3xl font-bold text-[#F5A623]">{totalAreas}</p>
            <p className="text-white/35 text-xs uppercase tracking-wider mt-0.5">
              {totalAreas === 1 ? "Área reportó" : "Áreas reportaron"}
            </p>
          </div>
          <div className="w-px h-8 bg-white/10" />
          <div className="text-center">
            <p className="text-sm font-semibold text-white/70 capitalize">{today}</p>
            <p className="text-white/30 text-xs uppercase tracking-wider mt-0.5">Presentación</p>
          </div>
        </div>
        <p className="text-white/20 text-xs flex items-center gap-1">
          <ChevronRight size={12} /> Presiona → para comenzar
        </p>
      </div>
    </div>
  );
}

// ─── Closing slide ────────────────────────────────────────────────────────────
const QUOTES: { text: string; highlights: string[] }[] = [
  {
    text: "Los grandes equipos se construyen sobre el esfuerzo, la disciplina y la confianza.",
    highlights: ["esfuerzo", "disciplina", "confianza"],
  },
  {
    text: "La disciplina es el puente entre las metas y los logros.",
    highlights: ["disciplina", "metas", "logros"],
  },
  {
    text: "Las ventas son el resultado de equipos que trabajan con propósito, pasión y persistencia.",
    highlights: ["propósito", "pasión", "persistencia"],
  },
  {
    text: "Un equipo alineado no solo alcanza sus metas, las supera.",
    highlights: ["alineado", "supera"],
  },
  {
    text: "El talento gana partidos, pero el trabajo en equipo y la inteligencia ganan campeonatos.",
    highlights: ["trabajo en equipo", "inteligencia", "campeonatos"],
  },
  {
    text: "La excelencia no es una habilidad. Es una actitud que se construye cada día.",
    highlights: ["excelencia", "actitud"],
  },
  {
    text: "No cuentes los días. Haz que los días cuenten.",
    highlights: ["cuenten"],
  },
  {
    text: "Cada cliente ganado es el reflejo de un equipo que nunca dejó de creer.",
    highlights: ["nunca dejó de creer"],
  },
  {
    text: "El éxito no es llegar primero. Es hacer que todos lleguen juntos.",
    highlights: ["éxito", "juntos"],
  },
  {
    text: "Los campeones se forjan en el trabajo silencioso que nadie ve, pero todos celebran.",
    highlights: ["trabajo silencioso", "celebran"],
  },
  {
    text: "Una visión sin ejecución es solo un sueño. Una ejecución sin visión es solo rutina. Juntas, cambian el mundo.",
    highlights: ["visión", "ejecución"],
  },
  {
    text: "El precio del éxito es la dedicación, el trabajo duro y un compromiso inquebrantable con la excelencia.",
    highlights: ["dedicación", "trabajo duro", "excelencia"],
  },
];

function renderQuote(text: string, highlights: string[]) {
  const escaped = highlights.map((h) => h.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const pattern = new RegExp(`(${escaped.join("|")})`, "gi");
  return text.split(pattern).map((part, i) =>
    highlights.some((h) => h.toLowerCase() === part.toLowerCase())
      ? <span key={i} className="text-[#F5A623]">{part}</span>
      : <span key={i}>{part}</span>
  );
}

function ClosingSlide() {
  const [quoteIdx, setQuoteIdx] = useState(0);
  useEffect(() => { setQuoteIdx(Math.floor(Math.random() * QUOTES.length)); }, []);
  const { text, highlights } = QUOTES[quoteIdx];

  return (
    <div className="w-full h-full flex flex-col items-center justify-center px-12 relative overflow-hidden">
      <div className="absolute -top-60 -left-60 w-[600px] h-[600px] rounded-full bg-[#F5A623]/5 pointer-events-none" />
      <div className="absolute -bottom-60 -right-60 w-[600px] h-[600px] rounded-full bg-[#F5A623]/5 pointer-events-none" />
      <div className="relative z-10 flex flex-col items-center text-center max-w-4xl">
        <div className="bg-white rounded-3xl px-10 py-4 shadow-2xl shadow-black/50 mb-10">
          <Image src="/logo.jpeg" alt="Merquellantas" width={220} height={56} className="object-contain" />
        </div>
        <div className="w-16 h-1 bg-[#F5A623] rounded-full mb-10" />
        <blockquote className="text-5xl font-bold text-white leading-tight tracking-tight">
          {renderQuote(text, highlights)}
        </blockquote>
      </div>
    </div>
  );
}

// ─── Shared slide header ──────────────────────────────────────────────────────
function SlideHeader({ area, report, sub, badge }: {
  area: Area; report: Report; sub: string; badge?: string;
}) {
  return (
    <div className="flex items-center gap-3 shrink-0">
      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-white font-bold text-sm shrink-0"
        style={{ backgroundColor: area.color }}>
        {ini(area.name)}
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-base font-bold text-white leading-tight">
          {area.name}
          {sub && <span className="text-white/35 text-sm font-normal"> — {sub}</span>}
        </h2>
        <p className="text-white/35 text-[11px]">{areaLabel(area)} · {report.periodLabel}</p>
      </div>
      <div className="bg-white/8 border border-white/10 rounded-xl px-3 py-1.5 shrink-0">
        <Image src="/logo.jpeg" alt="Merquellantas" width={80} height={20}
          className="object-contain brightness-0 invert opacity-50" />
      </div>
      {badge && <span className="text-white/20 text-xs shrink-0">{badge}</span>}
    </div>
  );
}

// ─── Image cell ───────────────────────────────────────────────────────────────
function ImgCell({ label, src, onImageClick, flex = "flex-1" }: {
  label: string; src?: string; onImageClick: (s: string) => void; flex?: string;
}) {
  return (
    <div className={`${flex} min-h-0 flex flex-col gap-1`}>
      <p className="text-white/80 text-[11px] font-bold uppercase tracking-widest shrink-0">{label}</p>
      {src ? (
        <button onClick={() => onImageClick(src)}
          className="flex-1 rounded-xl overflow-hidden bg-white hover:ring-2 hover:ring-[#F5A623] transition-all min-h-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={src} alt={label} className="w-full h-full object-contain p-1" />
        </button>
      ) : (
        <div className="flex-1 rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/15 text-xs min-h-0">
          Sin imagen
        </div>
      )}
    </div>
  );
}

// ─── Slide 1 per sales zone: Ventas + Recaudo + compromisos ──────────────────
function SalesMainSlide({ area, report, onImageClick }: {
  area: Area; report: Report; onImageClick: (s: string) => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-4 pb-3 gap-3">
      <SlideHeader area={area} report={report} sub="Ventas & Recaudo" badge="1/2" />

      <div className="flex-1 min-h-0 grid grid-cols-2 gap-4">
        {/* Ventas column */}
        <div className="flex flex-col gap-2 min-h-0">
          <p className="text-white text-sm font-bold uppercase tracking-widest shrink-0">Informe de Ventas</p>
          {report.salesReportImage ? (
            <button onClick={() => onImageClick(report.salesReportImage!)}
              className={`rounded-xl overflow-hidden bg-white hover:ring-2 hover:ring-[#F5A623] transition-all min-h-0 ${report.salesCommitment ? "flex-[3]" : "flex-1"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.salesReportImage} alt="Ventas" className="w-full h-full object-contain p-1" />
            </button>
          ) : (
            <div className={`rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/15 text-xs min-h-0 ${report.salesCommitment ? "flex-[3]" : "flex-1"}`}>
              Sin imagen
            </div>
          )}
          {report.salesCommitment && (
            <div className="flex-[2] min-h-0 bg-white/5 border border-[#F5A623]/20 rounded-xl px-4 py-3 overflow-y-auto">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5A623] mb-2">Compromiso</p>
              <div className={`rich-text-dark text-white/90 ${compromisoFontSize(report.salesCommitment)}`}
                dangerouslySetInnerHTML={{ __html: report.salesCommitment }} />
            </div>
          )}
        </div>

        {/* Recaudo column */}
        <div className="flex flex-col gap-2 min-h-0">
          <p className="text-white text-sm font-bold uppercase tracking-widest shrink-0">Informe de Recaudo</p>
          {report.collectionReportImage ? (
            <button onClick={() => onImageClick(report.collectionReportImage!)}
              className={`rounded-xl overflow-hidden bg-white hover:ring-2 hover:ring-[#F5A623] transition-all min-h-0 ${report.collectionCommitment ? "flex-[3]" : "flex-1"}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={report.collectionReportImage} alt="Recaudo" className="w-full h-full object-contain p-1" />
            </button>
          ) : (
            <div className={`rounded-xl border border-dashed border-white/10 flex items-center justify-center text-white/15 text-xs min-h-0 ${report.collectionCommitment ? "flex-[3]" : "flex-1"}`}>
              Sin imagen
            </div>
          )}
          {report.collectionCommitment && (
            <div className="flex-[2] min-h-0 bg-white/5 border border-[#F5A623]/20 rounded-xl px-4 py-3 overflow-y-auto">
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5A623] mb-2">Compromiso</p>
              <div className={`rich-text-dark text-white/90 ${compromisoFontSize(report.collectionCommitment)}`}
                dangerouslySetInnerHTML={{ __html: report.collectionCommitment }} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Slide 2 per sales zone: Top 5 + Nicho ───────────────────────────────────
function SalesTop5Slide({ area, report, onImageClick }: {
  area: Area; report: Report; onImageClick: (s: string) => void;
}) {
  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-4 pb-3 gap-3">
      <SlideHeader area={area} report={report} sub="Top 5 & Composición" badge="2/2" />

      <div className="flex-1 min-h-0 flex gap-4">
        <LeftPanel area={area} report={report} />
        <div className="flex-1 min-w-0 flex gap-3">
          <ImgCell label="Top 5 Ventas"                  src={report.top5SalesImage}      onImageClick={onImageClick} />
          <ImgCell label="Top 5 Recaudo"                 src={report.top5CollectionImage} onImageClick={onImageClick} />
          <ImgCell label="Composición por Nicho"         src={report.nichoImage}          onImageClick={onImageClick} />
        </div>
      </div>
    </div>
  );
}

// ─── Slide for departments / lineas ──────────────────────────────────────────
function DeptSlide({ area, report, onImageClick }: {
  area: Area; report: Report; onImageClick: (s: string) => void;
}) {
  const photos = (report.photos || []).filter(Boolean);
  const gridCols = photos.length === 1 ? "1fr" : photos.length === 2 ? "1fr 1fr" : "1fr 1fr 1fr";

  return (
    <div className="absolute inset-0 flex flex-col px-6 pt-4 pb-3 gap-3">
      <SlideHeader area={area} report={report} sub="" />

      <div className="flex-1 min-h-0 flex gap-4">
        <LeftPanel area={area} report={report} />
        <div className="flex-1 min-w-0">
          {photos.length > 0 ? (
            <div className="h-full" style={{ display: "grid", gridTemplateColumns: gridCols, gap: "8px" }}>
              {photos.map((photo, i) => (
                <button key={i} onClick={() => onImageClick(photo)}
                  className="rounded-xl overflow-hidden bg-white hover:ring-2 hover:ring-[#F5A623] transition-all h-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={photo} alt={`Foto ${i + 1}`} className="w-full h-full object-contain p-1" />
                </button>
              ))}
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-white/15 text-sm">
              Sin fotos en este período
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Left info panel ─────────────────────────────────────────────────────────
function LeftPanel({ area, report }: { area: Area; report: Report }) {
  return (
    <div className="shrink-0 flex flex-col rounded-2xl border border-white/8 overflow-hidden"
      style={{ width: "200px", background: "rgba(255,255,255,0.04)" }}>
      <div className="h-1 shrink-0" style={{ backgroundColor: area.color }} />
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shrink-0"
          style={{ backgroundColor: area.color }}>
          {ini(area.name)}
        </div>
        <div>
          <h3 className="text-white font-bold text-base leading-tight">{area.name}</h3>
          <p className="text-white/40 text-xs mt-0.5">{areaLabel(area)}</p>
        </div>
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623] shrink-0" />
            <span className="text-white/60 text-xs">{report.periodLabel}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-white/20 shrink-0" />
            <span className="text-white/40 text-xs">
              {report.reportType === "weekly" ? "Informe Semanal" : "Informe Mensual"}
            </span>
          </div>
        </div>
        {report.queVasAHacer && area.type === "sales_zone" && (
          <>
            <div className="w-full h-px bg-white/10 shrink-0" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-[#F5A623] mb-2">
                ¿Qué haré diferente?
              </p>
              <div className="rich-text-dark text-white/75 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: report.queVasAHacer }} />
            </div>
          </>
        )}
        {report.notes && (
          <>
            <div className="w-full h-px bg-white/10 shrink-0" />
            <div>
              <p className="text-[9px] font-bold uppercase tracking-widest text-white/40 mb-2">
                {area.type === "sales_zone" ? "Comentarios" : "Metas / Comentarios"}
              </p>
              <div className="rich-text-dark text-white/75 text-xs leading-relaxed"
                dangerouslySetInnerHTML={{ __html: report.notes }} />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function PresentationPage() {
  const [reportType, setReportType] = useState<ReportPeriodType>("weekly");
  const [periods, setPeriods] = useState<PeriodOption[]>([]);
  const [selectedPeriod, setSelectedPeriod] = useState("");
  const [periodOpen, setPeriodOpen] = useState(false);
  const [reports, setReports] = useState<Record<string, Report>>({});
  const [loading, setLoading] = useState(true);
  const [idx, setIdx] = useState(0);
  const [lightbox, setLightbox] = useState<string | null>(null);

  // Timer state
  const [showTimerModal, setShowTimerModal] = useState(true);
  const [timerConfig, setTimerConfig] = useState<TimerConfig | null>(null);
  const [remaining, setRemaining] = useState(0);
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    fetch(`/api/periods?reportType=${reportType}`).then((r) => r.json()).then((data) => {
      const ps: PeriodOption[] = data.periods || [];
      setPeriods(ps);
      setSelectedPeriod(ps[0]?.period ?? "");
      if (!ps.length) { setReports({}); setLoading(false); }
    });
  }, [reportType]);

  useEffect(() => {
    if (!selectedPeriod) return;
    setLoading(true); setIdx(0);
    fetch(`/api/reports?reportType=${reportType}&period=${selectedPeriod}`)
      .then((r) => r.json())
      .then((data) => {
        const map: Record<string, Report> = {};
        (data.reports as Report[]).forEach((r) => { if (!map[r.area]) map[r.area] = r; });
        setReports(map);
      })
      .finally(() => setLoading(false));
  }, [selectedPeriod, reportType]);

  // Countdown tick
  useEffect(() => {
    if (!timerConfig) return;
    const [h, m] = timerConfig.startTime.split(":").map(Number);
    const start = new Date();
    start.setHours(h, m, 0, 0);
    const totalMs = timerConfig.durationMinutes * 60000;

    const tick = () => {
      const now = Date.now();
      const elapsedMs = Math.max(0, now - start.getTime());
      const elapsedClamped = Math.min(elapsedMs, totalMs);
      setElapsed(Math.floor(elapsedClamped / 1000));
      setRemaining(Math.max(0, Math.floor((totalMs - elapsedClamped) / 1000)));
    };

    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, [timerConfig]);

  // Build flat slide list: Líderes de Zona → Líneas → Admon Nacional y Flotas → Departamentos
  const TYPE_ORDER: Record<string, number> = { sales_zone: 0, linea: 1, department: 2 };
  const slideOrder = (a: Area) =>
    a.slug === "admon-nacional-flotas" ? 1.5 : TYPE_ORDER[a.type] ?? 3;
  const sortedAreas = [...AREAS].sort((a, b) => slideOrder(a) - slideOrder(b));

  const slideItems: SlideItem[] = sortedAreas.reduce<SlideItem[]>((acc, a) => {
    if (!reports[a.slug]) return acc;
    const r = reports[a.slug];
    if (a.type === "sales_zone") {
      acc.push({ kind: "sales-main", area: a, report: r });
      acc.push({ kind: "sales-top5", area: a, report: r });
    } else {
      acc.push({ kind: "dept", area: a, report: r });
    }
    return acc;
  }, []);

  const uniqueAreaCount = AREAS.filter((a) => reports[a.slug]).length;
  const total = 1 + slideItems.length + 1; // cover + areas + closing

  const goNext = useCallback(() => setIdx((i) => Math.min(i + 1, total - 1)), [total]);
  const goPrev = useCallback(() => setIdx((i) => Math.max(i - 1, 0)), []);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (lightbox) { if (e.key === "Escape") setLightbox(null); return; }
      if (showTimerModal) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") goNext();
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") goPrev();
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [goNext, goPrev, lightbox, showTimerModal]);

  const periodLabel = periods.find((p) => p.period === selectedPeriod)?.periodLabel ?? selectedPeriod;
  const currentSlide = idx > 0 ? slideItems[idx - 1] : null;

  const totalSecs = timerConfig ? timerConfig.durationMinutes * 60 : 0;
  const timerColorClass = timerConfig ? getTimerColor(idx, total, elapsed, totalSecs) : "";

  return (
    <>
      {/* Timer modal */}
      {showTimerModal && (
        <TimerModal
          onStart={(cfg) => { setTimerConfig(cfg); setShowTimerModal(false); }}
          onSkip={() => setShowTimerModal(false)}
        />
      )}

      <div className="bg-[#0f0f0f] select-none overflow-hidden text-white"
        style={{ display: "grid", gridTemplateRows: "60px 22px 1fr 52px", height: "100dvh" }}>

        {/* ── Row 1: Top bar ── */}
        <div className="relative flex items-center justify-between px-5 bg-black/60 border-b border-white/5">
          {/* Left: Salir + Logo */}
          <div className="flex items-center gap-3 z-10">
            <Link href="/" className="flex items-center gap-1.5 text-white/40 hover:text-white transition-colors text-sm">
              <X size={14} /> Salir
            </Link>
            <div className="w-px h-5 bg-white/10" />
            <Image src="/logo.jpeg" alt="Merquellantas" width={90} height={23} className="object-contain brightness-0 invert opacity-50" />
          </div>

          {/* Center: Countdown timer (absolutely centered) */}
          {timerConfig && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className={`flex flex-col items-center ${timerColorClass}`}>
                <span className="text-3xl font-mono font-bold leading-none tracking-tight">
                  {formatTime(remaining)}
                </span>
                <span className="text-[9px] uppercase tracking-widest opacity-60 mt-0.5">
                  {remaining === 0 ? "tiempo agotado" : "restante"}
                </span>
              </div>
            </div>
          )}

          {/* Right: Controls */}
          <div className="flex items-center gap-2 z-10">
            <div className="flex bg-white/10 rounded-lg p-0.5">
              {(["weekly", "monthly"] as ReportPeriodType[]).map((t) => (
                <button key={t} onClick={() => setReportType(t)}
                  className={`px-3 py-1 rounded-md text-xs font-semibold transition-all ${t === reportType ? "bg-[#F5A623] text-white" : "text-white/40 hover:text-white/70"}`}>
                  {t === "weekly" ? "Semanal" : "Mensual"}
                </button>
              ))}
            </div>
            {periods.length > 0 && (
              <div className="relative">
                <button onClick={() => setPeriodOpen((o) => !o)}
                  className="flex items-center gap-2 bg-white/10 hover:bg-white/15 text-white text-xs font-semibold px-3 py-1.5 rounded-lg min-w-[140px] justify-between transition-colors">
                  <span className="truncate">{periodLabel}</span>
                  <ChevronDown size={12} className={`shrink-0 transition-transform ${periodOpen ? "rotate-180" : ""}`} />
                </button>
                {periodOpen && (
                  <div className="absolute right-0 top-full mt-1 bg-[#1c1c1c] border border-white/10 rounded-xl shadow-2xl z-50 min-w-[170px] overflow-hidden">
                    {periods.map((p) => (
                      <button key={p.period} onClick={() => { setSelectedPeriod(p.period); setPeriodOpen(false); }}
                        className={`w-full text-left px-4 py-2.5 text-xs transition-colors ${p.period === selectedPeriod ? "bg-[#F5A623] text-white font-semibold" : "text-white/60 hover:bg-white/10"}`}>
                        <span className="block">{p.periodLabel}</span>
                        <span className={`text-[10px] ${p.period === selectedPeriod ? "text-white/70" : "text-white/30"}`}>{p.count} áreas</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* ── Row 2: Slide dots ── */}
        <div className="flex items-center justify-center gap-1">
          {!loading && total > 1 && (
            <>
              <button onClick={() => setIdx(0)} title="Portada"
                className={`rounded-full transition-all ${idx === 0 ? "w-5 h-1.5 bg-[#F5A623]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
              />
              {slideItems.map((s, i) => (
                <button key={i} onClick={() => setIdx(i + 1)} title={s.area.name}
                  className={`rounded-full transition-all ${
                    idx === i + 1
                      ? "w-4 h-1.5 bg-[#F5A623]"
                      : s.kind === "sales-top5"
                      ? "w-1 h-1 bg-white/15 hover:bg-white/30"
                      : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
              <button onClick={() => setIdx(total - 1)} title="Cierre"
                className={`rounded-full transition-all ${idx === total - 1 ? "w-5 h-1.5 bg-[#F5A623]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
              />
            </>
          )}
        </div>

        {/* ── Row 3: Slide area ── */}
        <div className="overflow-hidden relative">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-10 h-10 border-4 border-[#F5A623] border-t-transparent rounded-full animate-spin" />
            </div>
          ) : periods.length === 0 ? (
            <div className="w-full h-full flex flex-col items-center justify-center text-white/30 gap-4">
              <span className="text-5xl">📋</span>
              <p>No hay reportes cargados aún.</p>
              <Link href="/" className="text-[#F5A623] hover:underline text-sm">Ir a subir reportes →</Link>
            </div>
          ) : idx === 0 ? (
            <CoverSlide reportType={reportType} periodLabel={periodLabel} totalAreas={uniqueAreaCount} />
          ) : currentSlide?.kind === "sales-main" ? (
            <SalesMainSlide area={currentSlide.area} report={currentSlide.report} onImageClick={setLightbox} />
          ) : currentSlide?.kind === "sales-top5" ? (
            <SalesTop5Slide area={currentSlide.area} report={currentSlide.report} onImageClick={setLightbox} />
          ) : currentSlide ? (
            <DeptSlide area={currentSlide.area} report={currentSlide.report} onImageClick={setLightbox} />
          ) : idx === total - 1 ? (
            <ClosingSlide />
          ) : null}
        </div>

        {/* ── Row 4: Nav bar ── */}
        <div className="flex items-center justify-between px-6 border-t border-white/5 bg-black/30">
          <button onClick={goPrev} disabled={idx === 0}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 transition-colors text-xs font-semibold">
            <ChevronLeft size={14} /> Anterior
          </button>
          <div className="flex items-center gap-4">
            <span className="text-white/20 text-xs">{idx + 1} / {total} &nbsp;·&nbsp; ← → navegar</span>
            <Image src="/logo.jpeg" alt="" width={65} height={16} className="object-contain brightness-0 invert opacity-15" />
          </div>
          <button onClick={goNext} disabled={idx === total - 1}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 transition-colors text-xs font-semibold">
            Siguiente <ChevronRight size={14} />
          </button>
        </div>

        {/* Lightbox */}
        {lightbox && (
          <div className="fixed inset-0 bg-black/95 z-50 flex items-center justify-center p-8"
            onClick={() => setLightbox(null)}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={lightbox} alt="" className="max-w-full max-h-full object-contain rounded-2xl"
              onClick={(e) => e.stopPropagation()} />
            <button onClick={() => setLightbox(null)}
              className="absolute top-5 right-5 bg-white/10 rounded-full p-2 hover:bg-white/20 transition-colors">
              <X size={18} />
            </button>
          </div>
        )}
      </div>
    </>
  );
}
