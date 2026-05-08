"use client";

import { useMemo } from "react";
import { Card, CardContent } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";
import { Progress } from "@/ui-forge/ui/progress";
import { LineChart, Activity, Brain, Target, Microscope, Code2, CheckCircle2, Clock, Circle } from "lucide-react";
import Link from "next/link";
import { useProgress } from "@/hooks/use-progress";

const MODULE_DEFS = [
  {
    id: "linear-regression" as const,
    title: "Regressão Linear",
    subtitle: "Lever, Krzywinski & Altman (2015)",
    href: "/nexus/journeys/linear-regression",
    icon: LineChart,
  },
  {
    id: "logistic-regression" as const,
    title: "Regressão Logística",
    subtitle: "Lever, Krzywinski & Altman (2016)",
    href: "/nexus/journeys/logistic-regression",
    icon: Activity,
  },
  {
    id: "pca" as const,
    title: "Análise de Componentes Principais",
    subtitle: "Lever, Krzywinski & Altman (2017)",
    href: "/nexus/journeys/pca",
    icon: Brain,
  },
];

const COMPETENCY_DEFS = [
  {
    title: "Regressão Linear (LSE)",
    description: "Estimação de coeficientes por mínimos quadrados, interpretação de R² e diagnóstico de resíduos.",
    icon: LineChart,
    dependsOn: ["linear-regression"] as const,
  },
  {
    title: "Regressão Logística (MLE)",
    description: "Classificação binária via função sigmoide, log-odds e estimação por máxima verossimilhança.",
    icon: Activity,
    dependsOn: ["logistic-regression"] as const,
  },
  {
    title: "Componentes Principais (PCA)",
    description: "Redução de dimensionalidade por autodecomposição da matriz de covariância.",
    icon: Brain,
    dependsOn: ["pca"] as const,
  },
  {
    title: "Incerteza e Intervalos",
    description: "Distinção entre intervalos de confiança e de predição; a falácia da regressão à média.",
    icon: Target,
    dependsOn: ["linear-regression"] as const,
  },
  {
    title: "Sensibilidade de Escala",
    description: "Impacto da padronização (unit variance) na recuperação de agrupamentos pelo PCA.",
    icon: Microscope,
    dependsOn: ["pca"] as const,
  },
  {
    title: "Fundamentos Matemáticos",
    description: "Autovetores, autovalores, verossimilhança e decomposição espectral da covariância.",
    icon: Code2,
    dependsOn: ["linear-regression", "logistic-regression", "pca"] as const,
  },
];

export default function ProgressPage() {
  const { status } = useProgress();

  const completedCount = MODULE_DEFS.filter((m) => status(m.id) === "completed").length;

  return (
    <div className="max-w-5xl mx-auto space-y-12 animate-in fade-in duration-700">
      {/* Header */}
      <div className="space-y-3">
        <h2 className="text-4xl font-headline font-bold tracking-tight text-slate-900">Progresso</h2>
        <p className="text-slate-500 text-lg max-w-2xl">
          Acompanhamento baseado nos três artigos da série <em>Points of Significance</em> da <em>Nature Methods</em>.
        </p>
      </div>

      {/* Module completion */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {MODULE_DEFS.map((mod) => {
          const s = status(mod.id);
          return (
            <Link key={mod.title} href={mod.href}>
              <Card className={`rounded-[2rem] border shadow-lg transition-all hover:shadow-xl overflow-hidden group h-full ${s === "completed" ? "bg-white border-emerald-200" : s === "in_progress" ? "bg-white border-purple-200" : "bg-white border-slate-200"}`}>
                <CardContent className="p-6 flex flex-col gap-4 h-full">
                  <div className="flex items-start justify-between">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${s === "completed" ? "bg-emerald-100 text-emerald-600" : s === "in_progress" ? "bg-purple-100 text-purple-600" : "bg-slate-100 text-slate-400"}`}>
                      <mod.icon className="w-6 h-6" />
                    </div>
                    {s === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    ) : s === "in_progress" ? (
                      <Clock className="w-5 h-5 text-purple-400 shrink-0" />
                    ) : (
                      <Circle className="w-5 h-5 text-slate-300 shrink-0" />
                    )}
                  </div>
                  <div className="space-y-1 flex-1">
                    <h3 className="font-headline font-bold text-slate-900 leading-tight">{mod.title}</h3>
                    <p className="text-xs text-slate-400">{mod.subtitle}</p>
                  </div>
                  <div className="pt-2">
                    {s === "completed" ? (
                      <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 text-[10px] font-bold">Concluído</Badge>
                    ) : s === "in_progress" ? (
                      <Badge variant="outline" className="border-purple-200 bg-purple-50 text-purple-700 text-[10px] font-bold">Em Andamento</Badge>
                    ) : (
                      <Badge variant="outline" className="border-slate-200 bg-slate-50 text-slate-400 text-[10px] font-bold">Não Iniciado</Badge>
                    )}
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Competency grid */}
      <div className="space-y-6">
        <div className="flex items-end justify-between">
          <h3 className="text-2xl font-headline font-bold text-slate-900">Competências</h3>
          <p className="text-sm text-slate-400 tabular-nums">
            {completedCount} de {MODULE_DEFS.length} módulos concluídos
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {COMPETENCY_DEFS.map((comp) => {
            const depsCompleted = comp.dependsOn.filter((id) => status(id) === "completed").length;
            const mastery = Math.round((depsCompleted / comp.dependsOn.length) * 100);

            return (
              <Card key={comp.title} className="rounded-[2rem] border border-slate-200 shadow-md hover:shadow-lg transition-all overflow-hidden bg-white">
                <CardContent className="p-6 flex flex-col gap-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${mastery === 100 ? 'bg-emerald-100 text-emerald-600' : mastery > 0 ? 'bg-purple-100 text-purple-600' : 'bg-slate-100 text-slate-400'}`}>
                      <comp.icon className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-headline font-bold text-slate-900 leading-tight">{comp.title}</p>
                      <p className="text-xs text-slate-500 leading-relaxed">{comp.description}</p>
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Progress value={mastery} className="h-1.5" />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
