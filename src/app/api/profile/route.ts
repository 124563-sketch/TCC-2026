import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcrypt";

export async function PATCH(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const body = await request.json();

  // ── Password change ──────────────────────────────────────────────────────
  if (body.currentPassword || body.newPassword) {
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword || typeof newPassword !== "string" || newPassword.length < 6) {
      return new Response("Senha atual e nova senha (mínimo 6 caracteres) são obrigatórias.", { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { password: true },
    });

    if (!user) {
      return new Response("Usuário não encontrado", { status: 404 });
    }

    const valid = await bcrypt.compare(currentPassword, user.password);
    if (!valid) {
      return new Response("Senha atual incorreta", { status: 403 });
    }

    const hashed = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: session.user.id },
      data: { password: hashed },
    });

    return NextResponse.json({ ok: true });
  }

  // ── Name update ──────────────────────────────────────────────────────────
  const { name } = body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    return new Response("Nome inválido", { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: session.user.id },
    data: { name: name.trim() },
    select: { id: true, name: true, email: true },
  });

  return NextResponse.json(user);
}

export async function DELETE() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  await prisma.user.delete({
    where: { id: session.user.id },
  });

  return new Response(null, { status: 204 });
}
