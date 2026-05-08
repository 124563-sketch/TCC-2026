/**
 * PCA utilities for interactive educational components.
 * Based on: Lever, Krzywinski & Altman — "Principal Component Analysis",
 * Nature Methods 14, 641–642 (2017).
 */

// ── Seeded PRNG (mulberry32) ────────────────────────────────────────────────

export function mulberry32(seed: number): () => number {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// ── Box-Muller normal transform ──────────────────────────────────────────────

export function boxMuller(rand: () => number): [number, number] {
  const u1 = Math.max(rand(), 0.001);
  const u2 = rand();
  const r = Math.sqrt(-2 * Math.log(u1));
  const theta = 2 * Math.PI * u2;
  return [r * Math.cos(theta), r * Math.sin(theta)];
}

// ── Types ────────────────────────────────────────────────────────────────────

export interface PCA2DResult {
  eigenvalues: [number, number];
  eigenvectors: [[number, number], [number, number]];
  explainedVariance: [number, number];
  scores: Array<{ pc1: number; pc2: number; originalX: number; originalY: number }>;
  centroid: { x: number; y: number };
}

export interface PCAGeneralResult {
  eigenvalues: number[];
  eigenvectors: number[][];
  explainedVariance: number[];
  scores: number[][];
  means: number[];
}

// ── 2D Analytical PCA ────────────────────────────────────────────────────────

/**
 * Computes PCA on a 2D dataset using analytical eigendecomposition of the
 * 2×2 covariance matrix (characteristic polynomial).
 */
export function computePCA2D(
  data: { x: number; y: number }[],
  standardize: boolean,
): PCA2DResult {
  const n = data.length;
  const xs = data.map(d => d.x);
  const ys = data.map(d => d.y);
  const mx = xs.reduce((a, b) => a + b, 0) / n;
  const my = ys.reduce((a, b) => a + b, 0) / n;

  let stdX = 1;
  let stdY = 1;
  if (standardize) {
    stdX = Math.sqrt(xs.reduce((s, x) => s + (x - mx) ** 2, 0) / (n - 1)) || 1;
    stdY = Math.sqrt(ys.reduce((s, y) => s + (y - my) ** 2, 0) / (n - 1)) || 1;
  }

  const cx = xs.map(x => (x - mx) / stdX);
  const cy = ys.map(y => (y - my) / stdY);

  // 2×2 covariance matrix
  const cxx = cx.reduce((s, x) => s + x * x, 0) / (n - 1);
  const cyy = cy.reduce((s, y) => s + y * y, 0) / (n - 1);
  const cxy = cx.reduce((s, x, i) => s + x * cy[i], 0) / (n - 1);

  // Eigenvalues via characteristic polynomial: λ² − trace·λ + det = 0
  const trace = cxx + cyy;
  const det = cxx * cyy - cxy ** 2;
  const discriminant = Math.sqrt(Math.max(0, (trace / 2) ** 2 - det));
  const lambda1 = trace / 2 + discriminant;
  const lambda2 = trace / 2 - discriminant;

  // Eigenvector for λ1 from (Cov − λ1·I)v = 0 → v ∝ (λ1 − cyy, cxy)
  let v1x: number;
  let v1y: number;
  if (Math.abs(cxy) > 1e-10) {
    const norm = Math.sqrt((lambda1 - cyy) ** 2 + cxy ** 2);
    v1x = (lambda1 - cyy) / norm;
    v1y = cxy / norm;
  } else {
    v1x = cxx >= cyy ? 1 : 0;
    v1y = cxx >= cyy ? 0 : 1;
  }
  // PC2 is orthogonal to PC1 in 2D
  const v2x = -v1y;
  const v2y = v1x;

  const totalVariance = Math.max(lambda1 + lambda2, 1e-10);

  const scores = data.map((_, i) => ({
    pc1: +(+cx[i] * v1x + +cy[i] * v1y).toFixed(3),
    pc2: +(+cx[i] * v2x + +cy[i] * v2y).toFixed(3),
    originalX: data[i].x,
    originalY: data[i].y,
  }));

  return {
    eigenvalues: [lambda1, lambda2],
    eigenvectors: [[v1x, v1y], [v2x, v2y]],
    explainedVariance: [lambda1 / totalVariance, lambda2 / totalVariance],
    scores,
    centroid: { x: mx, y: my },
  };
}

// ── n-Dimensional PCA via Power Iteration ────────────────────────────────────

/**
 * Computes PCA on an n×p matrix (n observations, p variables) via power
 * iteration with deflation. Returns the top `nComponents` PCs.
 */
export function computePCAGeneral(
  matrix: number[][],
  nComponents: number,
): PCAGeneralResult {
  const n = matrix.length;
  const p = matrix[0].length;
  const means = Array(p).fill(0);

  // Center data
  for (let j = 0; j < p; j++) {
    means[j] = matrix.reduce((s, row) => s + row[j], 0) / n;
  }
  const centered = matrix.map(row => row.map((v, j) => v - means[j]));

  // Covariance matrix (p × p)
  const cov: number[][] = Array.from({ length: p }, () => Array(p).fill(0));
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      let s = 0;
      for (let k = 0; k < n; k++) s += centered[k][i] * centered[k][j];
      cov[i][j] = s / (n - 1);
    }
  }

  // Working copy for deflation
  const work: number[][] = cov.map(row => [...row]);

  const eigenvalues: number[] = [];
  const eigenvectors: number[][] = [];

  for (let comp = 0; comp < Math.min(nComponents, p); comp++) {
    const { eigenvalue, eigenvector } = powerIteration(work);
    eigenvalues.push(eigenvalue);
    eigenvectors.push([...eigenvector]);

    // Deflate: work = work − λ(v v^T)
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        work[i][j] -= eigenvalue * eigenvector[i] * eigenvector[j];
      }
    }
  }

  const totalVariance = Math.max(eigenvalues.reduce((a, b) => a + b, 0), 1e-10);

  // Scores: project centered data onto eigenvectors
  const scores = centered.map(row =>
    eigenvectors.map(v => +row.reduce((s, val, j) => s + val * v[j], 0).toFixed(3)),
  );

  return {
    eigenvalues,
    eigenvectors,
    explainedVariance: eigenvalues.map(v => v / totalVariance),
    scores,
    means,
  };
}

