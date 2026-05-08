"use client";

import { useState, useMemo } from "react";
import {
  XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ComposedChart, ResponsiveContainer, Area, Line
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Switch } from "@/ui-forge/ui/switch";
import { Label } from "@/ui-forge/ui/label";
import { Slider } from "@/ui-forge/ui/slider";
import { tCritical975 } from "@/lib/t-distribution";

// Seeded PRNG
function mulberry32(seed: number) {
  return () => {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

export function NatureMethodsLinearFig2() {
  const [showCI, setShowCI] = useState(true);
  const [showPI, setShowPI] = useState(true);
  const [nSize, setNSize] = useState(15);
  const [sigma, setSigma] = useState(3);

  const { dataPoints, curveData, tValue, mse, ciWidthAtMean, piWidthAtMean } = useMemo(() => {
    // True population: μ(X) = 2X/3 − 45, σ configurable
    const trueIntercept = -45;
    const trueSlope = 2 / 3;

    const rand = mulberry32(nSize * 1000 + sigma * 100);

    const points: { x: number; y: number }[] = [];
    let sumX = 0;

    for (let i = 0; i < nSize; i++) {
      const x = 145 + rand() * 50;
      // Box-Muller for normal-ish noise
      const u1 = rand();
      const u2 = rand();
      const noise = Math.sqrt(-2 * Math.log(Math.max(u1, 0.001))) * Math.cos(2 * Math.PI * u2) * sigma;
      const y = trueSlope * x + trueIntercept + noise;
      points.push({ x, y });
      sumX += x;
    }

    const meanX = sumX / nSize;
    let sXX = 0;
    points.forEach(p => { sXX += (p.x - meanX) ** 2; });

    // LSE via covariance: β̂₁ = Σ(xᵢ−X̄)(yᵢ−Ȳ) / Σ(xᵢ−X̄)²
    let sumY = 0;
    points.forEach(p => { sumY += p.y; });
    const meanY = sumY / nSize;

    let sumXY = 0;
    points.forEach(p => { sumXY += (p.x - meanX) * (p.y - meanY); });

    const estSlope = sumXY / sXX;
    const estIntercept = meanY - estSlope * meanX;

    // MSE = SSE / (n − 2)
    let sse = 0;
    points.forEach(p => {
      const predY = estSlope * p.x + estIntercept;
      sse += (p.y - predY) ** 2;
    });
    const mseVal = nSize > 2 ? sse / (nSize - 2) : sse;

    // t-critical value with n−2 degrees of freedom
    const df = Math.max(1, nSize - 2);
    const tVal = tCritical975(df);

    // Band data — arrays for Recharts Area range rendering (rounded to 3 decimals)
    const curve: { x: number; mean: number; ci: [number, number]; pi: [number, number] }[] = [];
    for (let x = 140; x <= 200; x += 2) {
      const meanRaw = estSlope * x + estIntercept;
      const seMeanRaw = Math.sqrt(mseVal * (1 / nSize + ((x - meanX) ** 2) / sXX));
      const sePredRaw = Math.sqrt(mseVal * (1 + 1 / nSize + ((x - meanX) ** 2) / sXX));
      const mean = +meanRaw.toFixed(3);
      const seMean = +seMeanRaw.toFixed(3);
      const sePred = +sePredRaw.toFixed(3);

      curve.push({
        x,
        mean,
        ci: [+(mean - tVal * seMean).toFixed(3), +(mean + tVal * seMean).toFixed(3)],
        pi: [+(mean - tVal * sePred).toFixed(3), +(mean + tVal * sePred).toFixed(3)],
      });
    }

    // Width at mean X (narrowest point)
    const seMeanAtMean = +Math.sqrt(mseVal / nSize).toFixed(3);
    const sePredAtMean = +Math.sqrt(mseVal * (1 + 1 / nSize)).toFixed(3);
    const ciW = +(2 * tVal * seMeanAtMean).toFixed(3);
    const piW = +(2 * tVal * sePredAtMean).toFixed(3);

    return {
      dataPoints: points,
      curveData: curve,
      tValue: tVal,
      mse: mseVal,
      ciWidthAtMean: ciW,
      piWidthAtMean: piW,
    };
  }, [nSize, sigma]);

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Incerteza na Regressão</h3>
          <p className="text-slate-500 text-sm mt-1">
            Intervalos de Confiança e de Predição — duas perguntas diferentes, duas respostas diferentes.
          </p>
        </div>

        <div className="flex flex-col gap-2.5 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Switch id="ci-toggle" checked={showCI} onCheckedChange={setShowCI} className="data-[state=checked]:bg-blue-500" />
            <Label htmlFor="ci-toggle" className="font-bold text-slate-700 cursor-pointer text-sm">
              IC 95% — Onde está a reta média?
            </Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="pi-toggle" checked={showPI} onCheckedChange={setShowPI} className="data-[state=checked]:bg-slate-700" />
            <Label htmlFor="pi-toggle" className="font-bold text-slate-700 cursor-pointer text-sm">
              PI 95% — Onde estarão novos indivíduos?
            </Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5">
        {/* Chart */}
        <div className="md:col-span-3 p-6 md:p-8 h-[480px] relative">
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
              <ZAxis type="number" range={[150, 150]} />

              {/* Prediction Interval (wider, gray) — rendered first so CI draws on top */}
              {showPI && (
                <Area
                  data={curveData}
                  type="monotone"
                  dataKey="pi"
                  fill="#94a3b8"
                  stroke="none"
                  fillOpacity={0.25}
                  isAnimationActive={false}
                  name="PI 95%"
                />
              )}

              {/* Confidence Interval (narrower, blue) */}
              {showCI && (
                <Area
                  data={curveData}
                  type="monotone"
                  dataKey="ci"
                  fill="#3b82f6"
                  stroke="none"
                  fillOpacity={0.35}
                  isAnimationActive={false}
                  name="CI 95%"
                />
              )}

              {/* Regression line */}
              <Line data={curveData} type="monotone" dataKey="mean" stroke="#1e293b" strokeWidth={3} dot={false} isAnimationActive={false} />

              {/* Data points */}
              <Scatter name="Observações" data={dataPoints} fill="#ef4444" line={false} opacity={0.8} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Controls + Explanation */}
        <div className="md:col-span-2 p-8 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-between gap-6">
          {/* Sliders */}
          <div className="space-y-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Tamanho da Amostra (n):</span>
                <span className="text-blue-600 tabular-nums">{nSize}</span>
              </div>
              <Slider
                value={[nSize]}
                onValueChange={(v) => setNSize(v[0])}
                min={5} max={100} step={1}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex justify-between items-center text-sm font-bold">
                <span className="text-slate-700">Dispersão Biológica (σ):</span>
                <span className="text-blue-600 tabular-nums">{sigma.toFixed(1)}</span>
              </div>
              <Slider
                value={[sigma]}
                onValueChange={(v) => setSigma(v[0])}
                min={0.5} max={10} step={0.5}
                className="w-full"
              />
            </div>
          </div>

          {/* Width Readouts */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 space-y-4 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Largura dos Intervalos em X̄</p>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-blue-500/60" />
                <span className="text-sm font-bold text-slate-700">IC 95%:</span>
              </div>
              <span className="text-lg font-headline font-bold text-blue-600 tabular-nums">
                ±{ciWidthAtMean.toFixed(1)} kg
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-slate-400/60" />
                <span className="text-sm font-bold text-slate-700">PI 95%:</span>
              </div>
              <span className="text-lg font-headline font-bold text-slate-600 tabular-nums">
                ±{piWidthAtMean.toFixed(1)} kg
              </span>
            </div>

            <div className="pt-2 border-t border-slate-100 text-xs text-slate-500">
              t₀.₉₇₅({Math.max(1, nSize - 2)} g.l.) = {tValue.toFixed(3)}
            </div>
          </div>

          {/* Key insight */}
          <div className="space-y-3 text-sm text-slate-600 leading-relaxed">
            <div className="bg-blue-50 rounded-xl p-4 border border-blue-100">
              <p className="font-bold text-blue-800 text-xs uppercase tracking-wider mb-1">Intervalo de Confiança</p>
              <p className="text-blue-700 text-xs leading-relaxed">
                Estreita com <b>n maior</b> — mais dados reduzem a incerteza sobre a posição da reta. A largura tende a zero quando n → ∞.
              </p>
            </div>
            <div className="bg-slate-100 rounded-xl p-4 border border-slate-200">
              <p className="font-bold text-slate-700 text-xs uppercase tracking-wider mb-1">Intervalo de Predição</p>
              <p className="text-slate-600 text-xs leading-relaxed">
                <b>Não encolhe</b> com n maior — mesmo com infinitos dados, a variabilidade biológica σ impede que o PI colapse. Só encolhe quando σ diminui.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
