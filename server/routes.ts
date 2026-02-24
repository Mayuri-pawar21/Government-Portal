
import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";
import multer from "multer";

const upload = multer({ storage: multer.memoryStorage() });

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.post(api.verifications.create.path, upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "Image file is required" });
      }

      // Validate other fields
      const input = api.verifications.create.input.parse(req.body);

      // MOCK AI ANALYSIS
      // In a real system, we would send req.file.buffer to an external AI service.
      // Here we simulate the analysis.
      
      const isForged = Math.random() > 0.7; // 30% chance of forgery for demo
      const confidenceScore = Math.floor(Math.random() * 20) + 80; // 80-99% confidence
      
      let authenticityStatus = "Likely Genuine";
      let riskLevel = "Low";
      let forgeryParameters: string[] = [];

      if (isForged) {
        authenticityStatus = "Possibly Forged";
        riskLevel = "High";
        forgeryParameters = [
          "Pixel Manipulation (Resampling Detected)",
          "Metadata Inconsistency",
          "Compression Artifacts"
        ];
      } else if (Math.random() > 0.8) {
        authenticityStatus = "Uncertain";
        riskLevel = "Medium";
        forgeryParameters = ["Inconclusive Noise Pattern"];
      }

      const verification = await storage.createVerification({
        referenceNumber: input.referenceNumber,
        welfareScheme: input.welfareScheme,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
        authenticityStatus,
        confidenceScore,
        riskLevel,
        forgeryParameters
      });

      res.status(201).json(verification);
    } catch (err) {
      if (err instanceof z.ZodError) {
        return res.status(400).json({
          message: err.errors[0].message,
          field: err.errors[0].path.join('.'),
        });
      }
      res.status(500).json({ message: "Internal Server Error" });
    }
  });

  app.get(api.verifications.get.path, async (req, res) => {
    const verification = await storage.getVerification(Number(req.params.id));
    if (!verification) {
      return res.status(404).json({ message: 'Verification not found' });
    }
    res.json(verification);
  });

  app.get(api.verifications.list.path, async (req, res) => {
    const verifications = await storage.listVerifications();
    res.json(verifications);
  });

  return httpServer;
}
