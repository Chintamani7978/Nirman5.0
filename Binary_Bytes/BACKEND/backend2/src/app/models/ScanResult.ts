import mongoose, { Document, Model } from "mongoose";

export interface IScanResult extends Document {
  userId: string;
  id: string;
  rtspUrl: string; // Encrypted RTSP URL
  rtspUrlHash: string; // Hash for searching without decrypting
  rtspUrlSignature?: string; // Digital signature
  rtspUrlTimestamp?: number; // When URL was signed
  vulnerabilities: string[];
  riskScore: number;
  status: 'critical' | 'high' | 'medium' | 'low';
  timestamp: Date;
  findings: {
    weakPassword: boolean;
    openPorts: string[];
    outdatedFirmware: boolean;
    unencryptedStream: boolean;
    defaultCredentials: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const scanResultSchema = new mongoose.Schema<IScanResult>(
  {
    userId: { type: String, required: true, index: true },
    id: { type: String, required: true },
    rtspUrl: { type: String, required: true }, // Encrypted
    rtspUrlHash: { type: String, required: true, index: true }, // For searching
    rtspUrlSignature: { type: String }, // Digital signature
    rtspUrlTimestamp: { type: Number }, // Signature timestamp
    vulnerabilities: [{ type: String }],
    riskScore: { type: Number, required: true, min: 0, max: 100 },
    status: { 
      type: String, 
      enum: ['critical', 'high', 'medium', 'low'], 
      required: true 
    },
    timestamp: { type: Date, required: true, default: Date.now },
    findings: {
      weakPassword: { type: Boolean, default: false },
      openPorts: [{ type: String }],
      outdatedFirmware: { type: Boolean, default: false },
      unencryptedStream: { type: Boolean, default: false },
      defaultCredentials: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

scanResultSchema.index({ userId: 1, id: 1 }, { unique: true });
scanResultSchema.index({ userId: 1, status: 1 });

const ScanResult =
  (mongoose.models.ScanResult as Model<IScanResult>) ||
  mongoose.model<IScanResult>("ScanResult", scanResultSchema);

export default ScanResult;

