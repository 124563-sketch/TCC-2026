"use client";

import { useState, useMemo } from "react";
import {
  Line, XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ComposedChart, ResponsiveContainer, ReferenceLine
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Slider } from "@/ui-forge/ui/slider";
import { Button } from "@/ui-forge/ui/button";
import { Badge } from "@/ui-forge/ui/badge";
import { Switch } from "@/ui-forge/ui/switch";
import { Label } from "@/ui-forge/ui/label";
import { RotateCcw } from "lucide-react";

// Basketball height data: 15 non-pros (mean ~170cm) + 5 pros (mean ~200cm)
const initialData = [
  { id: 1, x: 155, y: 0 }, { id: 2, x: 160, y: 0 }, { id: 3, x: 162, y: 0 },
  { id: 4, x: 165, y: 0 }, { id: 5, x: 168, y: 0 }, { id: 6, x: 170, y: 0 },
  { id: 7, x: 172, y: 0 }, { id: 8, x: 175, y: 0 }, { id: 9, x: 175, y: 0 },
  { id: 10, x: 178, y: 0 }, { id: 11, x: 180, y: 0 }, { id: 12, x: 182, y: 0 },
  { id: 13, x: 185, y: 0 }, { id: 14, x: 188, y: 0 }, { id: 15, x: 191, y: 0 },
  { id: 16, x: 195, y: 1 }, { id: 17, x: 198, y: 1 }, { id: 18, x: 200, y: 1 },
  { id: 19, x: 205, y: 1 }, { id: 20, x: 210, y: 1 },
];

// Deterministic heights for point addition
const nonProHeights = [152, 157, 162, 167, 172, 177, 182, 187, 192];
const proHeights = [192, 197, 202, 207, 212];

