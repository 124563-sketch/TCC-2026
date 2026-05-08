"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui-forge/ui/card";
import { Spline, CircleSlash, Inspect } from "lucide-react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell, ZAxis } from "recharts";
import { mulberry32, computePCA2D } from "@/lib/pca";

type Scenario = "nonlinear" | "nonorthogonal" | "obscured";

function generateData(scenario: Scenario) {
  if (scenario === "nonlinear") {
    const pts: { x: number; y: number; fill: string }[] = [];
    for (let i = -10; i <= 10; i += 0.5) {
      pts.push({ x: +i.toFixed(3), y: +(0.5 * i * i - 20).toFixed(3), fill: "#8b5cf6" });
    }
    return pts;
  }
  if (scenario === "nonorthogonal") {
    const pts: { x: number; y: number; fill: string }[] = [];
    for (let i = 0; i <= 15; i += 1) {
      pts.push({ x: +i.toFixed(3), y: +i.toFixed(3), fill: "#8b5cf6" });
      pts.push({ x: +i.toFixed(3), y: +(-i).toFixed(3), fill: "#8b5cf6" });
    }
    return pts;
  }
  // obscured: two clusters with large Y-variance, small X-separation
  const rand = mulberry32(99);
  const pts: { x: number; y: number; fill: string }[] = [];
  for (let i = 0; i < 25; i++) {
    pts.push({ x: +(-2 + rand() * 0.5).toFixed(3), y: +(rand() * 80 - 40).toFixed(3), fill: "#ef4444" });
    pts.push({ x: +(2 + rand() * 0.5).toFixed(3), y: +(rand() * 80 - 40).toFixed(3), fill: "#3b82f6" });
  }
  return pts;
}

const EXPLANATIONS: Record<Scenario, { title: string; body: string }> = {
  nonlinear: {
    title: "Padrões Não-Lineares",
    body: "O PCA é um operador estritamente linear: projeta dados sobre combinações lineares das variáveis originais. Quando a estrutura subjacente é não-linear — curvas em U, espirais, arcos — o PCA ajusta componentes retilíneos que não capturam essa geometria. Neste exemplo, PC1 atravessa horizontalmente os dois braços da parábola, tratando a curvatura como ruído. Para dados com padrões não-lineares, métodos como t-SNE, UMAP ou Kernel PCA oferecem alternativas mais adequadas.",
  },
  nonorthogonal: {
    title: "Padrões Não-Ortogonais",
    body: "Por construção, todos os PCs são mutuamente não-correlacionados — geometricamente ortogonais. Quando os dados apresentam dois eixos de variação que não são perpendiculares entre si, o PCA não consegue representá-los independentemente. PC1 é posicionado entre os dois braços do V, e PC2 é forçado perpendicularmente a PC1, resultando em uma decomposição que não reflete a estrutura real dos dados — os dois caminhos divergentes.",
  },
  obscured: {
    title: "Clusters Obscurecidos pela Variância",
    body: "O PCA maximiza variância — não separa grupos. Quando a maior fonte de variância não coincide com o eixo de separação entre clusters, PC1 é alocado ao ruído de maior amplitude, e a estrutura de agrupamento biologicamente relevante é relegada a componentes de menor ordem. Neste exemplo, os dois grupos (vermelho e azul) diferem horizontalmente, mas o ruído vertical domina a variância total: PC1 captura o eixo vertical e os clusters ficam ocultos.",
  },
};

