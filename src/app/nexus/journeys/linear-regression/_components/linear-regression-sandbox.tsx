"use client";

import { useState, useMemo } from "react";
import {
  Line, XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ComposedChart, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Slider } from "@/ui-forge/ui/slider";
import { Button } from "@/ui-forge/ui/button";
import { Target, RotateCcw } from "lucide-react";

// Height (cm) vs Weight (kg) — 12 patients
const baseData = [
  { id: 1, x: 150, y: 55 },
  { id: 2, x: 153, y: 50 },
  { id: 3, x: 158, y: 56 },
  { id: 4, x: 160, y: 60 },
  { id: 5, x: 165, y: 62 },
  { id: 6, x: 170, y: 68 },
  { id: 7, x: 173, y: 65 },
  { id: 8, x: 175, y: 72 },
  { id: 9, x: 180, y: 78 },
  { id: 10, x: 184, y: 85 },
  { id: 11, x: 188, y: 80 },
  { id: 12, x: 195, y: 90 },
];

export function LinearRegressionSandbox() {
  const [slope, setSlope] = useState(0.35);
  const [intercept, setIntercept] = useState(-2);

  // Exact LSE solution (computed once)
  const { bestSlope, bestIntercept } = useMemo(() => {
    const n = baseData.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    baseData.forEach(p => {
      sumX += p.x; sumY += p.y;
      sumXY += p.x * p.y; sumXX += p.x * p.x;
    });
    const m = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const b = (sumY - m * sumX) / n;
    return { bestSlope: m, bestIntercept: b };
  }, []);

  const handleOptimize = () => {
    setSlope(Number(bestSlope.toFixed(2)));
    setIntercept(Number(bestIntercept.toFixed(1)));
  };

  const handleReset = () => {
    setSlope(0.35);
    setIntercept(-2);
  };

  // SST = Σ(yᵢ − ȳ)² — fixed, depends only on data
  const sst = useMemo(() => {
    const my = baseData.reduce((s, p) => s + p.y, 0) / baseData.length;
    return baseData.reduce((s, p) => s + (p.y - my) ** 2, 0);
  }, []);

  // Compute SSE, R², curve, and per-point residuals
  const { curveData, ssr, r2, residuals, maxAbsResidual } = useMemo(() => {
    let errorSum = 0;
    const res: { id: number; x: number; y: number; predY: number; absErr: number }[] = [];

    baseData.forEach(p => {
      const predY = slope * p.x + intercept;
      const error = p.y - predY;
      errorSum += error * error;
      res.push({ id: p.id, x: p.x, y: p.y, predY, absErr: Math.abs(error) });
    });

    const curve: { x: number; y: number }[] = [];
    for (let x = 140; x <= 200; x += 5) {
      curve.push({ x, y: +(slope * x + intercept).toFixed(3) });
    }

    const maxAbs = Math.max(...res.map(r => r.absErr), 0.1);
    const computedR2 = Math.max(0, 1 - errorSum / sst);
    return { curveData: curve, ssr: errorSum, r2: computedR2, residuals: res, maxAbsResidual: maxAbs };
  }, [slope, intercept, sst]);

  // Square size proportional to absolute residual (capped)
  const getSquareHalf = (absErr: number) => {
    const normalized = absErr / maxAbsResidual;
    return 2 + normalized * 12; // 2px to 14px half-side
  };

  // SSR color — smooth gradient from green (optimal) to red (poor)
  const minSSR = useMemo(() => {
    let sum = 0;
    baseData.forEach(p => {
      const predY = bestSlope * p.x + bestIntercept;
      sum += (p.y - predY) ** 2;
    });
    return sum;
  }, [bestSlope, bestIntercept]);

  const ssrRatio = Math.min(ssr / (minSSR * 5), 1); // normalized: 1x min = green, 5x min = red
  const hue = 140 - ssrRatio * 140; // green (140°) to red (0°)
  const ssrColor = `hsl(${hue}, 80%, 45%)`;

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Control Panel */}
        <div className="p-6 lg:p-8 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50 flex flex-col justify-between lg:col-span-1">
          <div className="space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 text-[10px] font-bold uppercase tracking-[0.2em] mb-3">
                Laboratório Interativo
              </div>
              <h3 className="font-headline text-xl font-bold tracking-tight text-slate-900 mb-1.5">Ajuste por Mínimos Quadrados</h3>
              <p className="text-xs text-slate-500 font-medium leading-relaxed">
                Os <b>quadrados</b> têm área proporcional ao erro² de cada ponto.
              </p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">β₁ (Inclinação):</span>
                  <span className="text-blue-600 tabular-nums">{slope.toFixed(2)}</span>
                </div>
                <Slider
                  value={[slope]}
                  onValueChange={(v) => setSlope(v[0])}
                  min={0.1} max={1.5} step={0.01}
                  className="w-full"
                />
              </div>

              <div className="space-y-2.5">
                <div className="flex justify-between items-center text-xs font-bold">
                  <span className="text-slate-700">β₀ (Intercepto):</span>
                  <span className="text-blue-600 tabular-nums">{intercept.toFixed(1)}</span>
                </div>
                <Slider
                  value={[intercept]}
                  onValueChange={(v) => setIntercept(v[0])}
                  min={-150} max={150} step={1}
                  className="w-full"
                />
              </div>

              <div className="space-y-3 pt-6 border-t border-slate-200">
                <Button
                  variant="default"
                  onClick={handleOptimize}
                  className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold h-11 rounded-xl flex items-center justify-center gap-1.5 text-xs"
                >
                  <Target className="w-3.5 h-3.5 shrink-0" /> Otimizar (LSE)
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  className="w-full text-slate-400 hover:text-slate-600 flex items-center justify-center gap-1.5 text-xs"
                >
                  <RotateCcw className="w-3.5 h-3.5 shrink-0" /> Reiniciar
                </Button>
              </div>
            </div>
          </div>

          {/* SSE + R² Display */}
          <div className="mt-6 space-y-3">
            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">SSE</p>
              <p
                className="text-3xl font-headline font-bold tabular-nums transition-colors duration-300"
                style={{ color: ssrColor }}
              >
                {Math.round(ssr).toLocaleString()}
              </p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{
                    width: `${Math.max(2, (1 - ssrRatio) * 100)}%`,
                    backgroundColor: ssrColor,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                Mínimo LSE: <span className="text-emerald-600 font-bold">{Math.round(minSSR).toLocaleString()}</span>
              </p>
            </div>

            <div className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">R²</p>
                <p className="text-[10px] text-slate-400 font-medium">SSR / SST</p>
              </div>
              <p className="text-3xl font-headline font-bold tabular-nums text-violet-600 transition-all duration-300">
                {r2.toFixed(3)}
              </p>
              <div className="mt-2 w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-300"
                  style={{ width: `${Math.max(2, r2 * 100)}%` }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-1.5 font-medium">
                Variância de Y explicada pela reta
              </p>
            </div>
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-4 p-6 lg:p-10 h-[550px] lg:h-[620px] flex flex-col">
          <div className="flex-1 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  type="number" dataKey="x" domain={[140, 200]} tickCount={7}
                  label={{ value: "Altura (cm)", position: "insideBottom", offset: -10, fill: "#94a3b8", fontSize: 13 }}
                  stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  type="number" dataKey="y" domain={[40, 120]} tickCount={9}
                  label={{ value: "Peso (kg)", angle: -90, position: "insideLeft", offset: 10, fill: "#94a3b8", fontSize: 13 }}
                  stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <ZAxis type="number" range={[150, 150]} />

                {/* Regression line */}
                <Line
                  data={curveData}
                  type="monotone"
                  dataKey="y"
                  stroke="hsl(var(--primary))"
                  strokeWidth={4}
                  dot={false}
                  activeDot={false}
                  isAnimationActive={false}
                />

                {/* Data points with squared-error squares */}
                <Scatter
                  name="Dados"
                  data={residuals}
                  fill="#3b82f6"
                  line={false}
                  isAnimationActive={false}
                  shape={(props: any) => {
                    const { cx, cy, payload } = props;
                    const half = payload ? getSquareHalf(payload.absErr) : 3;
                    const squareColor = payload
                      ? payload.absErr > 10 ? "#ef4444" : payload.absErr > 4 ? "#f59e0b" : "#22c55e"
                      : "#3b82f6";
                    return (
                      <g>
                        <rect
                          x={cx - half}
                          y={cy - half}
                          width={half * 2}
                          height={half * 2}
                          fill={squareColor}
                          fillOpacity={0.35}
                          stroke={squareColor}
                          strokeWidth={1.5}
                          rx={1}
                        />
                        <circle cx={cx} cy={cy} r={5} fill="#3b82f6" stroke="#fff" strokeWidth={2} />
                      </g>
                    );
                  }}
                />

                {/* Residual lines */}
                {residuals.map(p => (
                  <ReferenceLine
                    key={`res-${p.id}`}
                    segment={[{ x: p.x, y: p.y }, { x: p.x, y: p.predY }]}
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    strokeOpacity={0.4}
                    strokeDasharray="4 3"
                    isFront={false}
                  />
                ))}
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          {/* Legend */}
          <div className="flex items-center gap-6 justify-center mt-2 text-xs text-slate-500 font-medium">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-red-500/35 border border-red-500" />
              <span>Erro² grande (&gt;10 kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-amber-500/35 border border-amber-500" />
              <span>Erro² médio (4–10 kg)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-sm bg-emerald-500/35 border border-emerald-500" />
              <span>Erro² pequeno (&lt;4 kg)</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
