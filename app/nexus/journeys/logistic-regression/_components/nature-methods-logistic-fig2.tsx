"use client";

import { useState, useMemo } from "react";
import {
  Line, XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ReferenceLine, ComposedChart, ResponsiveContainer
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Switch } from "@/ui-forge/ui/switch";
import { Label } from "@/ui-forge/ui/label";
import { Badge } from "@/ui-forge/ui/badge";

const baseData = [
  { id: 1, x: 155, y: 0 }, { id: 2, x: 160, y: 0 }, { id: 3, x: 162, y: 0 },
  { id: 4, x: 165, y: 0 }, { id: 5, x: 168, y: 0 }, { id: 6, x: 170, y: 0 },
  { id: 7, x: 172, y: 0 }, { id: 8, x: 175, y: 0 }, { id: 9, x: 175, y: 0 },
  { id: 10, x: 178, y: 0 }, { id: 11, x: 180, y: 0 }, { id: 12, x: 182, y: 0 },
  { id: 13, x: 185, y: 0 }, { id: 14, x: 188, y: 0 }, { id: 15, x: 191, y: 0 },
  { id: 16, x: 195, y: 1 }, { id: 17, x: 198, y: 1 }, { id: 18, x: 200, y: 1 },
  { id: 19, x: 205, y: 1 }, { id: 20, x: 210, y: 1 },
];

const outlier = { id: 21, x: 100, y: 0 };

function computeModels(data: { x: number; y: number }[]) {
  const n = data.length;

  // Linear Regression (OLS)
  let sumX = 0, sumY = 0, sumXY = 0, sumXX = 0;
  for (const p of data) {
    sumX += p.x; sumY += p.y;
    sumXY += p.x * p.y; sumXX += p.x * p.x;
  }
  const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX);
  const intercept = (sumY - slope * sumX) / n;

  // Logistic Regression (GD)
  let w = 0, b = 0;
  const lr = 0.5;
  const minX = 90, rangeX = 130;
  const normData = data.map(p => ({ x: (p.x - minX) / rangeX, y: p.y }));
  for (let i = 0; i < 3000; i++) {
    let dw = 0, db = 0;
    for (const p of normData) {
      const pred = 1 / (1 + Math.exp(-(w * p.x + b)));
      const err = pred - p.y;
      dw += err * p.x; db += err;
    }
    w -= lr * dw / n; b -= lr * db / n;
  }

  // Curve points
  const linCurve: { x: number; y: number }[] = [];
  const logCurve: { x: number; y: number }[] = [];
  for (let x = 90; x <= 220; x += 2) {
    const yLin = Math.max(-0.2, Math.min(1.2, slope * x + intercept));
    linCurve.push({ x, y: +yLin.toFixed(3) });

    const nx = (x - minX) / rangeX;
    const yLog = 1 / (1 + Math.exp(-(w * nx + b)));
    logCurve.push({ x, y: +yLog.toFixed(3) });
  }

  const linThresh = (0.5 - intercept) / slope;
  const logThresh = minX + (rangeX * (-b)) / w;

  return {
    linearPoints: linCurve,
    logisticPoints: logCurve,
    linearThreshold: +linThresh.toFixed(1),
    logisticThreshold: +logThresh.toFixed(1),
  };
}