export function NatureMethodsPcaFig4() {
  const [activeScenario, setActiveScenario] = useState<Scenario>("nonlinear");

  const data = useMemo(() => generateData(activeScenario), [activeScenario]);

  const pcaResult = useMemo(() => {
    const xy = data.map(d => ({ x: d.x, y: d.y }));
    return computePCA2D(xy, false);
  }, [data]);

  const pcLines = useMemo(() => {
    const { centroid, eigenvectors, eigenvalues } = pcaResult;
    const [v1x, v1y] = eigenvectors[0];
    const [v2x, v2y] = eigenvectors[1];
    const s1 = 2 * Math.sqrt(Math.max(eigenvalues[0], 0.1));
    const s2 = 2 * Math.sqrt(Math.max(eigenvalues[1], 0.1));

    return {
      pc1: [
        { x: +(centroid.x - v1x * s1).toFixed(3), y: +(centroid.y - v1y * s1).toFixed(3) },
        { x: +(centroid.x + v1x * s1).toFixed(3), y: +(centroid.y + v1y * s1).toFixed(3) },
      ],
      pc2: [
        { x: +(centroid.x - v2x * s2).toFixed(3), y: +(centroid.y - v2y * s2).toFixed(3) },
        { x: +(centroid.x + v2x * s2).toFixed(3), y: +(centroid.y + v2y * s2).toFixed(3) },
      ],
    };
  }, [pcaResult]);

  const explanation = EXPLANATIONS[activeScenario];

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">As Três Limitações do PCA</h3>
          <p className="text-slate-500 text-sm mt-1">
            O PCA é linear, ortogonal e maximiza variância — três propriedades que podem ser limitações.
          </p>
        </div>
      </div>

      <div className="p-8 md:p-12">
        {/* Scenario Selector */}
        <div className="flex flex-col md:flex-row gap-4 mb-10">
          <button
            onClick={() => setActiveScenario("nonlinear")}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${activeScenario === "nonlinear" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-100 bg-white text-slate-500 hover:border-purple-200"}`}
          >
            <Spline className="w-8 h-8" />
            <span className="font-bold text-sm">Padrões Não-Lineares</span>
          </button>
          <button
            onClick={() => setActiveScenario("nonorthogonal")}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${activeScenario === "nonorthogonal" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-100 bg-white text-slate-500 hover:border-purple-200"}`}
          >
            <CircleSlash className="w-8 h-8" />
            <span className="font-bold text-sm">Não-Ortogonais</span>
          </button>
          <button
            onClick={() => setActiveScenario("obscured")}
            className={`flex-1 flex flex-col items-center justify-center gap-3 p-6 rounded-2xl border-2 transition-all ${activeScenario === "obscured" ? "border-purple-500 bg-purple-50 text-purple-700" : "border-slate-100 bg-white text-slate-500 hover:border-purple-200"}`}
          >
            <Inspect className="w-8 h-8" />
            <span className="font-bold text-sm">Clusters Ocultos</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          {/* Chart */}
          <div className="h-[400px] bg-slate-50 rounded-3xl p-6 border border-slate-100">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis type="number" dataKey="x" domain={[-50, 50]} hide />
                <YAxis type="number" dataKey="y" domain={[-50, 50]} hide />
                <ZAxis type="number" range={[80, 80]} />

                {/* PC1 line */}
                <Line
                  data={pcLines.pc1} type="linear" dataKey="y"
                  stroke="#ef4444" strokeWidth={3} strokeDasharray="6 3"
                  dot={false} isAnimationActive={false} name="PC1"
                />
                {/* PC2 line */}
                <Line
                  data={pcLines.pc2} type="linear" dataKey="y"
                  stroke="#f59e0b" strokeWidth={3} strokeDasharray="6 3"
                  dot={false} isAnimationActive={false} name="PC2"
                />

                {/* Data points */}
                <Scatter name="Dados" data={data} isAnimationActive={false}>
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Scatter>
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          {/* Explanation */}
          <div className="space-y-4">
            <h4 className="text-2xl font-headline font-bold text-slate-900">{explanation.title}</h4>
            <p className="text-slate-600 leading-relaxed">{explanation.body}</p>
            <div className="flex items-center gap-6 pt-4 text-xs font-medium">
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-red-500" style={{ height: 3, borderTop: '3px dashed #ef4444' }} />
                <span className="text-red-600">PC1</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-4 h-0.5 bg-amber-500" style={{ height: 3, borderTop: '3px dashed #f59e0b' }} />
                <span className="text-amber-600">PC2</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
