"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft, ArrowRight, Monitor, Plus, Clock, Calendar,
  Pencil, Lock, Upload, X, Check, ChevronLeft, ChevronRight,
  ChevronDown, Home,
} from "lucide-react";

// ─── Dummy data ───────────────────────────────────────────────────────────────

const DUMMY_HISTORY = [
  { period: "2026-W35", label: "Semana 35, Ago 2026", editable: true },
  { period: "2026-W34", label: "Semana 34, Ago 2026", editable: false },
  { period: "2026-W33", label: "Semana 33, Jul 2026", editable: false },
  { period: "2026-W32", label: "Semana 32, Jul 2026", editable: false },
];

const DUMMY_MONTHLY = [
  { period: "2026-08", label: "Agosto 2026", editable: true },
  { period: "2026-07", label: "Julio 2026", editable: false },
  { period: "2026-06", label: "Junio 2026", editable: false },
];

const DUMMY_NOTES =
  "Excelente semana en la zona. Cerramos por encima de la meta en llanta comercial. Pendiente reforzar seguimiento a cartera de clientes TOP.";

// Inline SVG chart placeholders
const ChartPlaceholder = ({ label, color }: { label: string; color: string }) => (
  <div
    className="w-full h-full flex flex-col items-center justify-center rounded-xl gap-2"
    style={{ background: `${color}12`, border: `1.5px dashed ${color}50` }}
  >
    <svg width="64" height="40" viewBox="0 0 64 40" fill="none">
      <rect x="4" y="20" width="10" height="20" rx="2" fill={color} opacity="0.5" />
      <rect x="18" y="10" width="10" height="30" rx="2" fill={color} opacity="0.7" />
      <rect x="32" y="4" width="10" height="36" rx="2" fill={color} opacity="0.9" />
      <rect x="46" y="14" width="10" height="26" rx="2" fill={color} opacity="0.6" />
    </svg>
    <p className="text-[11px] font-semibold text-center px-2" style={{ color }}>{label}</p>
  </div>
);

const Top5Placeholder = ({ label, color }: { label: string; color: string }) => (
  <div
    className="w-full h-full flex flex-col justify-center px-3 rounded-xl gap-1.5"
    style={{ background: `${color}08`, border: `1.5px dashed ${color}40` }}
  >
    <p className="text-[10px] font-bold mb-1" style={{ color }}>{label}</p>
    {["Cliente ABC — $42.5M", "Distribuidora Norte — $38.1M", "Llantas del Sur — $31.7M", "Auto Parts Cali — $28.4M", "Repuestos Bogotá — $22.9M"].map((row, i) => (
      <div key={i} className="flex items-center gap-2">
        <span className="text-[10px] font-bold w-3 text-center" style={{ color }}>{i + 1}</span>
        <div className="flex-1 bg-white/60 rounded h-4 flex items-center px-1.5">
          <span className="text-[9px] text-zinc-600 truncate">{row}</span>
        </div>
      </div>
    ))}
  </div>
);

// ─── Step definitions ─────────────────────────────────────────────────────────

const STEPS = [
  { id: 1, emoji: "🏠", title: "Pantalla Principal", subtitle: "Elige tu zona o departamento" },
  { id: 2, emoji: "📋", title: "Ver Reportes", subtitle: "Historial semanal y mensual" },
  { id: 3, emoji: "📤", title: "Subir un Reporte", subtitle: "Cargar imágenes y comentarios" },
  { id: 4, emoji: "🎬", title: "Modo Presentación", subtitle: "Vista en pantalla completa" },
];

// ─── Callout bubble ───────────────────────────────────────────────────────────

function Callout({ children, color = "#F5A623", num }: { children: React.ReactNode; color?: string; num?: number }) {
  return (
    <div className="flex items-start gap-2.5 mb-3">
      {num !== undefined && (
        <div
          className="w-5 h-5 rounded-full flex items-center justify-center text-white font-bold text-[10px] shrink-0 mt-0.5"
          style={{ backgroundColor: color }}
        >
          {num}
        </div>
      )}
      <p className="text-sm text-zinc-700 leading-relaxed">{children}</p>
    </div>
  );
}

