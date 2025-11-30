import { Router } from "express";
import {
  createTemplate,
  getTemplates,
} from "../controllers/templateController";

const templateRoutes = Router();

templateRoutes.post("/", createTemplate);
templateRoutes.get("/", getTemplates);

export { templateRoutes };
