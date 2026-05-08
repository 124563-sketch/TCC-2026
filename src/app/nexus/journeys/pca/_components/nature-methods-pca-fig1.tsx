"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui-forge/ui/card";
import { Slider } from "@/ui-forge/ui/slider";
import { Target } from "lucide-react";
import { ComposedChart, Scatter, Line, XAxis, YAxis, CartesianGrid, ResponsiveContainer, ReferenceLine, ZAxis } from "recharts";
import { mulberry32, boxMuller, computePCA2D } from "@/lib/pca";

// 40 points from correlated bivariate normal via seeded PRNG
function generateData() {
  const rand = mulberry32(42);
  const pts: { x: number; y: number }[] = [];
  for (let i = 0; i < 40; i++) {
    const [z1, z2] = boxMuller(rand);
    const x = z1 * 14;
    const y = 0.85 * x + z2 * 7;
    pts.push({ x: +x.toFixed(3), y: +y.toFixed(3) });
  }
  return pts;
}

export function NatureMethodsPcaFig1() {
  const [angleDeg, setAngleDeg] = useState(0);
  const basePoints = useMemo(() => generateData(), []);

  const pcaResult = useMemo(() => computePCA2D(basePoints, false), [basePoints]);
  const pc1Angle = useMemo(() => {
    const [v1x, v1y] = pcaResult.eigenvectors[0];
    const angle = Math.atan2(v1y, v1x) * (180 / Math.PI);
    return angle < 0 ? angle + 180 : angle;
  }, [pcaResult]);

  const { projectedData, variance, lineEndpoints } = useMemo(() => {
    const angleRad = (angleDeg * Math.PI) / 180;
    const vX = Math.cos(angleRad);
    const vY = Math.sin(angleRad);

    let sumProj = 0;
    let sumProjSq = 0;
    const projData = basePoints.map(p => {
      const d = p.x * vX + p.y * vY;
      sumProj += d;
      sumProjSq += d * d;
      const projX = d * vX;
      const projY = d * vY;
      return { ...p, projX: +projX.toFixed(3), projY: +projY.toFixed(3), d: +d.toFixed(3) };
    });

    const n = basePoints.length;
    const meanP = sumProj / n;
    const vari = +((sumProjSq / n) - meanP * meanP).toFixed(1);

    // Line endpoints (long line through origin along projection direction)
    const scale = 80;
    const endpoints = [
      { x: -scale * vX, y: -scale * vY },
      { x: scale * vX, y: scale * vY },
    ];

    return { projectedData: projData, variance: vari, lineEndpoints: endpoints };
  }, [basePoints, angleDeg]);

  const isMaximized = Math.abs(angleDeg - pc1Angle) < 3;

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Geometria da Projeção e Variância</h3>
          <p className="text-slate-500 text-sm mt-1">
            O PC1 é o eixo que minimiza as distâncias perpendiculares — e maximiza a variância das projeções.
          </p>
        </div>
        <div className={`p-3 px-5 rounded-2xl flex items-center gap-3 transition-colors duration-500 ${isMaximized ? 'bg-emerald-100 text-emerald-700' : 'bg-white text-slate-700 shadow-sm border border-slate-200'}`}>
          <Target className={`w-5 h-5 ${isMaximized ? 'animate-pulse' : ''}`} />
          <span className="font-bold tabular-nums">Variância: {variance} σ²</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4">
        <div className="md:col-span-3 p-6 h-[420px] relative">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis type="number" dataKey="x" domain={[-60, 60]} hide />
              <YAxis type="number" dataKey="y" domain={[-60, 60]} hide />
              <ZAxis type="number" range={[100, 100]} />

              {/* Projection axis line */}
              <Line
                data={lineEndpoints}
                type="linear" dataKey="y" stroke="#64748b" strokeWidth={2}
                strokeDasharray="5 5" dot={false} isAnimationActive={false}
              />

              {/* Perpendicular dropout lines */}
              {projectedData.map((p, i) => (
                <ReferenceLine
                  key={`drop-${i}`}
                  segment={[{ x: p.x, y: p.y }, { x: p.projX, y: p.projY }]}
                  stroke="#94a3b8" strokeWidth={1} strokeOpacity={0.3}
                  strokeDasharray="2 3"
                />
              ))}

              {/* Projected points */}
              <Scatter
                name="Projeções (1D)" data={projectedData}
                dataKey="projX"
                fill="#3b82f6" shape="cross" isAnimationActive={false}
              />

              {/* Original points */}
              <Scatter
                name="Dados Originais (2D)" data={projectedData}
                fill="#ef4444" opacity={0.8} isAnimationActive={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        <div className="p-8 bg-slate-50 border-t md:border-t-0 md:border-l border-slate-100 flex flex-col justify-center gap-8">
          <div>
            <label className="text-sm font-bold text-slate-700 mb-2 block uppercase tracking-widest">Ângulo do Eixo</label>
            <div className="flex items-center gap-4">
              <Slider
                value={[angleDeg]}
                onValueChange={(v) => setAngleDeg(v[0])}
                min={0} max={180} step={1}
                className="flex-1"
              />
              <span className="font-mono text-sm w-8 tabular-nums">{angleDeg}°</span>
            </div>
          </div>

          <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
            <p>
              Os pontos vermelhos são dados bidimensionais correlacionados. O PCA projeta cada ponto <b>perpendicularmente</b> sobre um eixo (linhas cinzas tracejadas). As projeções aparecem em azul.
            </p>

            {!isMaximized ? (
              <p className="border-l-4 border-slate-300 pl-3 text-slate-500">
                Gire o eixo com o slider. O PC1 verdadeiro está a <b>{pc1Angle.toFixed(0)}°</b> — ângulo que maximiza σ² e minimiza as distâncias perpendiculares.
              </p>
            ) : (
              <p className="border-l-4 border-emerald-500 pl-3 font-bold text-emerald-800 bg-emerald-50 py-2 rounded-r-lg">
                Este é o PC1 (~{pc1Angle.toFixed(0)}°). Note que ele <b>não coincide</b> com a reta de regressão y~x — o PCA minimiza distâncias perpendiculares, não verticais.
              </p>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
