"use client";

import { useState, useMemo } from "react";
import { Card } from "@/ui-forge/ui/card";
import { Layers, TrendingDown } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Cell } from "recharts";
import { mulberry32, computePCAGeneral, reconstructFromPCs } from "@/lib/pca";

const PATIENT_LABELS = ["A", "B", "C", "D", "E", "F"];
const GENE_LABELS = ["G1", "G2", "G3", "G4", "G5", "G6"];
const GENE_FILLS = ["#8b5cf6", "#7c3aed", "#a78bfa", "#c084fc", "#d8b4fe", "#ede9fe"];
const PC_OPTIONS = [1, 2, 3, 6];

// ── Generate 6 patients × 6 genes matrix with 2 latent factors ──────────────

function generateMatrix() {
  const rand = mulberry32(12345);

  // 6 patients × 2 latent factor scores
  const F = [
    [8, 5],
    [3, -7],
    [6, 2],
    [-5, -3],
    [2, 8],
    [-7, 6],
  ];

  // 6 genes × 2 latent factor loadings
  const L = [
    [1.0, 0.3],
    [0.9, 0.5],
    [1.1, -0.2],
    [0.7, 1.0],
    [0.5, 1.2],
    [0.6, -0.8],
  ];

  const matrix: number[][] = [];
  for (let i = 0; i < 6; i++) {
    const row: number[] = [];
    for (let j = 0; j < 6; j++) {
      let val = 0;
      for (let k = 0; k < 2; k++) {
        val += F[i][k] * L[j][k];
      }
      val += (rand() - 0.5) * 1.5;
      row.push(+val.toFixed(3));
    }
    matrix.push(row);
  }
  return matrix;
}

// ── Component ────────────────────────────────────────────────────────────────

