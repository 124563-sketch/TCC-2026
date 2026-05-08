"use client";

import { useState, useEffect } from "react";
import { Card } from "@/ui-forge/ui/card";
import { CheckCircle2, XCircle, RotateCcw, Trophy, ClipboardList, ChevronRight, Loader2 } from "lucide-react";
import { QUIZ_DATA, type QuizQuestion } from "@/lib/quiz-data";

type QuizResult = {
  correct: boolean;
  correctIndex: number;
  explanation: string;
};

type AttemptSummary = {
  id: string;
  moduleId: string;
  score: number;
  completedAt: string;
};

type Phase = "idle" | "active" | "submitted" | "loading";

export function QuizSection({ moduleId }: { moduleId: string }) {
  const quiz = QUIZ_DATA[moduleId];
  const [phase, setPhase] = useState<Phase>("idle");
  const [selected, setSelected] = useState<(number | null)[]>([]);
  const [results, setResults] = useState<QuizResult[]>([]);
  const [score, setScore] = useState(0);
  const [pastAttempts, setPastAttempts] = useState<AttemptSummary[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/quiz/results?moduleId=${moduleId}`)
      .then((r) => r.json())
      .then((data: AttemptSummary[]) => {
        if (Array.isArray(data)) setPastAttempts(data);
      })
      .catch(() => {});
  }, [moduleId]);

  if (!quiz) return null;

  const bestScore = pastAttempts.length > 0 ? Math.max(...pastAttempts.map((a) => a.score)) : null;

  function startQuiz() {
    setSelected(new Array(quiz.questions.length).fill(null));
    setResults([]);
    setPhase("active");
  }

  function selectOption(questionIndex: number, optionIndex: number) {
    setSelected((prev) => {
      const next = [...prev];
      next[questionIndex] = optionIndex;
      return next;
    });
  }

  async function submitQuiz() {
    if (selected.some((s) => s === null)) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ moduleId, answers: selected }),
      });
      const data = await res.json();
      setScore(data.score);
      setResults(data.results);
      setPhase("submitted");
      setPastAttempts((prev) => [
        { id: "new", moduleId, score: data.score, completedAt: new Date().toISOString() },
        ...prev,
      ]);
    } finally {
      setSubmitting(false);
    }
  }

  const allAnswered = selected.every((s) => s !== null);
  const total = quiz.questions.length;
  const pct = Math.round((score / total) * 100);

  return (
    <div className="mt-16 mb-12">
      {/* Section header */}
      <div className="flex items-center gap-4 mb-8">
        <div className="w-10 h-10 rounded-2xl bg-violet-600 flex items-center justify-center shrink-0">
          <ClipboardList className="w-5 h-5 text-white" />
        </div>
        <div>
          <h2 className="font-headline font-bold text-2xl text-slate-900">Quiz do Módulo</h2>
          <p className="text-slate-500 text-sm">
            {total} questões — verifique sua compreensão antes de prosseguir.
          </p>
        </div>
        {bestScore !== null && (
          <div className="ml-auto flex items-center gap-2 bg-violet-50 border border-violet-100 rounded-2xl px-4 py-2">
            <Trophy className="w-4 h-4 text-violet-500" />
            <span className="text-sm font-bold text-violet-700">
              Melhor: {bestScore}/{total}
            </span>
          </div>
        )}
      </div>

      {/* Idle state */}
      {phase === "idle" && (
        <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
          <div className="p-10 flex flex-col items-center text-center gap-6">
            <div className="w-20 h-20 rounded-3xl bg-violet-50 flex items-center justify-center">
              <ClipboardList className="w-10 h-10 text-violet-500" />
            </div>
            <div>
              <h3 className="font-headline font-bold text-xl text-slate-900 mb-2">
                Pronto para testar seus conhecimentos?
              </h3>
              <p className="text-slate-500 text-sm max-w-md">
                Responda as {total} questões sobre {quiz.moduleLabel}. Você receberá feedback detalhado com explicação de cada resposta.
              </p>
            </div>
            {pastAttempts.length > 0 && (
              <div className="w-full max-w-xs bg-slate-50 rounded-2xl p-4 text-left">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Tentativas anteriores</p>
                <div className="space-y-1.5">
                  {pastAttempts.slice(0, 3).map((a, i) => (
                    <div key={i} className="flex justify-between text-xs text-slate-600">
                      <span>{new Date(a.completedAt).toLocaleDateString("pt-BR")}</span>
                      <span className="font-bold tabular-nums">{a.score}/{total}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button
              onClick={startQuiz}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
            >
              {pastAttempts.length > 0 ? "Tentar novamente" : "Iniciar Quiz"}
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </Card>
      )}

      {/* Active quiz */}
      {phase === "active" && (
        <div className="space-y-6">
          {quiz.questions.map((q: QuizQuestion, qi: number) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={qi + 1}
              selectedIndex={selected[qi]}
              onSelect={(oi) => selectOption(qi, oi)}
              result={null}
            />
          ))}

          <div className="flex items-center justify-between pt-4">
            <span className="text-sm text-slate-400 font-medium">
              {selected.filter((s) => s !== null).length}/{total} respondidas
            </span>
            <button
              onClick={submitQuiz}
              disabled={!allAnswered || submitting}
              className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold px-8 py-3 rounded-2xl transition-colors"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Enviando…
                </>
              ) : (
                <>
                  Enviar respostas
                  <ChevronRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* Results */}
      {phase === "submitted" && (
        <div className="space-y-6">
          {/* Score card */}
          <Card className="rounded-[2.5rem] border-slate-100 shadow-xl bg-white overflow-hidden">
            <div className={`p-8 text-center ${pct >= 70 ? "bg-emerald-50" : "bg-amber-50"}`}>
              <div className={`text-5xl font-headline font-bold mb-1 ${pct >= 70 ? "text-emerald-700" : "text-amber-700"}`}>
                {score}/{total}
              </div>
              <div className={`text-lg font-bold ${pct >= 70 ? "text-emerald-600" : "text-amber-600"}`}>
                {pct}% de acerto
              </div>
              <p className="text-slate-500 text-sm mt-2">
                {pct === 100
                  ? "Perfeito! Domínio completo do módulo."
                  : pct >= 70
                  ? "Bom resultado — revise os itens marcados em vermelho."
                  : "Revise os conceitos com atenção e tente novamente."}
              </p>
              <button
                onClick={startQuiz}
                className="mt-5 inline-flex items-center gap-2 border border-slate-200 bg-white text-slate-700 font-bold px-6 py-2.5 rounded-2xl hover:bg-slate-50 transition-colors text-sm"
              >
                <RotateCcw className="w-4 h-4" />
                Tentar novamente
              </button>
            </div>
          </Card>

          {/* Per-question feedback */}
          {quiz.questions.map((q: QuizQuestion, qi: number) => (
            <QuestionCard
              key={q.id}
              question={q}
              questionNumber={qi + 1}
              selectedIndex={selected[qi]}
              onSelect={() => {}}
              result={results[qi]}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  questionNumber,
  selectedIndex,
  onSelect,
  result,
}: {
  question: QuizQuestion;
  questionNumber: number;
  selectedIndex: number | null;
  onSelect: (i: number) => void;
  result: QuizResult | null;
}) {
  const submitted = result !== null;

  return (
    <Card className="rounded-[2rem] border-slate-100 shadow-md bg-white overflow-hidden">
      <div className="p-6 md:p-8">
        <div className="flex gap-4 items-start mb-5">
          <div
            className={`w-8 h-8 rounded-xl flex items-center justify-center text-sm font-bold shrink-0 ${
              submitted
                ? result.correct
                  ? "bg-emerald-100 text-emerald-700"
                  : "bg-red-100 text-red-600"
                : "bg-violet-100 text-violet-700"
            }`}
          >
            {submitted ? (
              result.correct ? <CheckCircle2 className="w-4 h-4" /> : <XCircle className="w-4 h-4" />
            ) : (
              questionNumber
            )}
          </div>
          <p className="font-medium text-slate-800 leading-relaxed">{question.question}</p>
        </div>

        <div className="space-y-2.5 ml-12">
          {question.options.map((opt, oi) => {
            const isSelected = selectedIndex === oi;
            const isCorrect = submitted && oi === result.correctIndex;
            const isWrong = submitted && isSelected && !result.correct;

            let className =
              "w-full text-left p-4 rounded-xl border-2 text-sm font-medium transition-all ";

            if (submitted) {
              if (isCorrect) {
                className += "border-emerald-300 bg-emerald-50 text-emerald-800";
              } else if (isWrong) {
                className += "border-red-300 bg-red-50 text-red-700";
              } else {
                className += "border-slate-100 bg-slate-50 text-slate-400";
              }
            } else {
              if (isSelected) {
                className += "border-violet-400 bg-violet-50 text-violet-800";
              } else {
                className += "border-slate-100 bg-white text-slate-700 hover:border-violet-200 hover:bg-violet-50 cursor-pointer";
              }
            }

            return (
              <button
                key={oi}
                className={className}
                onClick={() => !submitted && onSelect(oi)}
                disabled={submitted}
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                      submitted && isCorrect
                        ? "bg-emerald-200 text-emerald-700"
                        : submitted && isWrong
                        ? "bg-red-200 text-red-600"
                        : isSelected
                        ? "bg-violet-200 text-violet-700"
                        : "bg-slate-100 text-slate-400"
                    }`}
                  >
                    {String.fromCharCode(65 + oi)}
                  </span>
                  {opt}
                </div>
              </button>
            );
          })}
        </div>

        {submitted && (
          <div
            className={`mt-4 ml-12 p-4 rounded-xl text-sm leading-relaxed ${
              result.correct
                ? "bg-emerald-50 border border-emerald-100 text-emerald-800"
                : "bg-slate-50 border border-slate-100 text-slate-700"
            }`}
          >
            <span className="font-bold">
              {result.correct ? "Correto! " : "Explicação: "}
            </span>
            {result.explanation}
          </div>
        )}
      </div>
    </Card>
  );
}
