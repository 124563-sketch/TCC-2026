"use client";

import { useState, useMemo } from "react";
import {
  Line, XAxis, YAxis, CartesianGrid, Scatter, ZAxis, ComposedChart, ResponsiveContainer
} from "recharts";
import { Card } from "@/ui-forge/ui/card";
import { Switch } from "@/ui-forge/ui/switch";
import { Label } from "@/ui-forge/ui/label";
import { Badge } from "@/ui-forge/ui/badge";

// Basketball heights: overlapping classes
const mixedData = [
  { id: 1, x: 160, y: 0 }, { id: 2, x: 165, y: 0 }, { id: 3, x: 170, y: 0 },
  { id: 4, x: 175, y: 0 }, { id: 5, x: 180, y: 0 }, { id: 6, x: 185, y: 0 },
  { id: 7, x: 175, y: 1 }, { id: 8, x: 180, y: 1 }, { id: 9, x: 185, y: 1 },
  { id: 10, x: 190, y: 1 }, { id: 11, x: 195, y: 1 }, { id: 12, x: 200, y: 1 },
];

// Basketball heights: perfectly separable classes (gap at 175-190)
const separableData = [
  { id: 1, x: 155, y: 0 }, { id: 2, x: 160, y: 0 }, { id: 3, x: 165, y: 0 },
  { id: 4, x: 170, y: 0 }, { id: 5, x: 175, y: 0 },
  { id: 6, x: 190, y: 1 }, { id: 7, x: 195, y: 1 }, { id: 8, x: 200, y: 1 },
  { id: 9, x: 205, y: 1 }, { id: 10, x: 210, y: 1 },
];

export function NatureMethodsLogisticFig3() {
  const [isSeparable, setIsSeparable] = useState(false);

  const currentData = isSeparable ? separableData : mixedData;

  const { curveData, weight, nll, epochs } = useMemo(() => {
    let w = 0, b = 0;
    const lr = 0.5;
    const n = currentData.length;
    const totalEpochs = isSeparable ? 10000 : 2000;
    const minX = 140, rangeX = 80;

    const normData = currentData.map(p => ({ x: (p.x - minX) / rangeX, y: p.y }));

    // Track NLL every 200 epochs
    const logInterval = 200;
    let lastNll = 0;

    for (let epoch = 0; epoch < totalEpochs; epoch++) {
      let dw = 0, db = 0;
      for (const p of normData) {
        const pred = 1 / (1 + Math.exp(-(w * p.x + b)));
        const err = pred - p.y;
        dw += err * p.x; db += err;
      }
      w -= lr * dw / n; b -= lr * db / n;

      // Compute NLL at logging interval
      if ((epoch + 1) % logInterval === 0 || epoch === totalEpochs - 1) {
        let sumNll = 0;
        for (const p of normData) {
          const pred = 1 / (1 + Math.exp(-(w * p.x + b)));
          sumNll -= p.y * Math.log(Math.max(pred, 1e-15)) + (1 - p.y) * Math.log(Math.max(1 - pred, 1e-15));
        }
        lastNll = sumNll / n;
      }
    }

    // Curve
    const curve: { x: number; y: number }[] = [];
    for (let x = 140; x <= 220; x += 1) {
      const nx = (x - minX) / rangeX;
      const y = 1 / (1 + Math.exp(-(w * nx + b)));
      curve.push({ x, y: +y.toFixed(3) });
    }

    const logThresh = minX + (rangeX * (-b)) / w;

    return {
      curveData: curve,
      weight: +w.toFixed(3),
      nll: +lastNll.toFixed(3),
      epochs: totalEpochs,
    };
  }, [currentData, isSeparable]);

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">O Colapso da Separação Perfeita</h3>
          <p className="text-slate-500 text-sm mt-1">
            Quando as classes não se sobrepõem, o MLE perde a solução finita.
          </p>
        </div>

        <div className="flex bg-white p-4 rounded-2xl border border-slate-200 shadow-sm items-center gap-4">
          <Switch id="fig3-sep" checked={isSeparable} onCheckedChange={setIsSeparable} className="data-[state=checked]:bg-emerald-500" />
          <Label htmlFor="fig3-sep" className="font-bold text-slate-700 cursor-pointer text-sm">
            Dados Perfeitamente Separáveis
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        {/* Chart */}
        <div className="md:col-span-3 p-6 md:p-8 h-[450px] relative">
          <div className="absolute top-4 right-8 z-10">
            <Badge variant="outline" className="bg-white/80 backdrop-blur text-slate-600 font-bold border-slate-200 text-xs">
              {isSeparable ? 'Não Converge (slope → ∞)' : 'Curva Suave (convergência natural)'}
            </Badge>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                type="number" dataKey="x" domain={[140, 220]} tickCount={9}
                label={{ value: "Altura (cm)", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                type="number" dataKey="y" domain={[0, 1]} tickCount={5}
                label={{ value: "Probabilidade Predita", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
                tickFormatter={(val) => `${Math.round(val * 100)}%`}
              />
              <ZAxis type="number" range={[150, 150]} />

              <Line
                data={curveData}
                type="monotone" dataKey="y"
                stroke="hsl(var(--primary))" strokeWidth={5} dot={false}
                isAnimationActive={true} animationDuration={800}
              />

              <Scatter name="Não-Profissional (Y=0)" data={currentData.filter(d => d.y === 0)} fill="#f43f5e" line={false} isAnimationActive={false} />
              <Scatter name="Profissional (Y=1)" data={currentData.filter(d => d.y === 1)} fill="#10b981" line={false} isAnimationActive={false} />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Side Panel */}
        <div className="p-8 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center gap-6">
          {/* Weight */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">β̂₁ Estimado</p>
            <p className={`text-3xl font-headline font-bold tabular-nums transition-colors ${isSeparable ? 'text-amber-500' : 'text-slate-900'}`}>
              {isSeparable ? '∞*' : weight.toFixed(1)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              Após {epochs.toLocaleString()} épocas de GD
            </p>
          </div>

          {/* NLL */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Log-Veros. Negativa (NLL)</p>
            <p className={`text-3xl font-headline font-bold tabular-nums transition-colors ${isSeparable ? 'text-amber-500' : 'text-emerald-600'}`}>
              {isSeparable ? '→ 0' : nll.toFixed(3)}
            </p>
            <p className="text-[10px] text-slate-400 mt-1">
              {isSeparable ? 'Assintótico — nunca atinge 0' : 'Convergiu para valor finito'}
            </p>
          </div>

          {/* Explanation */}
          <div className="text-sm text-slate-600 leading-relaxed space-y-3">
            {isSeparable ? (
              <>
                <p>
                  <b className="text-amber-600">Sem solução finita:</b> quando as classes não se sobrepõem, infinitas curvas sigmoides classificam perfeitamente todos os pontos de treinamento.
                </p>
                <p>
                  O gradiente continua indefinidamente — a verossimilhança aumenta monotonicamente com β̂₁, mas nunca atinge o máximo. A curva tende a uma <b>função degrau</b>.
                </p>
              </>
            ) : (
              <>
                <p>
                  <b className="text-emerald-600">Convergência natural:</b> com sobreposição entre as classes (jogadores de 175–185 cm em ambas), o modelo encontra uma solução única e finita.
                </p>
                <p>
                  A ambiguidade nas alturas intermediárias força uma transição suave — a sigmoide reflete a incerteza real dos dados.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
