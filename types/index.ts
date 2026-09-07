export type AreaType = "sales_zone" | "department" | "linea";

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
  period: string; // "2026-09-W2" or "2026-01"
  periodLabel: string; // "Semana 2, Sep 2026" or "Enero 2026"
  date: string;
  // Sales zone fields
  salesReportImage?: string;
  collectionReportImage?: string;
  top5SalesImage?: string;
  top5CollectionImage?: string;
  salesCommitment?: string;
  collectionCommitment?: string;
  // Department / linea fields
  photos?: string[];
  // Common
  notes: string;
  createdAt?: string;
  updatedAt?: string;
}

export const AREAS: Area[] = [
  // Sales zones
  { slug: "andina",                name: "Andina",                  type: "sales_zone", color: "#F5A623" },
  { slug: "antioquia",             name: "Antioquia",               type: "sales_zone", color: "#E8951E" },
  { slug: "caribe",                name: "Caribe",                  type: "sales_zone", color: "#D4831A" },
  { slug: "centro-oriente",        name: "Centro Oriente",          type: "sales_zone", color: "#C07016" },
  { slug: "sur-occidente",         name: "Sur Occidente",           type: "sales_zone", color: "#AB5E12" },
  { slug: "venta-telefonica",      name: "Venta Telefónica",        type: "sales_zone", color: "#964B0E" },
  { slug: "admon-nacional-flotas", name: "Admon Nacional y Flotas", type: "sales_zone", color: "#7A3B0A" },
  { slug: "general",               name: "General",                 type: "sales_zone", color: "#5C2A07" },
  // Líneas
  { slug: "tbr",            name: "T.B.R",          type: "linea", color: "#F5A623" },
  { slug: "sr-rin-bat",     name: "SR-RIN-BAT",     type: "linea", color: "#E8951E" },
  { slug: "cst",            name: "CST",             type: "linea", color: "#C8781A" },
  { slug: "plt",            name: "PLT",             type: "linea", color: "#D4831A" },
  { slug: "pcr",            name: "PCR",             type: "linea", color: "#C07016" },
  { slug: "lubricantes",    name: "Lubricantes",     type: "linea", color: "#AB5E12" },
  // Departments
  { slug: "supply-chain",             name: "Supply Chain",             type: "department", color: "#2D2D2D" },
  { slug: "mercadeo",                 name: "Mercadeo",                 type: "department", color: "#3D3D3D" },
  { slug: "recaudo",                  name: "Recaudo",                  type: "department", color: "#4D4D4D" },
  { slug: "sistemas",                 name: "Sistemas",                 type: "department", color: "#5D5D5D" },
  { slug: "departamento-de-la-gente", name: "Departamento de la Gente", type: "department", color: "#6D6D6D" },
  { slug: "cartera",                  name: "Cartera",                  type: "department", color: "#964B0E" },
  { slug: "tesoreria",               name: "Tesorería",                type: "department", color: "#7A5C3A" },
];

export function getArea(slug: string): Area | undefined {
  return AREAS.find((a) => a.slug === slug);
}

const MONTHS = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

function weekOfMonth(monday: Date): number {
  // Find the Monday of the week that contains the 1st of monday's month
  const firstOfMonth = new Date(monday.getFullYear(), monday.getMonth(), 1);
  const firstDay = firstOfMonth.getDay() === 0 ? 7 : firstOfMonth.getDay(); // Mon=1..Sun=7
  const weekOneMonday = new Date(firstOfMonth);
  weekOneMonday.setDate(1 - (firstDay - 1));
  return Math.round((monday.getTime() - weekOneMonday.getTime()) / (7 * 24 * 60 * 60 * 1000)) + 1;
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
    // Report covers the CURRENT week
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay(); // Mon=1..Sun=7
    const thisMonday = new Date(now);
    thisMonday.setDate(now.getDate() - (dayOfWeek - 1));
    thisMonday.setHours(0, 0, 0, 0);

    const wom = weekOfMonth(thisMonday);
    const y = thisMonday.getFullYear();
    const m = String(thisMonday.getMonth() + 1).padStart(2, "0");
    const monthName = MONTHS[thisMonday.getMonth()];

    return {
      period: `${y}-${m}-W${wom}`,
      label: `Semana ${wom}, ${monthName} ${y}`,
    };
  }
}
