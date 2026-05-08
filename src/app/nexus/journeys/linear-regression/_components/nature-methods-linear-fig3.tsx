"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui-forge/ui/card";
import { Slider } from "@/ui-forge/ui/slider";
import { ArrowDown } from "lucide-react";
import {
  XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ComposedChart, ResponsiveContainer, Line, ReferenceLine
} from "recharts";

// Seeded PRNG
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Box-Muller normal
function randn(rand: () => number) {
  const u1 = Math.max(rand(), 0.001);
  const u2 = rand();
  return Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
}

export function NatureMethodsLinearFig3() {
  const [initialHeight, setInitialHeight] = useState(175);

  // Population parameters: Height ~ N(170, 10²), Weight ~ N(70, 10²), ρ = 0.64
  const POP = { meanX: 170, meanY: 70, stdX: 10, stdY: 10, rho: 0.64 };

  // Generate population data deterministically
  const dataPoints = useMemo(() => {
    const rand = mulberry32(999);
    const points: { x: number; y: number }[] = [];
    for (let i = 0; i < 200; i++) {
      const z1 = randn(rand);
      const z2 = randn(rand);
      const x = POP.meanX + POP.stdX * z1;
      const y = POP.meanY + POP.stdY * (POP.rho * z1 + Math.sqrt(1 - POP.rho * POP.rho) * z2);
      points.push({ x, y });
    }
    return points;
  }, []);

  // Theoretical regression coefficients
  const slopeYonX = POP.rho * (POP.stdY / POP.stdX);       // 0.64
  const interceptYonX = POP.meanY - slopeYonX * POP.meanX;  // 70 - 0.64*170 = -38.8

  const slopeXonY = POP.rho * (POP.stdX / POP.stdY);       // 0.64
  const interceptXonY = POP.meanX - slopeXonY * POP.meanY;  // 170 - 0.64*70 = 125.2

  // Step 1: Predict Weight from Height (Y ~ X)
  const predWeight = slopeYonX * initialHeight + interceptYonX;

  // Step 2: Predict Height from Weight (X ~ Y)
  const finalHeight = slopeXonY * predWeight + interceptXonY;

  // Distances from mean
  const initialDist = initialHeight - POP.meanX;
  const finalDist = finalHeight - POP.meanX;
  const regressionRatio = initialDist !== 0 ? Math.abs(finalDist / initialDist) : 0;

  // Regression line data (rounded to 3 decimals)
  const lineYonX = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let x = 140; x <= 200; x += 5) {
      pts.push({ x, y: +(slopeYonX * x + interceptYonX).toFixed(3) });
    }
    return pts;
  }, []);

  const lineXonY = useMemo(() => {
    const pts: { x: number; y: number }[] = [];
    for (let y = 40; y <= 100; y += 5) {
      pts.push({ x: +(slopeXonY * y + interceptXonY).toFixed(3), y });
    }
    return pts;
  }, []);

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">A Falácia da Regressão à Média</h3>
          <p className="text-slate-500 text-sm mt-1">
            Por que X → Y → X&prime; sempre se aproxima da média — e por que isso não é causal.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Controls */}
        <div className="p-8 bg-slate-50 border-r border-slate-100 flex flex-col gap-6 md:col-span-1">
          {/* Slider */}
          <div className="space-y-4 bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
            <div className="flex justify-between items-center font-bold text-sm">
              <span className="text-slate-700">Altura Inicial (X):</span>
              <span className="text-blue-600 tabular-nums">{initialHeight} cm</span>
            </div>
            <Slider
              value={[initialHeight]}
              onValueChange={(v) => setInitialHeight(v[0])}
              min={145} max={195} step={0.5}
              className="w-full"
            />
            <div className="flex justify-between text-[10px] font-bold text-slate-400">
              <span>145</span>
              <span>Média: {POP.meanX} cm</span>
              <span>195</span>
            </div>
            <div className="relative h-1.5 bg-slate-100 rounded-full mt-1">
              <div
                className="absolute top-0 h-full bg-blue-500 rounded-full transition-all duration-300"
                style={{
                  left: `${((initialHeight - 145) / 50) * 100}%`,
                  width: '4px',
                  transform: 'translateX(-50%)',
                }}
              />
              <div
                className="absolute top-0 h-full w-0.5 bg-slate-400"
                style={{ left: `${((POP.meanX - 145) / 50) * 100}%` }}
              />
            </div>
          </div>

          {/* Step-by-step readout */}
          <div className="space-y-3">
            <div className="bg-blue-50 rounded-2xl p-4 border border-blue-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-blue-500 mb-1">Passo 1: Y ~ X</p>
              <p className="text-xs text-slate-500">Peso predito a partir da Altura:</p>
              <p className="text-xl font-headline font-bold text-blue-700 tabular-nums">
                {predWeight.toFixed(1)} <span className="text-sm font-normal">kg</span>
              </p>
            </div>

            <div className="flex justify-center text-slate-300">
              <ArrowDown className="w-4 h-4" />
            </div>

            <div className="bg-emerald-50 rounded-2xl p-4 border border-emerald-100">
              <p className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-1">Passo 2: X ~ Y</p>
              <p className="text-xs text-slate-500">Altura predita a partir do Peso:</p>
              <p className="text-xl font-headline font-bold text-emerald-700 tabular-nums">
                {finalHeight.toFixed(1)} <span className="text-sm font-normal">cm</span>
              </p>
            </div>
          </div>

          {/* Regression effect indicator */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">Efeito da Regressão</p>
            <div className="flex items-center justify-between text-sm">
              <span className="text-slate-600">Distância inicial:</span>
              <span className="font-bold tabular-nums text-slate-900">{initialDist > 0 ? '+' : ''}{initialDist.toFixed(1)} cm</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1">
              <span className="text-slate-600">Distância final:</span>
              <span className="font-bold tabular-nums text-slate-900">{finalDist > 0 ? '+' : ''}{finalDist.toFixed(1)} cm</span>
            </div>
            <div className="flex items-center justify-between text-sm mt-1 pt-2 border-t border-slate-100">
              <span className="text-slate-600">Contração:</span>
              <span className="font-bold tabular-nums text-emerald-600">{(regressionRatio * 100).toFixed(0)}%</span>
            </div>
            <p className="text-[10px] text-slate-400 mt-2 leading-relaxed">
              A predição reversa retém apenas ρ² = {(POP.rho * POP.rho * 100).toFixed(0)}% da distância original à média.
            </p>
          </div>
        </div>

        {/* Chart */}
        <div className="p-6 md:p-8 md:col-span-4 h-[550px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                type="number" dataKey="x" domain={[140, 200]} tickCount={7}
                label={{ value: "Altura (cm)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }} allowDataOverflow
              />
              <YAxis
                type="number" dataKey="y" domain={[40, 100]} tickCount={7}
                label={{ value: "Peso (kg)", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }} allowDataOverflow
              />
              <ZAxis type="number" range={[100, 100]} />

              {/* Population scatter */}
              <Scatter name="População" data={dataPoints} fill="#cbd5e1" opacity={0.45} isAnimationActive={false} />

              {/* Two regression lines */}
              <Line
                name="Peso ~ Altura (Y~X)"
                data={lineYonX}
                type="monotone" dataKey="y"
                stroke="#3b82f6" strokeWidth={3} dot={false}
                isAnimationActive={false}
              />
              <Line
                name="Altura ~ Peso (X~Y)"
                data={lineXonY}
                type="monotone" dataKey="y"
                stroke="#10b981" strokeWidth={3} dot={false}
                isAnimationActive={false}
              />

              {/* Centroid reference lines */}
              <ReferenceLine x={POP.meanX} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />
              <ReferenceLine y={POP.meanY} stroke="#94a3b8" strokeDasharray="4 4" strokeWidth={1} />

              {/* Path: Step 1 — vertical from X axis to Y~X line */}
              <ReferenceLine
                segment={[{ x: initialHeight, y: 40 }, { x: initialHeight, y: predWeight }]}
                stroke="#3b82f6" strokeWidth={2.5} strokeDasharray="5 3"
              />
              {/* Point on Y~X line */}
              <ReferenceLine
                segment={[{ x: initialHeight, y: predWeight }, { x: initialHeight, y: predWeight }]}
                stroke="#3b82f6" strokeWidth={8}
              />

              {/* Path: Step 2 — horizontal from Y~X to X~Y line */}
              <ReferenceLine
                segment={[{ x: initialHeight, y: predWeight }, { x: finalHeight, y: predWeight }]}
                stroke="#10b981" strokeWidth={2.5} strokeDasharray="5 3"
              />
              {/* Point on X~Y line */}
              <ReferenceLine
                segment={[{ x: finalHeight, y: predWeight }, { x: finalHeight, y: predWeight }]}
                stroke="#10b981" strokeWidth={8}
              />

              {/* Path: Step 3 — vertical down to X axis */}
              <ReferenceLine
                segment={[{ x: finalHeight, y: predWeight }, { x: finalHeight, y: 40 }]}
                stroke="#10b981" strokeWidth={2} strokeDasharray="3 3"
              />

              {/* Annotate the initial and final heights on X axis */}
              <ReferenceLine x={initialHeight} stroke="#3b82f6" strokeWidth={1} strokeOpacity={0.3} strokeDasharray="2 6" />
              <ReferenceLine x={finalHeight} stroke="#10b981" strokeWidth={1} strokeOpacity={0.3} strokeDasharray="2 6" />
            </ComposedChart>
          </ResponsiveContainer>

          {/* Legend */}
          <div className="flex items-center gap-6 justify-center -mt-2 text-xs font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-blue-500" style={{ height: 3 }} />
              <span className="text-blue-600">Y~X (minimiza erros verticais)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-emerald-500" style={{ height: 3 }} />
              <span className="text-emerald-600">X~Y (minimiza erros horizontais)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-4 h-0.5 bg-slate-400" style={{ height: 1, borderTop: '1px dashed #94a3b8' }} />
              <span className="text-slate-500">Médias</span>
            </div>
          </div>
        </div>
      </div>

      {/* Explanation footer */}
      <div className="bg-slate-900 text-white p-8 md:p-10 text-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full" />
        <div className="relative z-10">
          <h4 className="text-2xl font-headline font-bold mb-4">Por que as Duas Retas Diferem</h4>
          {Math.abs(initialHeight - POP.meanX) < 1 ? (
            <p className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed">
              No centroide ({POP.meanX}, {POP.meanY}), as duas retas se cruzam. Aqui não há regressão à média — as predições em ambas as direções coincidem. <b>Mova o slider para os extremos</b> para observar o fenômeno.
            </p>
          ) : (
            <div className="text-slate-300 max-w-3xl mx-auto text-base leading-relaxed space-y-3">
              <p>
                Partindo de <strong className="text-white">{initialHeight} cm</strong> (distante{" "}
                <strong className="text-white">{Math.abs(initialDist).toFixed(1)} cm</strong> da média),
                a predição reversa X → Y → X&prime; resulta em{" "}
                <strong className="text-emerald-400">{finalHeight.toFixed(1)} cm</strong> —
                apenas <strong className="text-white">{Math.abs(finalDist).toFixed(1)} cm</strong> da média.
              </p>
              <p>
                A reta <span className="text-blue-400 font-bold">Y~X (azul)</span> minimiza os <b>erros verticais</b> (distâncias em Y).
                A reta <span className="text-emerald-400 font-bold">X~Y (verde)</span> minimiza os <b>erros horizontais</b> (distâncias em X).
                Elas <b>não são a mesma reta</b> — a menos que ρ = ±1 (correlação perfeita).
              </p>
              <p className="text-slate-400 text-sm">
                O ciclo X → Y → X&prime; alterna entre as duas retas, produzindo um inevitável movimento em direção ao centroide.
                O fator de contração é ρ² = {(POP.rho * POP.rho * 100).toFixed(0)}% — a cada ciclo completo, a distância à média é multiplicada por ρ².
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}
