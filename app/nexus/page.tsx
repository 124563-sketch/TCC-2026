"use client";

import { useMemo } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/ui-forge/ui/card";
import { Button } from "@/ui-forge/ui/button";
import { Progress } from "@/ui-forge/ui/progress";
import { BookOpen, ArrowRight, BrainCircuit, CheckCircle2, LineChart, Activity, Layers, Circle } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useProgress } from "@/hooks/use-progress";

const MODULE_DEFS = [
  { id: "linear-regression" as const, title: "Regressão Linear", level: "Módulo I", icon: LineChart, image: "/assets/linear_regression.png", href: "/nexus/journeys/linear-regression", description: "A reta que minimiza a soma dos quadrados dos resíduos." },
  { id: "logistic-regression" as const, title: "Regressão Logística", level: "Módulo II", icon: Activity, image: "/assets/logistic_regression.png", href: "/nexus/journeys/logistic-regression", description: "A sigmoide que transforma log-odds em probabilidade." },
  { id: "pca" as const, title: "PCA (Componentes Principais)", level: "Módulo III", icon: Layers, image: "/assets/pca.png", href: "/nexus/journeys/pca", description: "Os autovetores que comprimem a dimensionalidade." },
];

export default function DashboardOverview() {
  const { status } = useProgress();

  const completedCount = MODULE_DEFS.filter((m) => status(m.id) === "completed").length;
  const totalModules = MODULE_DEFS.length;

  // Find the first incomplete module for the hero card
  const activeModule = MODULE_DEFS.find((m) => status(m.id) !== "completed");
  const allDone = !activeModule;

  // Overall progress percentage
  const overallProgress = useMemo(() => {
    let pct = 0;
    for (const m of MODULE_DEFS) {
      const s = status(m.id);
      if (s === "completed") pct += 100;
      else if (s === "in_progress") pct += 50;
    }
    return Math.round(pct / totalModules);
  }, [status, totalModules]);

  return (
    <div className="space-y-8 md:space-y-10 animate-in fade-in duration-700">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        {/* Hero card — shows first incomplete module, or completion state */}
        <Card className="lg:col-span-2 bg-slate-900 text-white overflow-hidden relative border-none shadow-2xl rounded-[2rem] md:rounded-[2.5rem]">
          <div className="relative z-10 p-6 md:p-10 flex flex-col h-full justify-between">
            <div className="space-y-4 md:space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] border border-white/10">
                {allDone ? "Currículo Concluído" : "Módulo Atual"}
              </div>
              <div className="space-y-2">
                {allDone ? (
                  <>
                    <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight tracking-tighter">
                      Os Três Pilares<br />da Estatística Aplicada
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed font-body">
                      Regressão linear, regressão logística e PCA — os três artigos da série <em>Points of Significance</em> concluídos.
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="text-3xl md:text-5xl font-headline font-bold leading-tight tracking-tighter">
                      {activeModule.title}
                    </h2>
                    <p className="text-slate-400 text-base md:text-lg max-w-md leading-relaxed font-body">
                      {activeModule.description}
                    </p>
                  </>
                )}
              </div>
            </div>

            <div className="mt-8 md:mt-12 space-y-6 max-w-sm">
              <div className="space-y-3">
                <div className="flex justify-between text-[10px] md:text-xs font-bold uppercase tracking-widest">
                  <span className="text-slate-400">Progresso do Currículo</span>
                  <span className="text-primary tabular-nums">{overallProgress}%</span>
                </div>
                <Progress value={overallProgress} className="bg-white/10 h-2.5 rounded-full overflow-hidden" />
              </div>
              {allDone ? (
                <Button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold h-12 md:h-14 rounded-2xl group text-sm md:text-base" asChild>
                  <Link href="/nexus/trophies">
                    Ver Progresso Completo <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              ) : (
                <Button className="w-full bg-primary hover:bg-primary/90 text-white font-bold h-12 md:h-14 rounded-2xl group text-sm md:text-base" asChild>
                  <Link href={activeModule.href}>
                    {status(activeModule.id) === "in_progress" ? "Continuar Aula" : "Iniciar Módulo"} <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                </Button>
              )}
            </div>
          </div>
          <BrainCircuit className="absolute -right-12 -bottom-12 md:-right-20 md:-bottom-20 w-64 h-64 md:w-96 md:h-96 text-white/5 rotate-12" />
        </Card>

        {/* Metrics sidebar */}
        <Card className="bg-white border border-slate-100 shadow-xl rounded-[2rem] md:rounded-[2.5rem] flex flex-col">
          <CardHeader className="p-6 md:p-10 pb-4">
            <CardTitle className="font-headline text-xl md:text-2xl font-bold tracking-tight">Progresso</CardTitle>
            <CardDescription className="text-xs md:text-sm font-medium">{completedCount} de {totalModules} módulos concluídos.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-10 pt-2 md:pt-6 space-y-4 md:space-y-6 flex-1 flex flex-col justify-center">
            {MODULE_DEFS.map((mod) => {
              const s = status(mod.id);
              return (
                <Link key={mod.id} href={mod.href} className={`flex items-center gap-4 md:gap-6 p-4 md:p-6 rounded-[1.5rem] md:rounded-3xl border transition-colors hover:bg-slate-100/50 ${s === "completed" ? "bg-emerald-50 border-emerald-100" : s === "in_progress" ? "bg-purple-50 border-purple-100" : "bg-slate-50 border-slate-100"}`}>
                  <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center shrink-0 ${s === "completed" ? "bg-emerald-100" : s === "in_progress" ? "bg-purple-100" : "bg-slate-200"}`}>
                    {s === "completed" ? (
                      <CheckCircle2 className="w-5 h-5 md:w-7 md:h-7 text-emerald-600" />
                    ) : s === "in_progress" ? (
                      <mod.icon className="w-5 h-5 md:w-7 md:h-7 text-purple-600" />
                    ) : (
                      <Circle className="w-5 h-5 md:w-7 md:h-7 text-slate-400" />
                    )}
                  </div>
                  <div>
                    <p className="text-sm md:text-base font-bold leading-none tracking-tight text-slate-900">{mod.title}</p>
                    <p className={`text-[9px] md:text-[10px] uppercase font-bold tracking-[0.15em] mt-1 md:mt-2 ${
                      s === "completed" ? "text-emerald-600" :
                      s === "in_progress" ? "text-purple-600" :
                      "text-slate-400"
                    }`}>
                      {s === "completed" ? "Concluído" : s === "in_progress" ? "Em Andamento" : "Não Iniciado"}
                    </p>
                  </div>
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </div>

      {/* Module cards */}
      <div className="space-y-6 md:space-y-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-100 pb-6">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-headline font-bold tracking-tight">Módulos</h2>
            <p className="text-slate-500 text-sm md:text-base font-medium">Série <em>Points of Significance</em>, <em>Nature Methods</em>.</p>
          </div>
          <Button variant="outline" className="rounded-xl font-bold px-6 md:px-8 h-10 md:h-12 border-2 hover:bg-slate-50 w-full md:w-auto text-xs md:text-sm" asChild>
            <Link href="/nexus/trophies">Ver Competências <ArrowRight className="ml-2 w-4 h-4" /></Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {MODULE_DEFS.map((mod) => {
            const s = status(mod.id);
            const progress = s === "completed" ? 100 : s === "in_progress" ? 50 : 0;

            return (
              <Link key={mod.title} href={mod.href} className="block">
                <Card className="hover:shadow-2xl transition-all group rounded-[2rem] overflow-hidden border-slate-200">
                  <CardHeader className="p-6 md:p-8 pb-4 md:pb-6 relative">
                    <div className="flex justify-between items-start mb-4">
                      <Image
                        src={mod.image}
                        alt={mod.title}
                        width={80}
                        height={80}
                        className="object-contain drop-shadow-xl group-hover:scale-110 transition-transform duration-500"
                      />
                      <span className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest bg-slate-100 px-3 py-1.5 rounded-lg text-slate-600 border border-slate-200">{mod.level}</span>
                    </div>
                    <CardTitle className="font-headline text-xl md:text-2xl font-bold group-hover:text-primary transition-colors leading-tight mb-1">{mod.title}</CardTitle>
                    <CardDescription className={`text-xs md:text-sm font-semibold ${
                      s === "completed" ? "text-emerald-600" :
                      s === "in_progress" ? "text-purple-600" :
                      "text-slate-400"
                    }`}>
                      {s === "completed" ? "Concluído" : s === "in_progress" ? "Em Andamento" : "Não Iniciado"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 md:p-8 pt-0 space-y-4">
                    <div className="flex items-center justify-between text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500">
                      <span>Progresso</span>
                      <span className={`tabular-nums ${progress === 100 ? 'text-emerald-600' : ''}`}>{progress}%</span>
                    </div>
                    <Progress value={progress} className="h-2 rounded-full" />
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
