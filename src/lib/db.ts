import { PrismaClient } from "@prisma/client";
import fs from "fs";
import path from "path";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getDatabaseUrl() {
  if (process.env.VERCEL || process.env.NODE_ENV === "production") {
    const tmpDbPath = path.join("/tmp", "dev.db");
    const sourceDbPath = path.join(process.cwd(), "prisma", "dev.db");
    const altSourceDbPath = path.join(process.cwd(), "dev.db");

    if (!fs.existsSync(tmpDbPath)) {
      try {
        if (fs.existsSync(sourceDbPath)) {
          fs.copyFileSync(sourceDbPath, tmpDbPath);
        } else if (fs.existsSync(altSourceDbPath)) {
          fs.copyFileSync(altSourceDbPath, tmpDbPath);
        }
      } catch (err) {
        console.error("Vercel DB copy notice:", err);
      }
    }
    return `file:${tmpDbPath}`;
  }
  return process.env.DATABASE_URL || "file:./dev.db";
}

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    datasources: {
      db: {
        url: getDatabaseUrl(),
      },
    },
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
