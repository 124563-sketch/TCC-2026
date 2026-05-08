"use client";

import { useState, useMemo } from "react";
import {
  XAxis, YAxis, CartesianGrid, Scatter, ComposedChart, ResponsiveContainer, Line, ReferenceLine
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Badge } from "@/ui-forge/ui/badge";

// Seeded pseudo-random number generator (mulberry32)
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

type ScenarioType = "no-assoc" | "no-reg" | "linear" | "nonlinear";

const generateData = (type: ScenarioType) => {
  const rand = mulberry32(42); // Fixed seed for determinism
  const points: { x: number; y: number }[] = [];
  const line: { x: number; mean: number }[] = [];

  for (let x = 0; x <= 100; x += 5) {
    let mean = 50;
    let variance = 8;

    if (type === "no-reg") {
      variance = 2 + x * 0.25;
    } else if (type === "linear") {
      mean = 20 + 0.6 * x;
      variance = 8;
    } else if (type === "nonlinear") {
      mean = 8 + Math.exp(x * 0.045);
      variance = 5;
    }

    line.push({ x, mean: +mean.toFixed(3) });

    for (let i = 0; i < 3; i++) {
      const u1 = rand();
      const u2 = rand();
      const noise = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2) * variance;
      points.push({ x: +(x + (rand() * 4 - 2)).toFixed(3), y: +(mean + noise).toFixed(3) });
    }
  }
  return { points, line };
};

const scenarios = [
  {
    id: "no-assoc" as ScenarioType,
    title: "A. Sem Associação",
    desc: "A distribuição de Y é invariante com X. E(Y|X) é constante e a dispersão é homogênea.",
    detail: "Correlação ≈ 0. Sem regressão."
  },
  {
    id: "no-reg" as ScenarioType,
    title: "B. Associação sem Regressão",
    desc: "A variância de Y cresce com X, mas E(Y|X) permanece constante.",
    detail: "Há associação (heterocedasticidade), mas a média condicional não varia."
  },
  {
    id: "linear" as ScenarioType,
    title: "C. Regressão Linear",
    desc: "E(Y|X) = β₀ + β₁X. A média condicional segue uma reta.",
    detail: "Forma mais simples de regressão. Variância constante (homocedasticidade)."
  },
  {
    id: "nonlinear" as ScenarioType,
    title: "D. Regressão Não-Linear",
    desc: "E(Y|X) = exp(β₀ + β₁X). A média condicional segue uma curva.",
    detail: "Ainda é uma regressão, mas a forma funcional não é uma reta."
  },
];

export function NatureMethodsLinearFig1() {
  const [activeId, setActiveId] = useState<ScenarioType>("linear");

  const activeScenario = useMemo(() => scenarios.find(s => s.id === activeId)!, [activeId]);
  const data = useMemo(() => generateData(activeId), [activeId]);

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Associação versus Regressão</h3>
          <p className="text-slate-500 text-sm mt-1">
            Quatro cenários que definem o que significa Y ter uma <em>regressão sobre X</em>.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Sidebar Controls */}
        <div className="p-6 md:p-8 bg-slate-50 border-r border-slate-100 flex flex-col gap-3">
          {scenarios.map((scenario) => (
            <button
              key={scenario.id}
              onClick={() => setActiveId(scenario.id)}
              className={`p-4 rounded-2xl text-left transition-all border ${
                activeId === scenario.id
                  ? "bg-white border-purple-200 shadow-md ring-2 ring-purple-500/20"
                  : "bg-transparent border-transparent hover:bg-slate-100"
              }`}
            >
              <h4 className={`font-bold text-sm ${activeId === scenario.id ? "text-purple-700" : "text-slate-700"}`}>
                {scenario.title}
              </h4>
              <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                {scenario.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Chart Display */}
        <div className="md:col-span-3 p-8 md:p-12 h-[480px] relative">
          <div className="absolute top-8 right-8 z-10 flex flex-col gap-2 items-end">
            <Badge variant="outline" className="bg-white/80 backdrop-blur text-slate-600 font-bold border-slate-200">
              E(Y|X) — Média Condicional
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                type="number" dataKey="x" domain={[0, 100]} tickCount={6}
                label={{ value: "Variável Independente (X)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                type="number" dataKey="y" domain={[0, 120]} tickCount={7}
                label={{ value: "Variável Dependente (Y)", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              />
              {/* Reference line at constant mean for no-assoc and no-reg */}
              {(activeId === "no-assoc" || activeId === "no-reg") && (
                <ReferenceLine y={50} stroke="#94a3b8" strokeDasharray="6 3" strokeWidth={1.5} />
              )}
              <Scatter
                name="Dados observados"
                data={data.points}
                fill="#94a3b8"
                opacity={0.55}
                line={false}
                isAnimationActive={false}
              />
              <Line
                data={data.line}
                type="monotone"
                dataKey="mean"
                stroke="#1e293b"
                strokeWidth={3.5}
                dot={false}
                isAnimationActive={true}
                animationDuration={500}
              />
            </ComposedChart>
          </ResponsiveContainer>
          {/* Footnote */}
          <p className="absolute bottom-4 left-12 text-xs text-slate-400 font-medium">
            {activeScenario.detail}
          </p>
        </div>
      </div>
    </Card>
  );
}
