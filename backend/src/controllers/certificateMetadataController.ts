import { Request, Response } from "express";
import CertificateMetadata from "../models/CertificateMetadata";
import { issueCredential, verify } from "@src/idl";

export const createMetadata = async (req: Request, res: Response) => {
  try {
    const metadata = req.body.metadata;

    const result = await issueCredential(metadata);

    if (!result) {
      res
        .status(500)
        .json({ success: false, message: "Failed to issue credential" });
    }

    // Save full metadata to DB
    await CertificateMetadata.create({
      credentialId: result.credentialId,
      credentialHash: result.credentialHash,
      txSignature: result.txSignature,
      issuerPublicKey: result.issuer,
      metadata,
    } as any);

    res.json({
      success: true,
      ...result,
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getMetadataByCertId = async (req: Request, res: Response) => {
  try {
    const certId = req.params.credentialId;

    const data = await CertificateMetadata.findOne({ credentialId: certId });
    if (!data) {
      res.status(404).json({
        success: false,
        message: "Certificate metadata not found",
      });
      return;
    }

    const verifyResult = await verify(certId, data.metadata);

    if (verifyResult?.isValid) {
      res.json({
        success: true,
        data,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "CertificateId does not match with onchain data",
      });
    }
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
