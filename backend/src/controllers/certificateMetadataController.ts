import { Request, Response } from "express";
import CertificateMetadata from "../models/CertificateMetadata";

export const createMetadata = async (req: Request, res: Response) => {
  try {
    const saved = await CertificateMetadata.create(req.body);

    res.status(201).json({
      success: true,
      data: saved,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to save certificate metadata",
      error: err,
    });
  }
};

export const getMetadataByCertId = async (req: Request, res: Response) => {
  const certId = req.params.certificateId;

  const data = await CertificateMetadata.findOne({ certificateId: certId });
  res.json(data);
};
