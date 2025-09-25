import mongoose from "mongoose";
const { Schema } = mongoose;

const summarySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  sourceUrl: { type: String },
  rawInput: { type: String },
  extracted: { type: Schema.Types.Mixed, default: {} },
  aiSummary: { type: [String], default: [] },
  aiMetadata: { type: Schema.Types.Mixed, default: {} },
  tags: { type: [String], default: [] },
  createdAt: { type: Date, default: Date.now },
});

summarySchema.index({ userId: 1, createdAt: -1 });
summarySchema.index({ "extracted.title": "text", aiSummary: "text" });

export default mongoose.model("Summary", summarySchema);