export function NatureMethodsPcaFig2() {
  const [numPcs, setNumPcs] = useState(2);

  const matrix = useMemo(() => generateMatrix(), []);

  const pcaResult = useMemo(() => computePCAGeneral(matrix, 6), [matrix]);

  const reconstructed = useMemo(
    () => reconstructFromPCs(pcaResult.scores, pcaResult.eigenvectors, pcaResult.means, numPcs),
    [pcaResult, numPcs],
  );

  const totalVariance = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < numPcs; i++) sum += pcaResult.explainedVariance[i];
    return +(sum * 100).toFixed(1);
  }, [pcaResult, numPcs]);

  // Per-patient RMS error
  const errors = useMemo(() => {
    return matrix.map((row, i) => {
      const rec = reconstructed[i];
      let ss = 0;
      for (let j = 0; j < row.length; j++) ss += (row[j] - rec[j]) ** 2;
      return +Math.sqrt(ss / row.length).toFixed(3);
    });
  }, [matrix, reconstructed]);

  // Global min/max for bar scaling (shift so no negative bars)
  const { barMin, barMax } = useMemo(() => {
    let mn = Infinity;
    let mx = -Infinity;
    for (const row of matrix) for (const v of row) { mn = Math.min(mn, v); mx = Math.max(mx, v); }
    return { barMin: mn, barMax: mx };
  }, [matrix]);

  const shift = barMin < 0 ? -barMin + 1 : 0;
  const barRange = (barMax + shift) || 1;

  const normalize = (v: number) => +(((v + shift) / barRange) * 100).toFixed(1);

  // Scree plot data
  const screeData = useMemo(
    () =>
      pcaResult.explainedVariance.map((v, i) => ({
        pc: `PC${i + 1}`,
        variance: +(v * 100).toFixed(1),
        isActive: i < numPcs,
      })),
    [pcaResult, numPcs],
  );

  const isExact = numPcs >= 6;

  return (
    <Card className="rounded-[2.5rem] border-slate-100 shadow-xl overflow-hidden bg-white mt-12 mb-12">
      {/* Header */}
      <div className="p-8 bg-slate-50 border-b border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h3 className="font-headline font-bold text-2xl text-slate-900">Compressão Dimensional</h3>
          <p className="text-slate-500 text-sm mt-1">
            Reconstruindo 6 perfis de expressão gênica com um número reduzido de PCs.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className={`p-3 px-5 rounded-2xl flex items-center gap-3 transition-all ${isExact ? 'bg-emerald-100 text-emerald-700' : 'bg-purple-100 text-purple-700'}`}>
            <Layers className="w-5 h-5" />
            <span className="font-bold tabular-nums">Variância: {totalVariance}%</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4">
        {/* Sidebar: PC selector + Scree + Errors */}
        <div className="p-6 lg:p-8 bg-slate-50 border-t lg:border-t-0 lg:border-r border-slate-100 flex flex-col gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Componentes</p>
            <div className="flex gap-2">
              {PC_OPTIONS.map((n) => (
                <button
                  key={n}
                  onClick={() => setNumPcs(n)}
                  className={`w-14 h-14 rounded-2xl font-headline font-bold text-lg transition-all ${
                    numPcs === n
                      ? 'bg-purple-600 text-white shadow-lg scale-105'
                      : 'bg-white text-slate-400 border border-slate-200 hover:border-purple-200 hover:text-purple-500'
                  }`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          {/* Scree plot */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Variância Explicada</p>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={screeData} margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="pc" tick={{ fill: '#94a3b8', fontSize: 11 }} axisLine={false} tickLine={false} />
                  <YAxis unit="%" tick={{ fill: '#94a3b8', fontSize: 10 }} axisLine={false} tickLine={false} width={35} />
                  <Bar dataKey="variance" radius={[4, 4, 0, 0]} maxBarSize={28}>
                    {screeData.map((entry, i) => (
                      <Cell key={i} fill={entry.isActive ? '#8b5cf6' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* RMS error table */}
          <div className="bg-white rounded-2xl border border-slate-100 p-4">
            <div className="flex items-center gap-2 mb-3">
              <TrendingDown className="w-4 h-4 text-slate-400" />
              <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Erro RMS por Amostra</p>
            </div>
            <div className="space-y-1.5">
              {PATIENT_LABELS.map((label, i) => (
                <div key={label} className="flex justify-between items-center text-xs">
                  <span className="font-bold text-slate-600">Amostra {label}</span>
                  <span className={`font-mono tabular-nums ${isExact ? 'text-emerald-600' : 'text-slate-500'}`}>
                    {errors[i]}
                  </span>
                </div>
              ))}
              <div className="border-t border-slate-100 pt-1.5 mt-1.5 flex justify-between items-center text-xs">
                <span className="font-bold text-slate-700">Média</span>
                <span className="font-mono tabular-nums text-slate-700 font-bold">
                  {+(errors.reduce((a, b) => a + +b, 0) / errors.length).toFixed(3)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Patient bar charts */}
        <div className="lg:col-span-3 p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
            {PATIENT_LABELS.map((label, patientIdx) => {
              const original = matrix[patientIdx];
              const recon = reconstructed[patientIdx];
              const error = +errors[patientIdx];

              return (
                <div key={label} className="bg-white rounded-2xl border border-slate-100 p-4 shadow-sm">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="font-headline font-bold text-slate-800 text-sm">Amostra {label}</h4>
                    <span className={`text-[10px] font-bold tabular-nums px-2 py-0.5 rounded-full ${isExact ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                      RMS {error}
                    </span>
                  </div>

                  {/* Bar pairs: original (outline) + reconstructed (filled) */}
                  <div className="space-y-2.5">
                    {GENE_LABELS.map((gene, geneIdx) => {
                      const origH = normalize(original[geneIdx]);
                      const reconH = normalize(recon[geneIdx]);
                      const delta = Math.abs(origH - reconH);

                      return (
                        <div key={gene} className="flex items-center gap-2">
                          <span className="w-6 text-[10px] font-bold text-slate-400 text-right">{gene}</span>
                          <div className="flex-1 h-5 bg-slate-100 rounded-md relative overflow-hidden">
                            {/* Original bar (outline reference) */}
                            <div
                              className="absolute inset-0 border-2 border-slate-300 rounded-md bg-white"
                              style={{ width: `${origH}%`, borderStyle: 'dashed' }}
                            />
                            {/* Reconstructed bar (filled) */}
                            <div
                              className={`absolute inset-0 rounded-md transition-all duration-500 ${isExact ? 'bg-emerald-400' : 'bg-purple-500 opacity-80'}`}
                              style={{ width: `${reconH}%` }}
                            />
                          </div>
                          {/* Error indicator */}
                          {delta > 2 && !isExact && (
                            <span className="w-5 text-[9px] font-mono text-rose-500 tabular-nums text-right">
                              {delta > 20 ? '!' : '·'}
                            </span>
                          )}
                          {isExact && (
                            <span className="w-5 text-[9px] text-emerald-500 text-right">✓</span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Caption */}
          <div className="mt-6 text-xs text-slate-500 text-center leading-relaxed">
            {numPcs === 1 && (
              <span>
                Com <b className="text-purple-600">1 PC</b>, apenas a tendência geral de expressão é capturada — os
                perfis individuais são colapsados em uma única dimensão de variação.
              </span>
            )}
            {numPcs === 2 && (
              <span>
                Com <b className="text-purple-600">2 PCs</b>, os dois fatores latentes (nível de expressão e contraste
                tecidual) são recuperados. O erro RMS cai drasticamente — a compressão é eficaz.
              </span>
            )}
            {numPcs === 3 && (
              <span>
                Com <b className="text-purple-600">3 PCs</b>, o ruído residual é parcialmente modelado, mas o ganho é
                marginal — PC3 explica pouca variância adicional.
              </span>
            )}
            {numPcs >= 6 && (
              <span>
                Com <b className="text-emerald-600">6 PCs</b>, a reconstrução é exata (erro zero). Mas não houve
                compressão — os dados foram apenas reexpressos em outra base.
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
