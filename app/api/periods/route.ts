import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Report } from "@/lib/models/Report";

export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const reportType = searchParams.get("reportType");

    const filter: Record<string, string> = {};
    if (reportType) filter.reportType = reportType;

    // Aggregate distinct periods with their labels and report count
    const periods = await Report.aggregate([
      { $match: filter },
      {
        $group: {
          _id: "$period",
          periodLabel: { $first: "$periodLabel" },
          count: { $sum: 1 },
          latestDate: { $max: "$date" },
        },
      },
      { $sort: { _id: -1 } }, // newest first
      { $project: { period: "$_id", periodLabel: 1, count: 1, latestDate: 1, _id: 0 } },
    ]);

    return NextResponse.json({ periods });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: "Error al obtener períodos" }, { status: 500 });
  }
}
