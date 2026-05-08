"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { Users, Clock, CheckCircle2, Circle, Activity, ChevronDown, ChevronUp, ClipboardList } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

interface QuizAttemptSummary {
  moduleId: string;
  score: number;
  completedAt: string;
}

interface StudentProgress {
  id: string;
  name: string | null;
  email: string;
  totalPracticeSeconds: number;
  createdAt: string;
  moduleProgress: { moduleId: string; status: string; updatedAt: string }[];
  quizAttempts: QuizAttemptSummary[];
}

const MODULE_DEFS = [
  { id: "linear-regression", label: "Reg. Linear", color: "bg-blue-500" },
  { id: "logistic-regression", label: "Reg. Logistica", color: "bg-purple-500" },
  { id: "pca", label: "PCA", color: "bg-emerald-500" },
];

function formatTime(totalSeconds: number) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

function ModuleDots({ progress }: { progress: StudentProgress["moduleProgress"] }) {
  return (
    <div className="flex gap-2">
      {MODULE_DEFS.map((mod) => {
        const record = progress.find((p) => p.moduleId === mod.id);
        const status = record?.status || "not_started";
        return (
          <div
            key={mod.id}
            className={`w-3 h-3 rounded-full ${
              status === "completed"
                ? "bg-emerald-500"
                : status === "in_progress"
                  ? "bg-purple-500"
                  : "bg-slate-200"
            }`}
            title={`${mod.label}: ${status === "completed" ? "Concluido" : status === "in_progress" ? "Em Andamento" : "Nao Iniciado"}`}
          />
        );
      })}
    </div>
  );
}

