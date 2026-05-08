"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui-forge/ui/card";
import { Switch } from "@/ui-forge/ui/switch";
import { Label } from "@/ui-forge/ui/label";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ZAxis } from "recharts";
import { mulberry32, boxMuller, computePCA2D } from "@/lib/pca";

function generateData() {
  const rand = mulberry32(777);

  // Cluster A: centered at x=-3, Cluster B: centered at x=3
  // Gene 1 (x): small variance (~1), contains cluster structure
  // Gene 2 (y): large variance (~300²), dwarfing the cluster signal
  const points: { x: number; y: number; cluster: string }[] = [];

  for (let i = 0; i < 15; i++) {
    const [n1, n2] = boxMuller(rand);
    points.push({
      x: +(-3 + n1 * 1.0).toFixed(3),
      y: +(0 + n2 * 300).toFixed(3),
      cluster: "A",
    });
  }
  for (let i = 0; i < 15; i++) {
    const [n1, n2] = boxMuller(rand);
    points.push({
      x: +(3 + n1 * 1.0).toFixed(3),
      y: +(0 + n2 * 300).toFixed(3),
      cluster: "B",
    });
  }
  return points;
}

const CLUSTER_COLORS: Record<string, string> = { A: "#ef4444", B: "#3b82f6" };

export function NatureMethodsPcaFig3() {
  const [standardize, setStandardize] = useState(false);
  const baseData = useMemo(() => generateData(), []);

  const pcaResult = useMemo(() => computePCA2D(baseData, standardize), [baseData, standardize]);

  const pcLines = useMemo(() => {
    const { centroid, eigenvectors, eigenvalues } = pcaResult;
    const [v1x, v1y] = eigenvectors[0];
    const [v2x, v2y] = eigenvectors[1];
    const s1 = 2 * Math.sqrt(eigenvalues[0]);
    const s2 = 2 * Math.sqrt(eigenvalues[1]);

    const pc1Line = [
      { x: +(centroid.x - v1x * s1).toFixed(3), y: +(centroid.y - v1y * s1).toFixed(3) },
      { x: +(centroid.x + v1x * s1).toFixed(3), y: +(centroid.y + v1y * s1).toFixed(3) },
    ];
    const pc2Line = [
      { x: +(centroid.x - v2x * s2).toFixed(3), y: +(centroid.y - v2y * s2).toFixed(3) },
      { x: +(centroid.x + v2x * s2).toFixed(3), y: +(centroid.y + v2y * s2).toFixed(3) },
    ];
    return { pc1Line, pc2Line };
  }, [pcaResult]);

  const chartData = baseData.map(p => ({
    x: p.x,
    y: p.y,
    cluster: p.cluster,
  }));

  const yDomain = standardize ? [-5, 5] : [-1000, 1000];
  const xDomain: [number, number] = [-8, 8];

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Sensibilidade de Escala</h3>
          <p className="text-slate-500 text-sm mt-1">
            Quando uma variável domina em magnitude, o PCA perde a estrutura de agrupamento.
          </p>
        </div>
        <div className="flex bg-white p-4 rounded-2xl border border-slate-200 shadow-sm items-center gap-4">
          <Switch
            id="pca-scale-toggle"
            checked={standardize}
            onCheckedChange={setStandardize}
            className="data-[state=checked]:bg-emerald-500"
          />
          <Label htmlFor="pca-scale-toggle" className="font-bold text-slate-700 cursor-pointer text-sm">
            Padronizar Variáveis
          </Label>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3 p-6 h-[420px]">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis
                type="number" dataKey="x" domain={xDomain}
                label={{ value: standardize ? "Gene 1 (padronizado)" : "Gene 1", position: "insideBottom", offset: -10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <YAxis
                type="number" dataKey="y" domain={yDomain}
                label={{ value: standardize ? "Gene 2 (padronizado)" : "Gene 2 (300× maior)", angle: -90, position: "insideLeft", offset: 10, fill: "#64748b", fontSize: 13 }}
                stroke="#cbd5e1" tick={{ fill: "#64748b", fontSize: 12 }}
              />
              <ZAxis type="number" range={[100, 100]} />

              {/* PC1 line */}
              <Line
                data={pcLines.pc1Line} type="linear" dataKey="y"
                stroke="#ef4444" strokeWidth={3} strokeDasharray="6 3"
                dot={false} isAnimationActive={false}
              />
              {/* PC2 line */}
              <Line
                data={pcLines.pc2Line} type="linear" dataKey="y"
                stroke="#f59e0b" strokeWidth={2.5} strokeDasharray="4 4"
                dot={false} isAnimationActive={false}
              />

              {/* Data scatter */}
              <Scatter name="Dados" data={chartData} isAnimationActive={false}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={CLUSTER_COLORS[entry.cluster]} />
                ))}
              </Scatter>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-8 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center gap-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Variância Explicada</p>
            <div className="space-y-2 mt-2">
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-0.5">
                  <span>PC1:</span>
                  <span className="tabular-nums">{(pcaResult.explainedVariance[0] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-red-400 rounded-full transition-all" style={{ width: `${pcaResult.explainedVariance[0] * 100}%` }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-xs font-bold text-slate-600 mb-0.5">
                  <span>PC2:</span>
                  <span className="tabular-nums">{(pcaResult.explainedVariance[1] * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div className="h-full bg-amber-400 rounded-full transition-all" style={{ width: `${pcaResult.explainedVariance[1] * 100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            {!standardize ? (
              <>
                <p className="font-bold text-rose-700">Dados brutos — clusters ocultos.</p>
                <p>
                  O Gene 2 tem variância ~300× maior que o Gene 1. O <b style={{ color: "#ef4444" }}>PC1</b> alinha-se quase totalmente com o Gene 2 — a separação entre os grupos A e B (presente no Gene 1) fica invisível na primeira componente.
                </p>
                <p className="border-l-4 border-rose-500 pl-3">
                  Ative a padronização para equalizar as variâncias e revelar os agrupamentos.
                </p>
              </>
            ) : (
              <>
                <p className="font-bold text-emerald-700">Variáveis padronizadas — clusters revelados.</p>
                <p>
                  Com ambas as variáveis na mesma escala, o <b style={{ color: "#ef4444" }}>PC1</b> agora captura a separação entre os grupos. A estrutura latente que existia nos dados desde o início tornou-se visível.
                </p>
                <p className="border-l-4 border-emerald-500 pl-3">
                  A padronização nem sempre é adequada — se as variáveis já estão na mesma escala, padronizá-las pode distorcer a estrutura dos dados.
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
