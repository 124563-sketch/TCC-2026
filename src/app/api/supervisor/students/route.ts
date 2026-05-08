import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  if (session.user.role !== "SUPERVISOR") {
    return new Response("Acesso restrito a supervisores", { status: 403 });
  }

  const students = await prisma.user.findMany({
    where: { role: "STUDENT" },
    select: {
      id: true,
      name: true,
      email: true,
      totalPracticeSeconds: true,
      createdAt: true,
      moduleProgress: {
        select: { moduleId: true, status: true, updatedAt: true },
      },
      quizAttempts: {
        select: { moduleId: true, score: true, completedAt: true },
        orderBy: { completedAt: "desc" },
      },
    },
    orderBy: { name: "asc" },
  });

  return NextResponse.json(students);
}
