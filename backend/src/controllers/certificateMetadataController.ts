import { Request, Response } from "express";
import CertificateMetadata from "../models/CertificateMetadata";
import { issueCredential, verify } from "../idl";

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
      adminPublicKey: result.issuer,
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

export const getVerifiedMetaData = async (req: Request, res: Response) => {
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
      res.json(data);
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

export const getAllMetaData = async (req: Request, res: Response) => {
  try {
    const data = await CertificateMetadata.find();
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getOwnerSpecificMetaData = async (req: Request, res: Response) => {
  try {
    const recipientName = req.body.recipientName;
    const data = await CertificateMetadata.find({
      "metadata.fields": {
        $elemMatch: {
          id: "recipientName",
          value: { $regex: recipientName, $options: "i" }, // includes, case insensitive
        },
      },
    });
    res.json(data);
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ success: false, message: err.message });
  }
};
