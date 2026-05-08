"use client";

import { useEffect, useState, useRef } from "react";

export function SessionTimer() {
  const [sessionTime, setSessionTime] = useState(0);
  const elapsedRef = useRef(0);

  useEffect(() => {
    let startStr = sessionStorage.getItem("ml_ascent_session_start");
    let start = startStr ? parseInt(startStr, 10) : Date.now();

    if (!startStr) {
      sessionStorage.setItem("ml_ascent_session_start", start.toString());
    }

    const tick = () => {
      const elapsed = Math.floor((Date.now() - start) / 1000);
      elapsedRef.current = elapsed;
      setSessionTime(elapsed);
    };

    tick();
    const interval = setInterval(tick, 1000);

    // Persist elapsed time on unmount (navigation, signout)
    const persist = () => {
      if (elapsedRef.current < 5) return; // skip trivial sessions
      const blob = new Blob(
        [JSON.stringify({ seconds: elapsedRef.current })],
        { type: "application/json" },
      );
      navigator.sendBeacon("/api/session", blob);
    };

    window.addEventListener("beforeunload", persist);

    return () => {
      clearInterval(interval);
      window.removeEventListener("beforeunload", persist);
      persist();
    };
  }, []);

  const hours = Math.floor(sessionTime / 3600);
  const minutes = Math.floor((sessionTime % 3600) / 60);

  return (
    <div className="hidden lg:flex items-center gap-2 px-4 py-1.5 bg-slate-50 rounded-full border border-slate-200 shadow-sm">
      <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse outline outline-2 outline-emerald-500/20" />
      <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest tabular-nums">
        Sessão Ativa: {hours.toString().padStart(2, '0')}h {minutes.toString().padStart(2, '0')}m
      </span>
    </div>
  );
}
