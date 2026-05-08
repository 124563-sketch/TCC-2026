import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const records = await prisma.moduleProgress.findMany({
    where: { userId: session.user.id },
    select: { moduleId: true, status: true },
  });

  const progress: Record<string, string> = {};
  for (const r of records) {
    progress[r.moduleId] = r.status;
  }

  return NextResponse.json(progress);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const body = await request.json();
  const { moduleId, status } = body;

  if (!moduleId || !status || !["not_started", "in_progress", "completed"].includes(status)) {
    return new Response("Dados inválidos", { status: 400 });
  }

  await prisma.moduleProgress.upsert({
    where: { userId_moduleId: { userId: session.user.id, moduleId } },
    update: { status },
    create: { userId: session.user.id, moduleId, status },
  });

  return NextResponse.json({ ok: true });
}
