import mongoose, { Schema, Document } from "mongoose";

interface IField {
  id: string;
  label: string;
  type: string;
}

export interface ITemplate extends Document {
  templateName: string;
  fields: IField[];
  logo: string;
  signature: string;
  createdAt: Date;
}

const FieldSchema = new Schema<IField>({
  id: { type: String, required: true },
  label: { type: String, required: true },
  type: { type: String, required: true },
});

const TemplateSchema = new Schema<ITemplate>(
  {
    templateName: { type: String, required: true },
    fields: { type: [FieldSchema], required: true },
    logo: { type: String }, // base64 string
    signature: { type: String }, // base64 string
  },
  { timestamps: true }
);

export default mongoose.model<ITemplate>("Template", TemplateSchema);
