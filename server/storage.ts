
import { db } from "./db";
import { verifications, type Verification, type InsertVerification } from "@shared/schema";
import { eq } from "drizzle-orm";

export interface IStorage {
  createVerification(verification: InsertVerification & {
    authenticityStatus: string;
    confidenceScore: number;
    riskLevel: string;
    forgeryParameters?: string[];
  }): Promise<Verification>;
  getVerification(id: number): Promise<Verification | undefined>;
  listVerifications(): Promise<Verification[]>;
}

export class DatabaseStorage implements IStorage {
  async createVerification(verification: InsertVerification & {
    authenticityStatus: string;
    confidenceScore: number;
    riskLevel: string;
    forgeryParameters?: string[];
  }): Promise<Verification> {
    const [newVerification] = await db
      .insert(verifications)
      .values(verification)
      .returning();
    return newVerification;
  }

  async getVerification(id: number): Promise<Verification | undefined> {
    const [verification] = await db
      .select()
      .from(verifications)
      .where(eq(verifications.id, id));
    return verification;
  }

  async listVerifications(): Promise<Verification[]> {
    return await db.select().from(verifications).orderBy(verifications.createdAt);
  }
}

export const storage = new DatabaseStorage();
