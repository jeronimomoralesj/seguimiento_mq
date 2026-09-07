"use client";
import Link from "next/link";
import Image from "next/image";
import { AREAS } from "@/types";
import { Monitor } from "lucide-react";

const salesZones = AREAS.filter((a) => a.type === "sales_zone");
const departments = AREAS.filter((a) => a.type === "department");

export default function HomePage() {
  return (
    <div className="min-h-screen bg-zinc-50">
      {/* ── Navbar ── */}
      <header className="bg-white border-b border-zinc-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Image src="/logo.jpeg" alt="Merquellantas" width={180} height={46} className="object-contain" priority />
          <Link
            href="/presentation"
            className="inline-flex items-center gap-2 bg-[#F5A623] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-amber-500 transition-colors"
          >
            <Monitor size={16} />
            Modo Presentación
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10">
        {/* Page title */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold text-zinc-900">Seguimiento de Gestión</h1>
          <p className="text-zinc-500 text-sm mt-1">Selecciona tu área para ingresar o consultar reportes</p>
        </div>

        {/* ── Sales Zones ── */}
        <section className="mb-10">
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-[#F5A623]" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Líderes de Zona</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
            {salesZones.map((area) => <AreaCard key={area.slug} area={area} />)}
          </div>
        </section>

        {/* ── Departments ── */}
        <section>
          <div className="flex items-center gap-2 mb-5">
            <span className="w-1 h-5 rounded-full bg-zinc-400" />
            <h2 className="text-xs font-bold uppercase tracking-widest text-zinc-500">Departamentos</h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {departments.map((area) => <AreaCard key={area.slug} area={area} />)}
          </div>
        </section>
      </main>

      {/* Footer with logo */}
      <footer className="max-w-7xl mx-auto px-6 py-8 mt-6 border-t border-zinc-200 flex items-center justify-between">
        <Image src="/logo.jpeg" alt="Merquellantas" width={120} height={30} className="object-contain opacity-40" />
        <p className="text-xs text-zinc-400">Plataforma interna de seguimiento</p>
      </footer>
    </div>
  );
}

function AreaCard({ area }: { area: (typeof AREAS)[0] }) {
  const initials = area.name.split(" ").map((w) => w[0]).slice(0, 2).join("").toUpperCase();
  const isSales = area.type === "sales_zone";

  return (
    <Link
      href={`/area/${area.slug}`}
      className="group bg-white rounded-2xl border border-zinc-100 p-5 flex flex-col items-center text-center hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
    >
      <div
        className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base mb-3 group-hover:scale-105 transition-transform"
        style={{ backgroundColor: area.color }}
      >
        {initials}
      </div>
      <span className="text-sm font-semibold text-zinc-800 leading-tight">{area.name}</span>
      <span className="text-[11px] text-zinc-400 mt-1">{isSales ? "Zona de Ventas" : "Departamento"}</span>
    </Link>
  );
}
