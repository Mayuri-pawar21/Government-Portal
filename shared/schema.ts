
import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const verifications = pgTable("verifications", {
  id: serial("id").primaryKey(),
  referenceNumber: text("reference_number"),
  welfareScheme: text("welfare_scheme").notNull(),
  fileName: text("file_name").notNull(),
  fileSize: integer("file_size").notNull(),
  mimeType: text("mime_type").notNull(),
  
  // AI Analysis Results
  authenticityStatus: text("authenticity_status").notNull(), // 'Likely Genuine', 'Possibly Forged', 'Uncertain'
  confidenceScore: integer("confidence_score").notNull(), // 0-100
  riskLevel: text("risk_level").notNull(), // 'Low', 'Medium', 'High'
  
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertVerificationSchema = createInsertSchema(verifications).omit({ 
  id: true, 
  createdAt: true,
  authenticityStatus: true,
  confidenceScore: true,
  riskLevel: true 
});

export type Verification = typeof verifications.$inferSelect;
export type InsertVerification = z.infer<typeof insertVerificationSchema>;
