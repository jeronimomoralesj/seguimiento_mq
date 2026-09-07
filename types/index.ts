export type AreaType = "sales_zone" | "department";

export interface Area {
  slug: string;
  name: string;
  type: AreaType;
  color: string;
}

export type ReportPeriodType = "weekly" | "monthly";

export interface Report {
  _id?: string;
  area: string;
  areaType: AreaType;
  reportType: ReportPeriodType;
  period: string; // "2024-W01" or "2024-01"
  periodLabel: string; // "Semana 1, Ene 2024" or "Enero 2024"
  date: string;
  // Sales zone fields
  salesReportImage?: string;
  collectionReportImage?: string;
  top5SalesImage?: string;
  top5CollectionImage?: string;
  // Department fields
  photos?: string[];
  // Common
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AREAS: Area[] = [
  // Sales zones
  { slug: "andina", name: "Andina", type: "sales_zone", color: "#F5A623" },
  { slug: "antioquia", name: "Antioquia", type: "sales_zone", color: "#E8951E" },
  { slug: "caribe", name: "Caribe", type: "sales_zone", color: "#D4831A" },
  { slug: "centro-oriente", name: "Centro Oriente", type: "sales_zone", color: "#C07016" },
  { slug: "sur-occidente", name: "Sur Occidente", type: "sales_zone", color: "#AB5E12" },
  { slug: "venta-telefonica", name: "Venta Telefónica", type: "sales_zone", color: "#964B0E" },
  // Departments
  { slug: "supply-chain", name: "Supply Chain", type: "department", color: "#2D2D2D" },
  { slug: "mercadeo", name: "Mercadeo", type: "department", color: "#3D3D3D" },
  { slug: "recaudo", name: "Recaudo", type: "department", color: "#4D4D4D" },
  { slug: "sistemas", name: "Sistemas", type: "department", color: "#5D5D5D" },
  { slug: "departamento-de-la-gente", name: "Departamento de la Gente", type: "department", color: "#6D6D6D" },
  { slug: "tbr", name: "T.B.R", type: "department", color: "#F5A623" },
  { slug: "sr-rin-bat-cst", name: "SR-RIN-BAT-CST", type: "department", color: "#E8951E" },
  { slug: "pcr", name: "PCR", type: "department", color: "#D4831A" },
  { slug: "lubricantes", name: "Lubricantes", type: "department", color: "#C07016" },
  { slug: "cartera", name: "Cartera", type: "department", color: "#AB5E12" },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function isoWeekNumber(d: Date): number {
  const day = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayOfWeek = day.getUTCDay() || 7; // Mon=1 ... Sun=7
  day.setUTCDate(day.getUTCDate() + 4 - dayOfWeek); // nearest Thursday
  const yearStart = new Date(Date.UTC(day.getUTCFullYear(), 0, 1));
  return Math.ceil(((day.getTime() - yearStart.getTime()) / 86400000 + 1) / 7);
}

export function getCurrentPeriod(type: ReportPeriodType): { period: string; label: string } {
  const now = new Date();

  if (type === "monthly") {
    // Report covers the PREVIOUS month
    const prev = new Date(now.getFullYear(), now.getMonth() - 1, 1);
    const y = prev.getFullYear();
    const m = String(prev.getMonth() + 1).padStart(2, "0");
    return { period: `${y}-${m}`, label: `${MONTHS[prev.getMonth()]} ${y}` };
  } else {
    // Report covers the PREVIOUS week
    // Find Monday of the current week
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1..Sun=7
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - (dayOfWeek - 1));
    thisMonday.setHours(0, 0, 0, 0);

    // Previous week's Monday
    const prevMonday = new Date(thisMonday);
    prevMonday.setDate(thisMonday.getDate() - 7);

    const week = isoWeekNumber(prevMonday);
    const w = String(week).padStart(2, "0");
    const y = prevMonday.getFullYear();
    const monthName = MONTHS[prevMonday.getMonth()];

    return {
      period: `${y}-W${w}`,
      label: `Semana ${week}, ${monthName} ${y}`,
    };
  }
}
