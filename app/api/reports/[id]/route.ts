import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/lib/models/Report";

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    const report = await Report.findById(params.id).lean();
    if (!report) return NextResponse.json({ error: "Reporte no encontrado" }, { status: 404 });
    return NextResponse.json({ report });
  } catch {
    return NextResponse.json({ error: "Error al obtener reporte" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await connectDB();
    await Report.findByIdAndDelete(params.id);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Error al eliminar reporte" }, { status: 500 });
  }
}
