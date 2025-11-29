import mongoose, { Document, Model } from "mongoose";

export interface IThreat extends Document {
  userId: string;
  id: string;
  timestamp: Date;
  type: 'unauthorized_access' | 'brute_force' | 'anomaly' | 'intrusion';
  severity: 'critical' | 'high' | 'medium' | 'low';
  source: string;
  camera: string;
  description: string;
  status: 'active' | 'investigating' | 'resolved';
  createdAt: Date;
  updatedAt: Date;
}

const threatSchema = new mongoose.Schema<IThreat>(
  {
    userId: { type: String, required: true, index: true },
    id: { type: String, required: true },
    timestamp: { type: Date, required: true, default: Date.now },
    type: { 
      type: String, 
      enum: ['unauthorized_access', 'brute_force', 'anomaly', 'intrusion'], 
      required: true 
    },
    severity: { 
      type: String, 
      enum: ['critical', 'high', 'medium', 'low'], 
      required: true 
    },
    source: { type: String, required: true },
    camera: { type: String, required: true },
    description: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['active', 'investigating', 'resolved'], 
      required: true,
      default: 'active'
    },
  },
  {
    timestamps: true,
  }
);

threatSchema.index({ userId: 1, id: 1 }, { unique: true });
threatSchema.index({ userId: 1, status: 1 });

const Threat =
  (mongoose.models.Threat as Model<IThreat>) ||
  mongoose.model<IThreat>("Threat", threatSchema);

export default Threat;

