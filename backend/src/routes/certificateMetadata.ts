import { Router } from "express";
import {
  createMetadata,
  getMetadataByCertId,
} from "../controllers/certificateMetadataController";

const certificateMetadata = Router();

certificateMetadata.post("/", createMetadata);
certificateMetadata.get("/:credentialId", getMetadataByCertId);

export { certificateMetadata };