function StudentRow({ student }: { student: StudentProgress }) {
  const [expanded, setExpanded] = useState(false);

  const completed = student.moduleProgress.filter((p) => p.status === "completed").length;
  const lastActive = student.moduleProgress.reduce(
    (latest, p) => (p.updatedAt > latest ? p.updatedAt : latest),
    student.createdAt,
  );

  return (
    <>
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full text-left hover:bg-slate-50 transition-colors"
      >
        <div className="flex items-center gap-2 md:gap-4 p-4 md:p-6">
          <div className="flex-1 min-w-0">
            <p className="font-bold text-slate-900 truncate text-sm md:text-base">
              {student.name || "Sem nome"}
            </p>
            <p className="text-xs text-slate-400 truncate">{student.email}</p>
          </div>

          <div className="hidden sm:block">
            <ModuleDots progress={student.moduleProgress} />
          </div>

          <div className="text-center shrink-0 w-14">
            <span className="font-bold text-sm tabular-nums text-slate-600">
              {completed}/{MODULE_DEFS.length}
            </span>
          </div>

          <div className="hidden md:flex items-center gap-1 text-slate-500 text-xs shrink-0 w-16 justify-end">
            <Clock className="w-3 h-3" />
            <span className="tabular-nums">{formatTime(student.totalPracticeSeconds)}</span>
          </div>

          <div className="hidden lg:block text-xs text-slate-400 shrink-0 w-24 text-right">
            {new Date(lastActive).toLocaleDateString("pt-BR")}
          </div>

          <div className="text-slate-400 shrink-0">
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {expanded && (
        <div className="px-4 pb-4 md:px-6 md:pb-6 border-t border-slate-100">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
            {MODULE_DEFS.map((mod) => {
              const record = student.moduleProgress.find((p) => p.moduleId === mod.id);
              const modStatus = record?.status || "not_started";
              const attempts = student.quizAttempts.filter((a) => a.moduleId === mod.id);
              const bestScore = attempts.length > 0 ? Math.max(...attempts.map((a) => a.score)) : null;
              const lastAttempt = attempts[0];
              return (
                <div
                  key={mod.id}
                  className={`p-4 rounded-2xl border ${
                    modStatus === "completed"
                      ? "bg-emerald-50 border-emerald-100"
                      : modStatus === "in_progress"
                        ? "bg-purple-50 border-purple-100"
                        : "bg-slate-50 border-slate-100"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {modStatus === "completed" ? (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    ) : modStatus === "in_progress" ? (
                      <Activity className="w-4 h-4 text-purple-600" />
                    ) : (
                      <Circle className="w-4 h-4 text-slate-300" />
                    )}
                    <span className="font-bold text-sm text-slate-800">{mod.label}</span>
                  </div>
                  <p className="text-xs text-slate-500">
                    {modStatus === "completed"
                      ? "Concluido"
                      : modStatus === "in_progress"
                        ? "Em Andamento"
                        : "Nao Iniciado"}
                  </p>
                  {record?.updatedAt && (
                    <p className="text-[10px] text-slate-400 mt-1">
                      {new Date(record.updatedAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  <div className="mt-3 pt-3 border-t border-slate-200/60 flex items-center gap-2">
                    <ClipboardList className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    {bestScore !== null ? (
                      <div className="flex-1">
                        <div className="flex justify-between items-center">
                          <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Quiz</span>
                          <span className={`text-xs font-bold tabular-nums ${bestScore >= 7 ? "text-emerald-600" : bestScore >= 5 ? "text-amber-600" : "text-red-500"}`}>
                            {bestScore}/10
                          </span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1.5 mt-1 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${bestScore >= 7 ? "bg-emerald-500" : bestScore >= 5 ? "bg-amber-400" : "bg-red-400"}`}
                            style={{ width: `${bestScore * 10}%` }}
                          />
                        </div>
                        {lastAttempt && (
                          <p className="text-[10px] text-slate-400 mt-0.5">
                            {attempts.length}× — último: {new Date(lastAttempt.completedAt).toLocaleDateString("pt-BR")}
                          </p>
                        )}
                      </div>
                    ) : (
                      <span className="text-[10px] text-slate-400">Quiz não realizado</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}

export default function SupervisorPage() {
  const { data: session, status: authStatus } = useSession();
  const router = useRouter();
  const [students, setStudents] = useState<StudentProgress[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (authStatus === "loading") return;
    if (authStatus === "unauthenticated" || session?.user?.role !== "SUPERVISOR") {
      router.push("/nexus");
      return;
    }

    fetch("/api/supervisor/students")
      .then((r) => r.json())
      .then(setStudents)
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [authStatus, session, router]);

  if (authStatus === "loading" || loading) {
    return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
        <div className="h-8 w-48 bg-slate-200 rounded" />
        <div className="h-64 bg-slate-100 rounded-[2rem]" />
      </div>
    );
  }

  const totalStudents = students.length;
  const totalCompletedMods = students.reduce(
    (sum, s) => sum + s.moduleProgress.filter((p) => p.status === "completed").length,
    0,
  );

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <h2 className="text-3xl font-headline font-bold text-slate-900 tracking-tight">
          Painel do Supervisor
        </h2>
        <p className="text-slate-500 font-medium">
          Relatorios de progresso dos estudantes matriculados.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <Card className="rounded-[2rem] border-none shadow-xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center">
              <Users className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{totalStudents}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Estudantes</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-emerald-100 rounded-2xl flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">{totalCompletedMods}</p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Modulos Concluidos</p>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-[2rem] border-none shadow-xl bg-white">
          <CardContent className="p-6 flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center">
              <Clock className="w-6 h-6 text-amber-600" />
            </div>
            <div>
              <p className="text-2xl font-bold tabular-nums text-slate-900">
                {formatTime(students.reduce((sum, s) => sum + s.totalPracticeSeconds, 0))}
              </p>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">Tempo Total</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="rounded-[2rem] border-none shadow-xl bg-white overflow-hidden">
        <CardHeader className="p-4 md:p-6 border-b border-slate-100">
          <div className="flex items-center gap-2 md:gap-4 text-xs font-bold uppercase tracking-widest text-slate-400">
            <span className="flex-1">Estudante</span>
            <span className="hidden sm:block w-[72px] text-center">Modulos</span>
            <span className="w-14 text-center">Feitos</span>
            <span className="hidden md:block w-16 text-right">Pratica</span>
            <span className="hidden lg:block w-24 text-right">Ativo</span>
            <span className="w-5" />
          </div>
        </CardHeader>
        <CardContent className="p-0 divide-y divide-slate-50">
          {students.length === 0 ? (
            <div className="p-10 text-center text-slate-400">
              <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
              <p className="font-medium">Nenhum estudante matriculado.</p>
            </div>
          ) : (
            students.map((student) => <StudentRow key={student.id} student={student} />)
          )}
        </CardContent>
      </Card>
    </div>
  );
}
