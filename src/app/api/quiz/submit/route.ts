import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { QUIZ_DATA } from "@/lib/quiz-data";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return new Response("Não autorizado", { status: 401 });
  }

  const body = await req.json();
  const { moduleId, answers } = body as { moduleId: string; answers: number[] };

  const quizData = QUIZ_DATA[moduleId];
  if (!quizData) {
    return new Response("Módulo não encontrado", { status: 404 });
  }

  if (!Array.isArray(answers) || answers.length !== quizData.questions.length) {
    return new Response("Respostas inválidas", { status: 400 });
  }

  let score = 0;
  const results = quizData.questions.map((q, i) => {
    const correct = answers[i] === q.correctIndex;
    if (correct) score++;
    return { correct, correctIndex: q.correctIndex, explanation: q.explanation };
  });

  await prisma.quizAttempt.create({
    data: {
      userId: session.user.id,
      moduleId,
      score,
      answers: JSON.stringify(answers),
    },
  });

  return NextResponse.json({ score, total: quizData.questions.length, results });
}
