import { Router } from "express";
import {
  createMetadata,
  getVerifiedMetaData,
  getAllMetaData,
  getOwnerSpecificMetaData,
} from "../controllers/certificateMetadataController";

const certificateMetadata = Router();

certificateMetadata.post("/", createMetadata);
certificateMetadata.post("/by-name", getOwnerSpecificMetaData);
certificateMetadata.get("/verify/:credentialId", getVerifiedMetaData);
certificateMetadata.get("/", getAllMetaData);

export { certificateMetadata };
