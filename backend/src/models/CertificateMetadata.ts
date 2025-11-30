import mongoose, { Schema, Document } from "mongoose";

export interface ICertificateMetadata extends Document {
  certificateId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const CertificateMetadataSchema = new Schema<ICertificateMetadata>(
  {
    certificateId: { type: String, required: true }, // unique cert ID
    metadata: { type: Object, required: true }, // dynamic JSON metadata
  },
  { timestamps: true }
);

export default mongoose.model<ICertificateMetadata>(
  "CertificateMetadata",
  CertificateMetadataSchema
);