export function NatureMethodsLogisticFig2() {
  const [includeOutlier, setIncludeOutlier] = useState(false);
  const [showLinear, setShowLinear] = useState(true);
  const [showLogistic, setShowLogistic] = useState(true);

  const currentData = useMemo(
    () => includeOutlier ? [...baseData, outlier] : baseData,
    [includeOutlier]
  );

  // Compute both states for comparison: without outlier (always) and current
  const modelsWithoutOutlier = useMemo(() => computeModels(baseData), []);
  const modelsCurrent = useMemo(() => computeModels(currentData), [currentData]);

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Robustez a Outliers</h3>
          <p className="text-slate-500 text-sm mt-1">
            Como um único ponto anômalo afeta cada método de classificação.
          </p>
        </div>

        <div className="flex flex-col gap-3 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <div className="flex items-center gap-3">
            <Switch id="fig2-outlier" checked={includeOutlier} onCheckedChange={setIncludeOutlier} className="data-[state=checked]:bg-amber-500" />
            <Label htmlFor="fig2-outlier" className="font-bold text-amber-600 cursor-pointer text-sm">
              Incluir Outlier (Criança de 100 cm)
            </Label>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Switch id="fig2-linear" checked={showLinear} onCheckedChange={setShowLinear} />
              <Label htmlFor="fig2-linear" className="text-sm cursor-pointer font-medium text-slate-700">
                Regressão Linear
              </Label>
            </div>
            <div className="flex items-center gap-2">
              <Switch id="fig2-logistic" checked={showLogistic} onCheckedChange={setShowLogistic} />
              <Label htmlFor="fig2-logistic" className="text-sm cursor-pointer font-medium text-primary">
                Regressão Logística
              </Label>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="p-6 md:p-8 h-[480px] w-full relative">
        <div className="absolute top-4 right-8 z-10 flex flex-col gap-2 items-end">
          <Badge variant="outline" className="bg-white/80 backdrop-blur text-slate-600 font-bold border-slate-200 text-xs">
            Limiar de Decisão em 50%
          </Badge>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis
              type="number" dataKey="x" domain={[90, 220]} tickCount={14}
              label={{ value: "Altura (cm)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
              stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
            />
            <YAxis
              type="number" dataKey="y" domain={[-0.2, 1.2]} tickCount={8}
              label={{ value: "Probabilidade: Pro Basketball", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
              stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              ticks={[0, 0.25, 0.5, 0.75, 1]}
              tickFormatter={(val) => `${Math.round(val * 100)}%`}
            />
            <ZAxis type="number" range={[150, 150]} />

            <ReferenceLine y={0.5} stroke="#94a3b8" strokeDasharray="3 3" />

            {/* Threshold lines */}
            {showLinear && (
              <ReferenceLine x={modelsCurrent.linearThreshold} stroke="#0f172a" strokeDasharray="5 4" strokeWidth={2} />
            )}
            {showLogistic && (
              <ReferenceLine x={modelsCurrent.logisticThreshold} stroke="hsl(var(--primary))" strokeDasharray="5 4" strokeWidth={2} />
            )}

            {/* Curves */}
            {showLinear && (
              <Line data={modelsCurrent.linearPoints} type="monotone" dataKey="y" stroke="#0f172a" strokeWidth={3} dot={false} isAnimationActive={false} />
            )}
            {showLogistic && (
              <Line data={modelsCurrent.logisticPoints} type="monotone" dataKey="y" stroke="hsl(var(--primary))" strokeWidth={4} dot={false} isAnimationActive={false} />
            )}

            {/* Data points */}
            <Scatter name="Não Profissional" data={currentData.filter(d => d.y === 0)} fill="#f43f5e" line={false} isAnimationActive={false} />
            <Scatter name="Profissional" data={currentData.filter(d => d.y === 1)} fill="#10b981" line={false} isAnimationActive={false} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>

      {/* Comparison Table */}
      <div className="bg-slate-50 p-6 border-t border-slate-100">
        <div className="max-w-2xl mx-auto grid grid-cols-3 gap-4 text-center">
          <div className="text-xs font-bold uppercase tracking-widest text-slate-400 self-end">Condição</div>
          <div className="text-xs font-bold uppercase tracking-widest text-slate-700 self-end">
            Limiar <span className="border-b-2 border-slate-900 pb-0.5">Linear</span>
          </div>
          <div className="text-xs font-bold uppercase tracking-widest text-primary self-end">
            Limiar <span className="border-b-2 border-primary pb-0.5">Logístico</span>
          </div>

          <div className="text-sm font-medium text-slate-600 py-2">Sem Outlier</div>
          <div className="text-lg font-headline font-bold text-slate-900 tabular-nums py-2">
            {modelsWithoutOutlier.linearThreshold.toFixed(1)} cm
          </div>
          <div className="text-lg font-headline font-bold text-primary tabular-nums py-2">
            {modelsWithoutOutlier.logisticThreshold.toFixed(1)} cm
          </div>

          <div className="text-sm font-medium text-amber-600 py-2 border-t border-slate-200">Com Outlier (100 cm)</div>
          <div className="text-lg font-headline font-bold text-slate-900 tabular-nums py-2 border-t border-slate-200">
            {modelsCurrent.linearThreshold.toFixed(1)} cm
          </div>
          <div className="text-lg font-headline font-bold text-primary tabular-nums py-2 border-t border-slate-200">
            {modelsCurrent.logisticThreshold.toFixed(1)} cm
          </div>

          <div className="text-sm font-medium text-slate-600 py-2 border-t border-slate-200">Deslocamento</div>
          <div className="text-sm font-bold text-red-600 tabular-nums py-2 border-t border-slate-200">
            {modelsCurrent.linearThreshold > modelsWithoutOutlier.linearThreshold ? '+' : ''}
            {(modelsCurrent.linearThreshold - modelsWithoutOutlier.linearThreshold).toFixed(1)} cm
          </div>
          <div className="text-sm font-bold text-emerald-600 tabular-nums py-2 border-t border-slate-200">
            {modelsCurrent.logisticThreshold > modelsWithoutOutlier.logisticThreshold ? '+' : ''}
            {(modelsCurrent.logisticThreshold - modelsWithoutOutlier.logisticThreshold).toFixed(1)} cm
          </div>
        </div>
      </div>
    </Card>
  );
}
