import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const moduleId = searchParams.get("moduleId");

  const where = moduleId
    ? { userId: session.user.id, moduleId }
    : { userId: session.user.id };

  const attempts = await prisma.quizAttempt.findMany({
    where,
    orderBy: { completedAt: "desc" },
    select: { id: true, moduleId: true, score: true, answers: true, completedAt: true },
  });

  return NextResponse.json(attempts);
}
