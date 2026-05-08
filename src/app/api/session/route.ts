import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { totalPracticeSeconds: true },
  });

  if (!user) {
    return new Response("Usuário não encontrado", { status: 404 });
  }

  return NextResponse.json({ totalPracticeSeconds: user.totalPracticeSeconds });
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const body = await request.json();
  const { seconds } = body;

  if (typeof seconds !== "number" || seconds <= 0) {
    return new Response("Segundos inválidos", { status: 400 });
  }

  const rounded = Math.round(seconds);

  await prisma.user.update({
    where: { id: session.user.id },
    data: { totalPracticeSeconds: { increment: rounded } },
  });

  return NextResponse.json({ ok: true });
}
