"use client";

import { useState, useEffect, useCallback } from "react";

export type ModuleStatus = "not_started" | "in_progress" | "completed";

const STORAGE_KEY = "ml-ascent-progress";
const MODULE_IDS = ["linear-regression", "logistic-regression", "pca"] as const;

function readLocal(): Record<string, ModuleStatus> {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    const out: Record<string, ModuleStatus> = {};
    for (const id of MODULE_IDS) {
      const val = parsed[id];
      out[id] = val === "completed" || val === "in_progress" ? val : "not_started";
    }
    return out;
  } catch {
    return {};
  }
}

function writeLocal(progress: Record<string, ModuleStatus>) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch { /* quota exceeded */ }
}

async function persistToServer(moduleId: string, status: ModuleStatus) {
  try {
    await fetch("/api/progress", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ moduleId, status }),
    });
  } catch { /* offline — localStorage is the fallback */ }
}

export function useProgress() {
  const [progress, setProgress] = useState<Record<string, ModuleStatus>>({});

  useEffect(() => {
    const local = readLocal();
    setProgress(local);

    fetch("/api/progress")
      .then((r) => r.json())
      .then((server: Record<string, ModuleStatus>) => {
        setProgress((prev) => {
          const merged = { ...prev, ...server };
          writeLocal(merged);
          return merged;
        });
      })
      .catch(() => {});
  }, []);

  const markInProgress = useCallback((moduleId: string) => {
    setProgress((prev) => {
      if (prev[moduleId] === "completed") return prev;
      const next = { ...prev, [moduleId]: "in_progress" as ModuleStatus };
      writeLocal(next);
      persistToServer(moduleId, "in_progress");
      return next;
    });
  }, []);

  const markCompleted = useCallback((moduleId: string) => {
    setProgress((prev) => {
      const next = { ...prev, [moduleId]: "completed" as ModuleStatus };
      writeLocal(next);
      persistToServer(moduleId, "completed");
      return next;
    });
  }, []);

  const status = useCallback(
    (moduleId: string): ModuleStatus => progress[moduleId] || "not_started",
    [progress],
  );

  return { progress, markInProgress, markCompleted, status };
}
