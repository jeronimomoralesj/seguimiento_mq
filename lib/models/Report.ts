import mongoose, { Schema, model, models } from "mongoose";

const ReportSchema = new Schema(
  {
    area: { type: String, required: true },
    areaType: { type: String, enum: ["sales_zone", "department", "linea"], required: true },
    reportType: { type: String, enum: ["weekly", "monthly"], required: true },
    period: { type: String, required: true },
    periodLabel: { type: String, required: true },
    date: { type: Date, default: Date.now },
    // Sales zone images
    salesReportImage: { type: String },
    collectionReportImage: { type: String },
    top5SalesImage: { type: String },
    top5CollectionImage: { type: String },
    // Sales zone commitments
    salesCommitment: { type: String, default: "" },
    collectionCommitment: { type: String, default: "" },
    // Department photos (max 3)
    photos: [{ type: String }],
    // Common
    notes: { type: String, default: "" },
  },
  { timestamps: true }
);

// Unique: one report per area per period per type
ReportSchema.index({ area: 1, reportType: 1, period: 1 }, { unique: true });

export const Report = models.Report || model("Report", ReportSchema);