export function NatureMethodsLogisticFig1() {
  const [data, setData] = useState(initialData);
  const [showLinear, setShowLinear] = useState(true);
  const [showStep, setShowStep] = useState(true);
  const [showSigmoid, setShowSigmoid] = useState(true);
  const [threshold, setThreshold] = useState(0.5);
  const [nonProIdx, setNonProIdx] = useState(0);
  const [proIdx, setProIdx] = useState(0);

  const { linearPoints, linearThreshold, linearAccuracy, stepThreshold, stepPoints, stepAccuracy, sigmoidPoints, logisticThreshold, logisticAccuracy, weight } = useMemo(() => {
    const n = data.length;
    let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
    for (const p of data) {
      sumX += p.x; sumY += p.y;
      sumXY += p.x * p.y; sumXX += p.x * p.x;
    }
    const linSlope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
    const linIntercept = (sumY - linSlope * sumX) / n;

    // Linear curve points
    const linPts: { x: number; y: number }[] = [];
    for (let x = 140; x <= 230; x += 2) {
      const y = linSlope * x + linIntercept;
      linPts.push({ x, y: +y.toFixed(3) });
    }
    const linThresh = (0.5 - linIntercept) / linSlope;

    // Linear accuracy: classify as 1 if y_pred >= 0.5
    let linCorrect = 0;
    for (const p of data) {
      const yPred = linSlope * p.x + linIntercept;
      const pred = yPred >= threshold ? 1 : 0;
      if (pred === p.y) linCorrect++;
    }
    const linAcc = Math.round((linCorrect / n) * 100);

    // Step function: jump at midpoint between max non-pro and min pro
    const maxNonPro = Math.max(...data.filter(p => p.y === 0).map(p => p.x));
    const minPro = Math.min(...data.filter(p => p.y === 1).map(p => p.x));
    const stepThresh = (maxNonPro + minPro) / 2;
    const stepPts = [
      { x: 140, y: 0 },
      { x: stepThresh, y: 0 },
      { x: stepThresh, y: 1 },
      { x: 230, y: 1 },
    ];

    // Step accuracy
    let stepCorrect = 0;
    for (const p of data) {
      const pred = p.x >= stepThresh ? 1 : 0;
      if (pred === p.y) stepCorrect++;
    }
    const stepAcc = Math.round((stepCorrect / n) * 100);

    // Logistic sigmoid via gradient descent
    let w = 0, b = 0;
    const lr = 0.5;
    const minX = 90, rangeX = 140;
    const normData = data.map(p => ({ x: (p.x - minX) / rangeX, y: p.y }));
    for (let epoch = 0; epoch < 3000; epoch++) {
      let dw = 0, db = 0;
      for (const p of normData) {
        const pred = 1 / (1 + Math.exp(-(w * p.x + b)));
        const err = pred - p.y;
        dw += err * p.x; db += err;
      }
      w -= lr * dw / n; b -= lr * db / n;
    }

    const sigPts: { x: number; y: number }[] = [];
    for (let x = 140; x <= 230; x += 2) {
      const nx = (x - minX) / rangeX;
      const y = 1 / (1 + Math.exp(-(w * nx + b)));
      sigPts.push({ x, y: +y.toFixed(3) });
    }
    const logThresh = minX + (rangeX * (-b)) / w;

    // Logistic accuracy
    let logCorrect = 0;
    for (const p of data) {
      const nx = (p.x - minX) / rangeX;
      const prob = 1 / (1 + Math.exp(-(w * nx + b)));
      const pred = prob >= threshold ? 1 : 0;
      if (pred === p.y) logCorrect++;
    }
    const logAcc = Math.round((logCorrect / n) * 100);

    return {
      linearPoints: linPts,
      linearThreshold: linThresh,
      linearAccuracy: linAcc,
      stepThreshold: stepThresh,
      stepPoints: stepPts,
      stepAccuracy: stepAcc,
      sigmoidPoints: sigPts,
      logisticThreshold: logThresh,
      logisticAccuracy: logAcc,
      weight: +w.toFixed(3),
    };
  }, [data, threshold]);

  const handleAddNonPro = () => {
    const x = nonProHeights[nonProIdx % nonProHeights.length];
    setNonProIdx(nonProIdx + 1);
    setData([...data, { id: Date.now(), x, y: 0 }]);
  };

  const handleAddPro = () => {
    const x = proHeights[proIdx % proHeights.length];
    setProIdx(proIdx + 1);
    setData([...data, { id: Date.now(), x, y: 1 }]);
  };

  const handleReset = () => {
    setData(initialData);
    setNonProIdx(0);
    setProIdx(0);
  };

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Por que a Reta Falha para Classificação</h3>
          <p className="text-slate-500 text-sm mt-1">
            Três maneiras de modelar a relação entre Altura e ser jogador profissional de basquete.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5">
        {/* Control Panel */}
        <div className="p-5 lg:p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50 flex flex-col justify-between lg:col-span-1">
          <div className="space-y-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-[0.2em] mb-2">
                Laboratório Interativo
              </div>
              <h3 className="font-headline text-lg font-bold tracking-tight text-slate-900 mb-1.5">Modelos de Decisão</h3>
              <p className="text-[11px] text-slate-500 font-medium leading-relaxed">
                Compare os três modelos de classificação.
              </p>
            </div>

            {/* Curve Toggles */}
            <div className="space-y-2.5">
              <div className="flex items-center gap-3">
                <Switch id="fig1-linear" checked={showLinear} onCheckedChange={setShowLinear} />
                <Label htmlFor="fig1-linear" className="font-bold text-slate-700 cursor-pointer text-sm flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-slate-900 inline-block" style={{ height: 3 }} />
                  Regressão Linear
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="fig1-step" checked={showStep} onCheckedChange={setShowStep} className="data-[state=checked]:bg-amber-500" />
                <Label htmlFor="fig1-step" className="font-bold text-slate-700 cursor-pointer text-sm flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-amber-500 inline-block" style={{ height: 3 }} />
                  Função Degrau
                </Label>
              </div>
              <div className="flex items-center gap-3">
                <Switch id="fig1-sigmoid" checked={showSigmoid} onCheckedChange={setShowSigmoid} className="data-[state=checked]:bg-primary" />
                <Label htmlFor="fig1-sigmoid" className="font-bold text-slate-700 cursor-pointer text-sm flex items-center gap-1.5">
                  <span className="w-3 h-0.5 bg-primary inline-block" style={{ height: 3 }} />
                  Sigmoide Logística
                </Label>
              </div>
            </div>

            {/* Threshold Slider */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[11px] font-bold">
                <span className="text-slate-700">Limiar:</span>
                <span className="text-primary tabular-nums">{Math.round(threshold * 100)}%</span>
              </div>
              <Slider
                value={[threshold]}
                onValueChange={(v) => setThreshold(v[0])}
                min={0.01} max={0.99} step={0.01}
                className="w-full"
              />
            </div>

            {/* Add Point Buttons */}
            <div className="space-y-2.5 pt-4 border-t border-slate-200">
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Adicionar Dados</p>
              <div className="grid grid-cols-2 gap-2">
                <Button
                  variant="outline" size="sm"
                  onClick={handleAddPro}
                  className="text-emerald-600 border-emerald-200 hover:bg-emerald-50 text-xs"
                >
                  + Pro
                </Button>
                <Button
                  variant="outline" size="sm"
                  onClick={handleAddNonPro}
                  className="text-rose-600 border-rose-200 hover:bg-rose-50 text-xs"
                >
                  + Não-Pro
                </Button>
              </div>
              <Button
                variant="ghost" size="sm"
                onClick={handleReset}
                className="w-full text-slate-400 hover:text-slate-600 text-xs flex items-center justify-center gap-1.5"
              >
                <RotateCcw className="w-3.5 h-3.5 shrink-0" /> Resetar Dados
              </Button>
            </div>
          </div>

          {/* Per-Model Accuracy — only shown for active models */}
          <div className="mt-4 space-y-1.5">
            {showSigmoid && (
              <div className="p-3 bg-white rounded-2xl border border-primary/20 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-primary mb-0.5">Sigmoide</p>
                <p className="text-2xl font-headline font-bold tabular-nums text-primary">{logisticAccuracy}%</p>
              </div>
            )}
            {showLinear && (
              <div className="p-3 bg-white rounded-2xl border border-slate-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-0.5">Reg. Linear</p>
                <p className="text-2xl font-headline font-bold tabular-nums text-slate-600">{linearAccuracy}%</p>
              </div>
            )}
            {showStep && (
              <div className="p-3 bg-white rounded-2xl border border-amber-200 shadow-sm">
                <p className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-0.5">Degrau</p>
                <p className="text-2xl font-headline font-bold tabular-nums text-amber-600">{stepAccuracy}%</p>
              </div>
            )}
            {!showLinear && !showStep && !showSigmoid && (
              <p className="text-[10px] text-slate-400 text-center">Ative ao menos um modelo</p>
            )}
          </div>
        </div>

        {/* Chart */}
        <div className="lg:col-span-4 p-6 lg:p-10 h-[550px] flex flex-col">
          <div className="flex items-center justify-center gap-6 mb-4">
            <Badge variant="outline" className="border-rose-200 bg-rose-50 text-rose-700 px-4 py-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 inline-block" /> Não-Profissional (Y=0)
            </Badge>
            <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-1.5 text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 inline-block" /> Profissional (Y=1)
            </Badge>
          </div>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  type="number" dataKey="x" domain={[140, 230]} tickCount={10}
                  label={{ value: "Altura (cm)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
                  stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
                />
                <YAxis
                  type="number" dataKey="y" domain={[-0.3, 1.3]} tickCount={7}
                  label={{ value: "Probabilidade Predita", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
                  stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
                  tickFormatter={(val) => `${Math.round(val * 100)}%`}
                  ticks={[0, 0.25, 0.5, 0.75, 1]}
                />
                <ZAxis type="number" range={[150, 150]} />

                {/* Reference lines */}
                <ReferenceLine y={0} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine y={1} stroke="#cbd5e1" strokeWidth={1} />
                <ReferenceLine y={threshold} stroke="#ef4444" strokeWidth={2} strokeDasharray="3 3" label={{ value: `Limiar ${Math.round(threshold * 100)}%`, position: 'right', fill: '#ef4444', fontSize: 12 }} />

                {/* Linear line */}
                {showLinear && (
                  <Line
                    data={linearPoints}
                    type="monotone" dataKey="y"
                    stroke="#0f172a" strokeWidth={2.5} dot={false}
                    isAnimationActive={false}
                    strokeDasharray="6 3"
                  />
                )}

                {/* Step function */}
                {showStep && (
                  <Line
                    data={stepPoints}
                    type="stepAfter" dataKey="y"
                    stroke="#f59e0b" strokeWidth={3} dot={false}
                    isAnimationActive={false}
                  />
                )}

                {/* Sigmoid curve */}
                {showSigmoid && (
                  <Line
                    data={sigmoidPoints}
                    type="monotone" dataKey="y"
                    stroke="hsl(var(--primary))" strokeWidth={4} dot={false}
                    isAnimationActive={false}
                  />
                )}

                {/* Threshold reference lines */}
                {showLinear && (
                  <ReferenceLine x={linearThreshold} stroke="#0f172a" strokeWidth={1.5} strokeDasharray="4 4" />
                )}
                {showStep && (
                  <ReferenceLine x={stepThreshold} stroke="#f59e0b" strokeWidth={1.5} strokeDasharray="4 4" />
                )}
                {showSigmoid && (
                  <ReferenceLine x={logisticThreshold} stroke="hsl(var(--primary))" strokeWidth={1.5} strokeDasharray="4 4" />
                )}

                {/* Data points */}
                <Scatter
                  name="Não-Profissional"
                  data={data.filter(d => d.y === 0)}
                  fill="#f43f5e" line={false} isAnimationActive={false}
                />
                <Scatter
                  name="Profissional"
                  data={data.filter(d => d.y === 1)}
                  fill="#10b981" line={false} isAnimationActive={false}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Dynamic Footer */}
          <div className="flex items-center gap-6 justify-center mt-2 text-xs text-slate-500 font-medium flex-wrap">
            {showLinear && (
              <span>Limiar Linear: <b className="text-slate-900">{linearThreshold.toFixed(1)} cm</b></span>
            )}
            {showStep && (
              <span>Limiar Degrau: <b className="text-amber-600">{stepThreshold.toFixed(1)} cm</b></span>
            )}
            {showSigmoid && (
              <span>Limiar Logístico: <b className="text-primary">{logisticThreshold.toFixed(1)} cm</b></span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
