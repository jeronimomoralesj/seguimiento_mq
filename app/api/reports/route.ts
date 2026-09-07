import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/lib/models/Report";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const area = searchParams.get("area");
    const reportType = searchParams.get("reportType");
    const period = searchParams.get("period");

    const filter: Record<string, string> = {};
    if (area) filter.area = area;
    if (reportType) filter.reportType = reportType;
    if (period) filter.period = period;

    const reports = await Report.find(filter)
      .sort({ date: -1 })
      .select("-__v")
      .lean();

    return NextResponse.json({ reports });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al obtener reportes" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { area, areaType, reportType, period, periodLabel, notes } = body;
    if (!area || !areaType || !reportType || !period || !periodLabel) {
      return NextResponse.json({ error: "Campos requeridos faltantes" }, { status: 400 });
    }

    // Check max photo size (5MB each, base64 is ~1.37x original)
    const MAX_B64 = 7 * 1024 * 1024;
    for (const field of ["salesReportImage", "collectionReportImage", "top5SalesImage", "top5CollectionImage"]) {
      if (body[field] && body[field].length > MAX_B64) {
        return NextResponse.json({ error: `La imagen "${field}" supera el tamaño máximo` }, { status: 400 });
      }
    }
    if (body.photos) {
      for (const photo of body.photos) {
        if (photo && photo.length > MAX_B64) {
          return NextResponse.json({ error: "Una foto supera el tamaño máximo" }, { status: 400 });
        }
      }
    }

    const doc: Record<string, unknown> = {
      area,
      areaType,
      reportType,
      period,
      periodLabel,
      notes: notes || "",
      date: new Date(),
    };

    if (areaType === "sales_zone") {
      doc.salesReportImage = body.salesReportImage;
      doc.collectionReportImage = body.collectionReportImage;
      doc.top5SalesImage = body.top5SalesImage;
      doc.top5CollectionImage = body.top5CollectionImage;
    } else {
      doc.photos = (body.photos || []).filter(Boolean).slice(0, 3);
    }

    // Upsert: one report per area+type+period
    const report = await Report.findOneAndUpdate(
      { area, reportType, period },
      doc,
      { upsert: true, new: true }
    );

    return NextResponse.json({ report }, { status: 201 });
  } catch (err) {
    console.error(err);
    const message = err instanceof Error ? err.message : "Error al guardar reporte";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
