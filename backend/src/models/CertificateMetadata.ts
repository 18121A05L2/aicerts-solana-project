import mongoose, { Schema, Document } from "mongoose";

export interface ICertificateMetadata extends Document {
  credentialId: string;
  metadata: Record<string, any>;
  createdAt: Date;
}

const CertificateMetadataSchema = new Schema<ICertificateMetadata>(
  {
    credentialId: { type: String, required: true }, // unique cert ID
    metadata: { type: Object, required: true }, // dynamic JSON metadata
  },
  { timestamps: true, strict: false }
);

export default mongoose.model<ICertificateMetadata>(
  "CertificateMetadata",
  CertificateMetadataSchema
);
