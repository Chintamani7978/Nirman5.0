import mongoose, { Document, Model } from "mongoose";

export interface ICamera extends Document {
  userId: string;
  id: string;
  name: string;
  ip: string;
  status: 'secure' | 'vulnerable';
  risk: 'critical' | 'high' | 'medium' | 'low';
  securityChecks: {
    strongPassword: boolean;
    encryption: boolean;
    authentication: boolean;
    firewall: boolean;
    firmware: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const cameraSchema = new mongoose.Schema<ICamera>(
  {
    userId: { type: String, required: true, index: true },
    id: { type: String, required: true },
    name: { type: String, required: true },
    ip: { type: String, required: true },
    status: { 
      type: String, 
      enum: ['secure', 'vulnerable'], 
      required: true,
      default: 'vulnerable'
    },
    risk: { 
      type: String, 
      enum: ['critical', 'high', 'medium', 'low'], 
      required: true,
      default: 'medium'
    },
    securityChecks: {
      strongPassword: { type: Boolean, default: false },
      encryption: { type: Boolean, default: false },
      authentication: { type: Boolean, default: false },
      firewall: { type: Boolean, default: false },
      firmware: { type: Boolean, default: false },
    },
  },
  {
    timestamps: true,
  }
);

cameraSchema.index({ userId: 1, id: 1 }, { unique: true });

const Camera =
  (mongoose.models.Camera as Model<ICamera>) ||
  mongoose.model<ICamera>("Camera", cameraSchema);

export default Camera;