// ─── Step 1: Home ─────────────────────────────────────────────────────────────

function Step1() {
  const salesZones = [
    { name: "Andina", color: "#F5A623" },
    { name: "Antioquia", color: "#E8951E" },
    { name: "Caribe", color: "#D4831A" },
    { name: "Centro Oriente", color: "#C07016" },
    { name: "Sur Occidente", color: "#AB5E12" },
    { name: "Venta Telefónica", color: "#964B0E" },
  ];
  const depts = [
    { name: "Supply Chain", color: "#2D2D2D" },
    { name: "Mercadeo", color: "#3D3D3D" },
    { name: "Recaudo", color: "#4D4D4D" },
    { name: "Sistemas", color: "#5D5D5D" },
    { name: "Depto. de la Gente", color: "#6D6D6D" },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Explanation */}
      <div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          Paso 1 de 4
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">La Pantalla Principal</h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Aquí verás todas las zonas de ventas y departamentos de Merquellantas. Cada tarjeta te lleva directamente a los reportes de esa área.
        </p>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-0.5">
          <Callout num={1}>
            <strong>Líderes de Zona</strong> — Son las 6 zonas de ventas. Haz clic en tu zona para ingresar.
          </Callout>
          <Callout num={2}>
            <strong>Departamentos</strong> — Áreas de soporte como Supply Chain, Mercadeo, etc.
          </Callout>
          <Callout num={3}>
            El botón <strong className="text-amber-600">Modo Presentación</strong> abre la vista de diapositivas para reuniones.
          </Callout>
        </div>
        <div className="mt-4 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <p className="text-xs text-amber-700 font-semibold">💡 Consejo</p>
          <p className="text-xs text-amber-600 mt-0.5">Cada líder solo necesita entrar a su propia zona. No hay contraseñas, la plataforma es abierta.</p>
        </div>
      </div>

      {/* Mockup */}
      <div className="bg-zinc-100 rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
        {/* Navbar */}
        <div className="bg-white border-b border-zinc-200 h-12 flex items-center justify-between px-4">
          <div className="w-28 h-6 bg-zinc-100 rounded" />
          <div className="flex items-center gap-1.5 bg-[#F5A623] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
            <Monitor size={11} /> Modo Presentación
          </div>
        </div>
        <div className="p-4 bg-zinc-50">
          <p className="text-base font-bold text-zinc-900 mb-0.5">Seguimiento de Gestión</p>
          <p className="text-[11px] text-zinc-400 mb-4">Selecciona tu área para ingresar o consultar reportes</p>

          {/* Zona marker */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1 h-4 rounded-full bg-[#F5A623]" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Líderes de Zona</span>
            <span className="ml-1 text-[9px] bg-amber-100 text-amber-600 font-bold px-2 py-0.5 rounded-full border border-amber-200">① Tu zona está aquí</span>
          </div>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {salesZones.map((z) => {
              const ini = z.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={z.name} className="bg-white rounded-xl border border-zinc-100 p-3 flex flex-col items-center text-center hover:shadow-sm cursor-pointer group transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mb-2" style={{ backgroundColor: z.color }}>{ini}</div>
                  <span className="text-[10px] font-semibold text-zinc-800 leading-tight">{z.name}</span>
                  <span className="text-[9px] text-zinc-400">Zona de Ventas</span>
                </div>
              );
            })}
          </div>

          {/* Dept marker */}
          <div className="flex items-center gap-2 mb-2.5">
            <span className="w-1 h-4 rounded-full bg-zinc-400" />
            <span className="text-[9px] font-bold uppercase tracking-widest text-zinc-400">Departamentos</span>
            <span className="ml-1 text-[9px] bg-zinc-100 text-zinc-500 font-bold px-2 py-0.5 rounded-full border border-zinc-200">② Departamentos de soporte</span>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {depts.map((d) => {
              const ini = d.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
              return (
                <div key={d.name} className="bg-white rounded-xl border border-zinc-100 p-3 flex flex-col items-center text-center cursor-pointer hover:shadow-sm transition-all">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs mb-2" style={{ backgroundColor: d.color }}>{ini}</div>
                  <span className="text-[10px] font-semibold text-zinc-800 leading-tight">{d.name}</span>
                  <span className="text-[9px] text-zinc-400">Departamento</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 2: Area / Report view ───────────────────────────────────────────────

function Step2() {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [selectedIdx, setSelectedIdx] = useState(0);
  const history = tab === "weekly" ? DUMMY_HISTORY : DUMMY_MONTHLY;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Explanation */}
      <div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          Paso 2 de 4
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Ver los Reportes de tu Zona</h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Al entrar a tu zona verás el historial de reportes. Puedes alternar entre semanas y meses, y ver el detalle de cada período.
        </p>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-0.5">
          <Callout num={1}>
            Usa las pestañas <strong>Semanal / Mensual</strong> para cambiar el tipo de reporte que ves.
          </Callout>
          <Callout num={2}>
            El <strong>historial</strong> muestra todos los períodos cargados. El período actual aparece marcado como <span className="text-amber-600 font-semibold">editable</span>.
          </Callout>
          <Callout num={3}>
            Haz clic en cualquier período del historial para ver sus imágenes y comentarios en el panel de la derecha.
          </Callout>
          <Callout num={4}>
            El ícono de lápiz ✏️ solo aparece en el período actual. Los anteriores están <strong>cerrados</strong> y no se pueden editar.
          </Callout>
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-700 font-semibold">🔵 Interactivo</p>
          <p className="text-xs text-blue-600 mt-0.5">La maqueta de la derecha es funcional — prueba las pestañas y el historial.</p>
        </div>
      </div>

      {/* Mockup */}
      <div className="bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
        {/* Navbar */}
        <div className="bg-white border-b border-zinc-200 h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ArrowLeft size={14} className="text-zinc-400" />
            <div className="w-20 h-5 bg-zinc-100 rounded" />
          </div>
          <div className="flex items-center gap-1.5 bg-[#F5A623] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
            <Monitor size={11} /> Modo Presentación
          </div>
        </div>

        <div className="p-4">
          {/* Area header */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#F5A623] flex items-center justify-center text-white font-bold text-sm">AN</div>
              <div>
                <p className="text-sm font-bold text-zinc-900">Andina</p>
                <p className="text-[10px] text-zinc-400">Zona de Ventas</p>
              </div>
            </div>
            <button className="flex items-center gap-1 bg-[#F5A623] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
              <Plus size={11} /> Nuevo Reporte
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mb-3">
            {(["weekly", "monthly"] as const).map((t) => (
              <button
                key={t}
                onClick={() => { setTab(t); setSelectedIdx(0); }}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-semibold transition-all ${t === tab ? "bg-[#F5A623] text-white" : "bg-white text-zinc-600 border border-zinc-200"}`}
              >
                {t === "weekly" ? <><Clock size={11} /> Semanal</> : <><Calendar size={11} /> Mensual</>}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-4 gap-2">
            {/* Sidebar */}
            <div className="col-span-1 bg-white rounded-xl border border-zinc-100 p-2">
              <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-2 px-1">Historial</p>
              <div className="flex flex-col gap-0.5">
                {history.map((r, i) => (
                  <div key={r.period} className="flex items-center gap-0.5">
                    <button
                      onClick={() => setSelectedIdx(i)}
                      className={`flex-1 text-left px-2 py-2 rounded-lg text-[10px] transition-all ${i === selectedIdx ? "bg-[#F5A623] text-white font-semibold" : "text-zinc-700 hover:bg-zinc-50"}`}
                    >
                      <span className="block leading-tight">{r.label}</span>
                      {r.editable && (
                        <span className={`text-[8px] font-semibold ${i === selectedIdx ? "text-white/70" : "text-[#F5A623]"}`}>editable</span>
                      )}
                    </button>
                    {r.editable
                      ? <Pencil size={10} className="text-zinc-300 hover:text-[#F5A623] shrink-0" />
                      : <Lock size={9} className="text-zinc-200 shrink-0" />}
                  </div>
                ))}
              </div>
            </div>

            {/* Report detail */}
            <div className="col-span-3 flex flex-col gap-2">
              <div className="bg-white rounded-xl border border-zinc-100 p-2.5 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-bold text-zinc-900">{history[selectedIdx]?.label}</p>
                  <p className="text-[9px] text-zinc-400">{tab === "weekly" ? "Informe Semanal" : "Informe Mensual"}</p>
                </div>
                {history[selectedIdx]?.editable ? (
                  <span className="text-[9px] text-amber-600 border border-amber-200 bg-amber-50 px-2 py-0.5 rounded-full flex items-center gap-0.5 font-semibold">
                    <Pencil size={8} /> Editar
                  </span>
                ) : (
                  <span className="text-[9px] text-zinc-400 border border-zinc-200 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <Lock size={8} /> Cerrado
                  </span>
                )}
              </div>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { l: "Informe de Ventas", c: "#F5A623" },
                  { l: "Informe de Recaudo", c: "#2D7DD2" },
                  { l: "Top 5 Ventas", c: "#F5A623" },
                  { l: "Top 5 Recaudo", c: "#2D7DD2" },
                ].map(({ l, c }) => (
                  <div key={l} className="bg-white rounded-xl border border-zinc-100 p-2">
                    <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1.5">{l}</p>
                    <div className="h-20">
                      {l.startsWith("Top") ? <Top5Placeholder label={l} color={c} /> : <ChartPlaceholder label={l} color={c} />}
                    </div>
                  </div>
                ))}
              </div>
              <div className="bg-white rounded-xl border border-zinc-100 p-2.5">
                <p className="text-[8px] font-bold uppercase tracking-widest text-zinc-400 mb-1">Comentarios</p>
                <p className="text-[10px] text-zinc-700 leading-relaxed">{DUMMY_NOTES}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Step 3: Upload ───────────────────────────────────────────────────────────

function Step3() {
  const [tab, setTab] = useState<"weekly" | "monthly">("weekly");
  const [hasImg1, setHasImg1] = useState(false);
  const [hasImg2, setHasImg2] = useState(false);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Explanation */}
      <div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          Paso 3 de 4
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Subir un Reporte</h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          Desde la pantalla de tu zona haz clic en <strong>"Nuevo Reporte"</strong>. Sube las imágenes de tus informes y agrega comentarios.
        </p>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-0.5">
          <Callout num={1}>
            Selecciona si el reporte es <strong>Semanal o Mensual</strong>. El sistema muestra automáticamente el período que debes reportar.
          </Callout>
          <Callout num={2}>
            Para <strong>Zonas de Ventas</strong>: sube 4 imágenes — Informe de Ventas, Informe de Recaudo, Top 5 Ventas y Top 5 Recaudo.
          </Callout>
          <Callout num={3}>
            Para <strong>Departamentos</strong>: sube hasta 3 fotos de evidencia y escribe tus metas/comentarios.
          </Callout>
          <Callout num={4}>
            Haz clic en <strong className="text-amber-600">Guardar Reporte</strong>. Si ya existe un reporte del período actual, el sistema lo actualiza automáticamente.
          </Callout>
        </div>
        <div className="mt-4 bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-3">
          <p className="text-xs text-zinc-600 font-semibold">📁 Formato de imágenes</p>
          <p className="text-xs text-zinc-500 mt-0.5">JPG o PNG, máximo 5MB por imagen. Pueden ser capturas de pantalla de Excel o WhatsApp.</p>
        </div>
      </div>

      {/* Mockup */}
      <div className="bg-zinc-50 rounded-2xl overflow-hidden border border-zinc-200 shadow-lg">
        {/* Navbar */}
        <div className="bg-white border-b border-zinc-200 h-12 flex items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <ArrowLeft size={14} className="text-zinc-400" />
            <div className="w-20 h-5 bg-zinc-100 rounded" />
          </div>
          <div className="flex items-center gap-1.5 bg-[#F5A623] text-white text-[10px] font-semibold px-3 py-1.5 rounded-lg">
            <Monitor size={11} /> Modo Presentación
          </div>
        </div>

        <div className="p-4 space-y-3">
          {/* Area badge */}
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#F5A623] flex items-center justify-center text-white font-bold text-sm">AN</div>
            <div>
              <p className="text-sm font-bold text-zinc-900">Andina</p>
              <p className="text-[10px] text-zinc-400">Nuevo reporte</p>
            </div>
          </div>

          {/* Period selector */}
          <div className="bg-white rounded-xl border border-zinc-100 p-3">
            <p className="text-[11px] font-bold text-zinc-800 mb-2">Tipo de reporte</p>
            <div className="grid grid-cols-2 gap-2 mb-2">
              {(["weekly", "monthly"] as const).map((t) => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className={`py-2 rounded-lg text-[11px] font-semibold border-2 transition-all ${tab === t ? "border-[#F5A623] bg-[#F5A623] text-white" : "border-zinc-200 bg-white text-zinc-600"}`}
                >
                  {t === "weekly" ? "📅 Semanal" : "🗓️ Mensual"}
                </button>
              ))}
            </div>
            <div className="bg-zinc-50 rounded-lg px-3 py-2">
              <p className="text-[8px] text-zinc-400 uppercase tracking-wider font-bold">Período a reportar</p>
              <p className="text-[#F5A623] font-bold text-sm mt-0.5">
                {tab === "weekly" ? "Semana 35, Ago 2026" : "Agosto 2026"}
              </p>
            </div>
          </div>

          {/* Images */}
          <div className="bg-white rounded-xl border border-zinc-100 p-3">
            <p className="text-[11px] font-bold text-zinc-800 mb-2">Informes e Imágenes</p>
            <div className="grid grid-cols-2 gap-2">
              {/* Box 1 — interactive toggle */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-700 mb-1">Informe de Ventas</p>
                {hasImg1 ? (
                  <div className="relative h-16">
                    <div className="w-full h-full rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center">
                      <ChartPlaceholder label="Ventas" color="#F5A623" />
                    </div>
                    <button onClick={() => setHasImg1(false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X size={8} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setHasImg1(true)}
                    className="w-full h-16 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors bg-white"
                  >
                    <Upload size={14} />
                    <span className="text-[9px] font-medium">Subir imagen</span>
                  </button>
                )}
              </div>

              {/* Box 2 — interactive toggle */}
              <div>
                <p className="text-[10px] font-semibold text-zinc-700 mb-1">Informe de Recaudo</p>
                {hasImg2 ? (
                  <div className="relative h-16">
                    <div className="w-full h-full rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center">
                      <ChartPlaceholder label="Recaudo" color="#2D7DD2" />
                    </div>
                    <button onClick={() => setHasImg2(false)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5">
                      <X size={8} />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setHasImg2(true)}
                    className="w-full h-16 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-400 hover:border-[#F5A623] hover:text-[#F5A623] transition-colors bg-white"
                  >
                    <Upload size={14} />
                    <span className="text-[9px] font-medium">Subir imagen</span>
                  </button>
                )}
              </div>

              {/* Static boxes */}
              {["Top 5 Ventas", "Top 5 Recaudo"].map((l) => (
                <div key={l}>
                  <p className="text-[10px] font-semibold text-zinc-700 mb-1">{l}</p>
                  <div className="w-full h-16 border-2 border-dashed border-zinc-200 rounded-lg flex flex-col items-center justify-center gap-1 text-zinc-400 bg-white">
                    <Upload size={14} />
                    <span className="text-[9px] font-medium">Subir imagen</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-white rounded-xl border border-zinc-100 p-3">
            <p className="text-[11px] font-bold text-zinc-800 mb-2">Comentarios adicionales</p>
            <div className="input-field text-[10px] text-zinc-400 h-12 flex items-start pt-2 resize-none">
              Observaciones, highlights de la semana...
            </div>
          </div>

          {/* Submit */}
          <button className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-2">
            Guardar Reporte
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Step 4: Presentation ─────────────────────────────────────────────────────

function Step4() {
  const [slide, setSlide] = useState(0);
  const slides = [
    { type: "cover" },
    { type: "area", name: "Andina", color: "#F5A623", ini: "AN", period: "Semana 35, Ago 2026" },
    { type: "area", name: "Antioquia", color: "#E8951E", ini: "AT", period: "Semana 35, Ago 2026" },
  ];
  const total = slides.length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* Explanation */}
      <div>
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
          Paso 4 de 4
        </div>
        <h2 className="text-2xl font-bold text-zinc-900 mb-2">Modo Presentación</h2>
        <p className="text-zinc-500 text-sm mb-6 leading-relaxed">
          El botón <strong className="text-amber-600">Modo Presentación</strong> abre una vista oscura de pantalla completa para compartir en reuniones o por videoconferencia.
        </p>
        <div className="bg-white rounded-2xl border border-zinc-100 p-5 space-y-0.5">
          <Callout num={1}>
            La primera diapositiva es una <strong>portada</strong> con el nombre del período y cuántas zonas reportaron.
          </Callout>
          <Callout num={2}>
            Usa las <strong>flechas ← →</strong> del teclado o los botones en pantalla para pasar de zona en zona.
          </Callout>
          <Callout num={3}>
            Cambia entre <strong>Semanal y Mensual</strong> desde la barra superior, y filtra por período anterior con el selector.
          </Callout>
          <Callout num={4}>
            Haz clic sobre cualquier imagen para verla ampliada en pantalla completa (lightbox).
          </Callout>
          <Callout num={5}>
            Presiona <strong>X Salir</strong> en la esquina superior izquierda para volver al menú principal.
          </Callout>
        </div>
        <div className="mt-4 bg-blue-50 border border-blue-100 rounded-xl px-4 py-3">
          <p className="text-xs text-blue-700 font-semibold">🔵 Interactivo</p>
          <p className="text-xs text-blue-600 mt-0.5">La maqueta de la derecha muestra las 3 diapositivas — usa las flechas para navegar.</p>
        </div>
      </div>

      {/* Mockup — dark presentation */}
      <div className="bg-[#0f0f0f] rounded-2xl overflow-hidden border border-zinc-700 shadow-2xl text-white select-none" style={{ minHeight: 420 }}>
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-black/60 border-b border-white/5">
          <div className="flex items-center gap-1 text-white/40 text-[10px]">
            <X size={11} /> Salir
          </div>
          <div className="w-16 h-4 bg-white/10 rounded" />
          <div className="flex items-center gap-1.5">
            <div className="flex bg-white/10 rounded-md p-0.5 gap-0.5">
              <button className="px-2 py-0.5 rounded text-[9px] font-semibold bg-[#F5A623] text-white">Semanal</button>
              <button className="px-2 py-0.5 rounded text-[9px] font-semibold text-white/40">Mensual</button>
            </div>
            <button className="flex items-center gap-1 bg-white/10 text-white text-[9px] font-semibold px-2 py-1 rounded-md">
              Semana 35, Ago 2026 <ChevronDown size={9} />
            </button>
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-1.5 py-1.5">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setSlide(i)}
              className={`rounded-full transition-all ${i === slide ? "w-4 h-1.5 bg-[#F5A623]" : "w-1.5 h-1.5 bg-white/20 hover:bg-white/40"}`}
            />
          ))}
        </div>

        {/* Slide content */}
        <div className="px-5 pb-4" style={{ minHeight: 280 }}>
          {slide === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center relative">
              <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-[#F5A623]/5 pointer-events-none" />
              <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full bg-[#F5A623]/5 pointer-events-none" />
              <div className="bg-white rounded-2xl px-6 py-2 shadow-xl mb-4">
                <div className="w-28 h-6 bg-zinc-100 rounded" />
              </div>
              <div className="w-8 h-0.5 bg-[#F5A623] rounded-full mb-3" />
              <p className="text-2xl font-bold text-white mb-1">Seguimiento <span className="text-[#F5A623]">Semanal</span></p>
              <p className="text-white/40 text-sm mb-5">Semana 35, Ago 2026</p>
              <div className="flex items-center gap-5 bg-white/5 border border-white/10 rounded-xl px-6 py-3">
                <div className="text-center">
                  <p className="text-2xl font-bold text-[#F5A623]">6</p>
                  <p className="text-white/30 text-[9px] uppercase tracking-wider">Áreas reportaron</p>
                </div>
                <div className="w-px h-6 bg-white/10" />
                <div className="text-center">
                  <p className="text-xs font-semibold text-white/60">martes, 2 sep 2026</p>
                  <p className="text-white/25 text-[9px] uppercase tracking-wider">Presentación</p>
                </div>
              </div>
              <p className="text-white/20 text-[9px] mt-4 flex items-center gap-1"><ChevronRight size={9} /> Presiona → para comenzar</p>
            </div>
          ) : (
            <div className="pt-2">
              {/* Area slide */}
              {(() => {
                const s = slides[slide] as { type: string; name: string; color: string; ini: string; period: string };
                return (
                  <div className="flex gap-3 h-52">
                    {/* Left panel */}
                    <div className="flex flex-col rounded-xl border border-white/10 overflow-hidden shrink-0" style={{ width: 120, background: "rgba(255,255,255,0.04)" }}>
                      <div className="h-1 shrink-0" style={{ backgroundColor: s.color }} />
                      <div className="flex-1 p-3 flex flex-col gap-2">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-sm" style={{ backgroundColor: s.color }}>{s.ini}</div>
                        <div>
                          <p className="text-white font-bold text-sm">{s.name}</p>
                          <p className="text-white/40 text-[9px]">Zona de Ventas</p>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#F5A623]" />
                          <span className="text-white/60 text-[9px]">{s.period}</span>
                        </div>
                        <div className="w-full h-px bg-white/10" />
                        <p className="text-white/50 text-[9px] leading-relaxed">{DUMMY_NOTES.slice(0, 80)}…</p>
                      </div>
                    </div>
                    {/* Images 2×2 */}
                    <div className="flex-1 grid grid-cols-2 grid-rows-2 gap-1.5">
                      {[
                        { l: "Informe de Ventas", c: "#F5A623" },
                        { l: "Informe de Recaudo", c: "#2D7DD2" },
                        { l: "Top 5 Ventas", c: "#F5A623" },
                        { l: "Top 5 Recaudo", c: "#2D7DD2" },
                      ].map(({ l, c }) => (
                        <div key={l} className="flex flex-col gap-0.5 min-h-0">
                          <p className="text-white/25 text-[7px] font-bold uppercase tracking-widest shrink-0">{l}</p>
                          <div className="flex-1 rounded-lg overflow-hidden bg-white min-h-0">
                            {l.startsWith("Top") ? <Top5Placeholder label="" color={c} /> : <ChartPlaceholder label="" color={c} />}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })()}
            </div>
          )}
        </div>

        {/* Nav bar */}
        <div className="flex items-center justify-between px-4 py-2 border-t border-white/5 bg-black/30">
          <button
            onClick={() => setSlide((s) => Math.max(0, s - 1))}
            disabled={slide === 0}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 transition-colors text-[10px] font-semibold"
          >
            <ChevronLeft size={12} /> Anterior
          </button>
          <span className="text-white/20 text-[10px]">{slide + 1} / {total} · ← → navegar</span>
          <button
            onClick={() => setSlide((s) => Math.min(total - 1, s + 1))}
            disabled={slide === total - 1}
            className="flex items-center gap-1 px-3 py-1 rounded-lg bg-white/10 disabled:opacity-20 hover:bg-white/20 transition-colors text-[10px] font-semibold"
          >
            Siguiente <ChevronRight size={12} />
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Summary ──────────────────────────────────────────────────────────────────

function Summary() {
  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="text-5xl mb-4">🎉</div>
      <h2 className="text-2xl font-bold text-zinc-900 mb-3">¡Ya sabes cómo usar la plataforma!</h2>
      <p className="text-zinc-500 text-sm mb-8 leading-relaxed">
        En resumen: entra a tu zona → carga tus imágenes semanales o mensuales → guarda el reporte. El equipo directivo lo verá en el Modo Presentación.
      </p>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
        {[
          { emoji: "🏠", label: "Elige tu zona", sub: "Pantalla principal" },
          { emoji: "📋", label: "Revisa el historial", sub: "Reportes anteriores" },
          { emoji: "📤", label: "Sube tu reporte", sub: "Imágenes + comentarios" },
          { emoji: "🎬", label: "Presentación", sub: "Para reuniones" },
        ].map((c) => (
          <div key={c.label} className="bg-white rounded-2xl border border-zinc-100 p-4 text-center">
            <div className="text-2xl mb-2">{c.emoji}</div>
            <p className="text-sm font-bold text-zinc-800">{c.label}</p>
            <p className="text-[11px] text-zinc-400 mt-0.5">{c.sub}</p>
          </div>
        ))}
      </div>
      <Link
        href="/"
        className="inline-flex items-center gap-2 bg-[#F5A623] text-white font-semibold px-6 py-3 rounded-xl hover:bg-amber-500 transition-colors"
      >
        <Home size={16} /> Ir a la plataforma
      </Link>
    </div>
  );
}

// ─── Main demo page ───────────────────────────────────────────────────────────

export default function DemoPage() {
  const [step, setStep] = useState(0); // 0-3 = steps, 4 = summary

  const stepContent = [<Step1 key={1} />, <Step2 key={2} />, <Step3 key={3} />, <Step4 key={4} />];

  return (
    <div className="min-h-screen bg-zinc-50">
      {/* Navbar */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="text-zinc-400 hover:text-zinc-700 transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <Image src="/logo.jpeg" alt="Merquellantas" width={160} height={40} className="object-contain" priority />
          </div>
          <span className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Guía de uso</span>
        </div>
      </header>

      {/* Hero */}
      <div className="bg-white border-b border-zinc-100">
        <div className="max-w-7xl mx-auto px-6 py-10 text-center">
          <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            📖 Tutorial interactivo
          </div>
          <h1 className="text-3xl font-bold text-zinc-900 mb-3">¿Cómo usar Seguimiento MQ?</h1>
          <p className="text-zinc-500 max-w-xl mx-auto text-sm leading-relaxed">
            Esta guía te explica paso a paso cómo ingresar a tu zona, ver reportes anteriores, subir un nuevo informe y usar el Modo Presentación.
          </p>
        </div>
      </div>

      {/* Step indicator */}
      {step < 4 && (
        <div className="sticky top-16 z-40 bg-white/95 backdrop-blur border-b border-zinc-100">
          <div className="max-w-7xl mx-auto px-6 py-3">
            <div className="flex items-center gap-1 overflow-x-auto">
              {STEPS.map((s, i) => (
                <button
                  key={s.id}
                  onClick={() => setStep(i)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-semibold whitespace-nowrap transition-all shrink-0 ${
                    i === step
                      ? "bg-[#F5A623] text-white shadow-sm"
                      : i < step
                      ? "bg-amber-50 text-amber-700 border border-amber-200"
                      : "bg-zinc-50 text-zinc-400 border border-zinc-100"
                  }`}
                >
                  {i < step ? <Check size={14} /> : <span>{s.emoji}</span>}
                  <span className="hidden sm:inline">{s.title}</span>
                  <span className="sm:hidden">{s.id}</span>
                </button>
              ))}
              <div className="flex-1 h-px bg-zinc-100 mx-2 hidden sm:block" />
              <div className="text-xs text-zinc-400 font-medium shrink-0 hidden sm:block">
                {step < 4 ? `${step + 1} de 4` : "Completado"}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Step content */}
      <main className="max-w-7xl mx-auto px-6 py-10">
        {step < 4 ? stepContent[step] : <Summary />}

        {/* Navigation */}
        {step < 4 && (
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-zinc-200">
            <button
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-zinc-200 bg-white text-zinc-700 font-semibold text-sm hover:bg-zinc-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <ArrowLeft size={15} /> Anterior
            </button>

            <div className="flex gap-1.5">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(i)}
                  className={`rounded-full transition-all ${i === step ? "w-5 h-2 bg-[#F5A623]" : "w-2 h-2 bg-zinc-200 hover:bg-zinc-300"}`}
                />
              ))}
            </div>

            <button
              onClick={() => setStep((s) => s + 1)}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F5A623] text-white font-semibold text-sm hover:bg-amber-500 transition-colors"
            >
              {step === 3 ? "Ver resumen" : "Siguiente"} <ArrowRight size={15} />
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-6 border-t border-zinc-200 flex items-center justify-between">
        <Image src="/logo.jpeg" alt="Merquellantas" width={100} height={26} className="object-contain opacity-30" />
        <p className="text-xs text-zinc-400">Guía de uso interna — Seguimiento MQ</p>
      </footer>
    </div>
  );
}
