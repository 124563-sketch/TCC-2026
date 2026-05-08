import { PrismaClient } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";

function createPrismaClient() {
  const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";

  const url = rawUrl.startsWith("file:./")
    ? `file:${path.resolve(process.cwd(), rawUrl.slice("file:./".length))}`
    : rawUrl;

  const adapter = new PrismaLibSql({ url });

  return new PrismaClient({ adapter } as any);
}

const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || createPrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
