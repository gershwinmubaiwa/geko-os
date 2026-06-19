import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_LOGS = [
  "[2026-06-19 09:14:22] INFO  StyleDB sync complete — 847 items indexed",
  "[2026-06-19 09:14:18] INFO  Mannequin renderer initialized at 60fps",
  "[2026-06-19 09:14:15] SUCCESS  LinkedIn API handshake OK",
  "[2026-06-19 09:14:10] INFO  Value Optimizer module loaded",
  "[2026-06-19 09:14:08] INFO  PyCharm bridge active — watching /workspace",
  "[2026-06-19 09:14:05] SUCCESS  Trueform v1.0.0 boot sequence complete",
  "[2026-06-19 09:14:03] INFO  Loading biometric calibration module",
  "[2026-06-19 09:14:00] BOOT  System startup initiated",
];

const RANDOM_LOGS = [
  "INFO  Recalculating global style map...",
  "WARN  Slight latency on StyleDB ping (120ms)",
  "INFO  User session refreshed",
  "DEBUG Flushing cache memory...",
  "SUCCESS Market pricing data updated",
  "INFO  Render context active — 60fps sustained",
  "INFO  Brand catalog index refreshed — 6 items",
  "SUCCESS AI Stylist module heartbeat OK",
];

export function TheHub() {
  const [time, setTime] = useState(new Date());
  const [logs, setLogs] = useState<string[]>(MOCK_LOGS);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const logTimer = setInterval(() => {
      setLogs((prev) => {
        const entry = RANDOM_LOGS[Math.floor(Math.random() * RANDOM_LOGS.length)];
        const timestamp = `[${new Date().toISOString().replace("T", " ").substring(0, 19)}]`;
        return [`${timestamp} ${entry}`, ...prev].slice(0, 24);
      });
    }, 8000);
    return () => clearInterval(logTimer);
  }, []);

  return (
    <div className="w-full h-full p-6 flex flex-col gap-5 overflow-hidden">

      {/* Top status bar */}
      <div className="flex items-center justify-between border border-primary/20 bg-card/50 p-4 rounded-xl shadow-[0_0_15px_rgba(139,92,246,0.06)] flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_8px_#00ff00]" />
          <span className="font-mono text-sm text-[#00ff00] tracking-widest">SYSTEM OPERATIONAL</span>
        </div>
        <div className="font-mono text-sm text-primary tracking-wider">
          {time.toISOString().replace("T", " ").substring(0, 19)} UTC
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 flex-shrink-0">
        <Card className="border-border bg-card hover:border-primary/30 transition-colors duration-300">
          <CardContent className="p-4">
            <div className="text-[10px] font-mono text-muted-foreground tracking-wider mb-2">RENDER ENGINE</div>
            <div className="text-2xl font-bold text-white font-mono mb-2">60 FPS</div>
            <div className="flex gap-1 h-5 items-end">
              {[4, 8, 6, 10, 7, 9, 8, 10, 9, 10].map((h, i) => (
                <div
                  key={i}
                  className="flex-1 rounded-t-sm"
                  style={{
                    height: `${h * 10}%`,
                    background: "linear-gradient(to top, hsl(264,89%,67%), hsl(186,100%,50%))",
                    opacity: 0.7 + i * 0.03,
                  }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:border-primary/30 transition-colors duration-300">
          <CardContent className="p-4">
            <div className="text-[10px] font-mono text-muted-foreground tracking-wider mb-2">ACTIVE APIS</div>
            <div className="text-2xl font-bold text-white font-mono mb-2">3 CONNECTED</div>
            <div className="text-[10px] font-mono text-muted-foreground">LinkedIn · PyCharm · StyleDB</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:border-primary/30 transition-colors duration-300">
          <CardContent className="p-4">
            <div className="text-[10px] font-mono text-muted-foreground tracking-wider mb-2">PROCESSING LOAD</div>
            <div className="text-2xl font-bold text-white font-mono mb-3">12%</div>
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: "12%",
                  background: "linear-gradient(90deg, hsl(264,89%,67%), hsl(186,100%,50%))",
                  boxShadow: "0 0 6px rgba(139,92,246,0.5)",
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card hover:border-primary/30 transition-colors duration-300">
          <CardContent className="p-4">
            <div className="text-[10px] font-mono text-muted-foreground tracking-wider mb-2">CACHE STATUS</div>
            <div className="text-2xl font-bold text-[#00ff00] font-mono mb-2">WARM</div>
            <div className="text-[10px] font-mono text-muted-foreground">Hit rate: 98.4%</div>
          </CardContent>
        </Card>
      </div>

      {/* Active connections */}
      <Card className="border-border bg-card/80 flex-shrink-0">
        <CardContent className="p-4">
          <div className="text-[10px] font-mono text-primary tracking-widest mb-4 border-b border-border/50 pb-2">
            ACTIVE CONNECTIONS
          </div>
          <div className="space-y-3 font-mono text-sm">
            {[
              { name: "LinkedIn API", latency: "42ms" },
              { name: "PyCharm Bridge", latency: "11ms" },
              { name: "StyleDB API", latency: "88ms" },
            ].map(({ name, latency }) => (
              <div key={name} className="flex items-center text-muted-foreground hover:text-white transition-colors group">
                <span className="text-[#00ff00] mr-3 group-hover:drop-shadow-[0_0_4px_#00ff00] transition-all">●</span>
                <span className="w-36 text-white/80">{name}</span>
                <span className="w-24 text-center text-[10px] tracking-wider">ACTIVE</span>
                <span className="text-primary text-xs ml-auto">{latency}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* System log console */}
      <div className="flex-1 min-h-0 flex flex-col rounded-xl border border-primary/15 overflow-hidden">
        <div className="flex items-center gap-2 px-4 py-2 bg-card border-b border-border/50 flex-shrink-0">
          <Terminal className="w-3.5 h-3.5 text-primary" />
          <span className="font-mono text-[10px] text-primary tracking-widest">SYSTEM LOG</span>
          <div className="ml-auto flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff00]/60" />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto bg-black/60 p-4 font-mono text-xs space-y-1.5">
          {logs.map((log, idx) => {
            let colorClass = "text-muted-foreground";
            if (log.includes("WARN")) colorClass = "text-yellow-400";
            else if (log.includes("SUCCESS")) colorClass = "text-[#00ff00]";
            else if (log.includes("INFO")) colorClass = "text-cyan-400";
            else if (log.includes("BOOT")) colorClass = "text-primary";
            else if (log.includes("DEBUG")) colorClass = "text-purple-400";
            return (
              <div key={idx} className={`${colorClass} opacity-85 hover:opacity-100 transition-opacity leading-relaxed`}>
                {log}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
