import { Router } from "express";
import {
  createMetadata,
  getVerifiedMetaData,
  getAllMetaData,
  getOwnerSpecificMetaData,
} from "../controllers/certificateMetadataController";

const certificateMetadata = Router();

certificateMetadata.post("/", createMetadata);
certificateMetadata.get("/verify/:credentialId", getVerifiedMetaData);
certificateMetadata.get("/", getAllMetaData);
certificateMetadata.post("/by-name", getOwnerSpecificMetaData);

export { certificateMetadata };
