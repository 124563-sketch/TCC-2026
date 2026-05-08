import "dotenv/config";
import { PrismaClient, Role } from "@prisma/client";
import { PrismaLibSql } from "@prisma/adapter-libsql";
import path from "path";
import bcrypt from "bcrypt";

const rawUrl = process.env.DATABASE_URL ?? "file:./dev.db";
const url = rawUrl.startsWith("file:./")
  ? `file:${path.resolve(process.cwd(), rawUrl.slice("file:./".length))}`
  : rawUrl;

const prisma = new PrismaClient({ adapter: new PrismaLibSql({ url }) } as any);

async function main() {
  const email = "supervisor@mlascent.com";
  const password = "supervisor123";

  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log("Supervisor ja existe:", existing.email);
    return;
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name: "Supervisor",
      role: Role.SUPERVISOR,
    },
  });

  console.log("Supervisor criado:", email);
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