function powerIteration(
  mat: number[][],
  maxIter = 1000,
  tol = 1e-10,
): { eigenvalue: number; eigenvector: number[] } {
  const p = mat.length;
  let v = Array.from({ length: p }, () => Math.random());

  let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  if (norm < 1e-12) v[0] = 1;
  norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  v = v.map(x => x / norm);

  for (let iter = 0; iter < maxIter; iter++) {
    const vNext = Array(p).fill(0);
    for (let i = 0; i < p; i++) {
      for (let j = 0; j < p; j++) {
        vNext[i] += mat[i][j] * v[j];
      }
    }
    const normNext = Math.sqrt(vNext.reduce((s, x) => s + x * x, 0));
    if (normNext < 1e-12) break;
    vNext.forEach((_, i) => (vNext[i] /= normNext));

    let dot = 0;
    for (let i = 0; i < p; i++) dot += v[i] * vNext[i];
    if (Math.abs(dot) > 1 - tol) {
      v = vNext;
      break;
    }
    v = vNext;
  }

  // Rayleigh quotient
  let eigenvalue = 0;
  for (let i = 0; i < p; i++) {
    for (let j = 0; j < p; j++) {
      eigenvalue += v[i] * mat[i][j] * v[j];
    }
  }

  return { eigenvalue, eigenvector: v };
}

// ── Reconstruction ───────────────────────────────────────────────────────────

export function reconstructFromPCs(
  scores: number[][],
  eigenvectors: number[][],
  means: number[],
  nComponents: number,
): number[][] {
  const p = means.length;
  const k = Math.min(nComponents, eigenvectors.length);

  return scores.map(scoreRow => {
    const rec = [...means];
    for (let j = 0; j < p; j++) {
      for (let c = 0; c < k; c++) {
        rec[j] += scoreRow[c] * eigenvectors[c][j];
      }
    }
    return rec.map(v => +v.toFixed(3));
  });
}
