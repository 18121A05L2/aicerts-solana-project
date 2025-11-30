import { Request, Response } from "express";
import Template from "../models/Template";

export const createTemplate = async (req: Request, res: Response) => {
  try {
    const template = await Template.create(req.body);
    res.status(201).json({
      success: true,
      data: template,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Failed to create template",
      error: err,
    });
  }
};

export const getTemplates = async (_: Request, res: Response) => {
  const templates = await Template.find().sort({ createdAt: -1 });
  res.json(templates);
};
