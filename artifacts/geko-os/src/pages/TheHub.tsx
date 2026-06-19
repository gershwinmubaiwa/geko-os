import React, { useState, useEffect } from "react";
import { Terminal } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const MOCK_LOGS = [
  "[INFO]  StyleDB sync complete — 847 items indexed",
  "[INFO]  Mannequin renderer initialized at 60fps",
  "[SUCCESS]  LinkedIn API handshake OK",
  "[INFO]  Value Optimizer module loaded",
  "[INFO]  PyCharm bridge active — watching /workspace",
  "[SUCCESS]  GEKO OS v1.0.0 boot sequence complete",
  "[INFO]  Loading biometric calibration module",
  "[BOOT]  System startup initiated",
];

const RANDOM_LOGS = [
  "[INFO]  Recalculating global light map...",
  "[WARN]  Slight latency on StyleDB ping (120ms)",
  "[INFO]  User 'Alex' session refreshed",
  "[DEBUG] Flushing cache memory...",
  "[SUCCESS] Market pricing data updated",
  "[INFO]  Render context active",
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
        const randomLog = RANDOM_LOGS[Math.floor(Math.random() * RANDOM_LOGS.length)];
        const timestamp = `[${new Date().toISOString().replace('T', ' ').substring(0, 19)}] `;
        const newLogs = [timestamp + randomLog, ...prev];
        return newLogs.slice(0, 20); // Keep last 20 logs
      });
    }, 8000);
    return () => clearInterval(logTimer);
  }, []);

  return (
    <div className="w-full h-full p-6 flex flex-col gap-6 overflow-hidden">
      {/* Top Status */}
      <div className="flex items-center justify-between border border-primary/20 bg-card/50 p-4 rounded-lg shadow-[0_0_15px_rgba(0,229,255,0.05)]">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_8px_#00ff00]" />
          <span className="font-mono text-sm text-[#00ff00] tracking-widest">SYSTEM OPERATIONAL</span>
        </div>
        <div className="font-mono text-sm text-primary">
          {time.toISOString().replace('T', ' ').substring(0, 19)}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-xs font-mono text-muted-foreground tracking-wider mb-2">RENDER ENGINE</div>
            <div className="text-2xl font-bold text-white font-mono mb-2">60 FPS</div>
            <div className="flex gap-1 h-4 items-end">
              {[4, 8, 6, 10, 7, 9, 8, 10].map((h, i) => (
                <div key={i} className="w-full bg-primary/60 rounded-t-sm" style={{ height: `${h * 10}%` }} />
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-xs font-mono text-muted-foreground tracking-wider mb-2">ACTIVE APIS</div>
            <div className="text-2xl font-bold text-white font-mono mb-2">3 CONNECTED</div>
            <div className="text-xs font-mono text-muted-foreground line-clamp-1">LinkedIn, PyCharm, StyleDB</div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-xs font-mono text-muted-foreground tracking-wider mb-2">PROCESSING LOAD</div>
            <div className="text-2xl font-bold text-white font-mono mb-2">12%</div>
            <div className="w-full h-1 bg-muted rounded-full overflow-hidden mt-3">
              <div className="h-full bg-primary w-[12%]" />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardContent className="p-4">
            <div className="text-xs font-mono text-muted-foreground tracking-wider mb-2">CACHE STATUS</div>
            <div className="text-2xl font-bold text-[#00ff00] font-mono mb-2 flex items-center gap-2">
              WARM
            </div>
            <div className="text-xs font-mono text-muted-foreground">Hit rate: 98.4%</div>
          </CardContent>
        </Card>
      </div>

      {/* Active API List */}
      <Card className="border-border bg-card/80 flex-none">
        <CardContent className="p-4">
          <div className="text-xs font-mono text-primary tracking-widest mb-4 border-b border-border/50 pb-2">ACTIVE CONNECTIONS</div>
          <div className="space-y-3 font-mono text-sm">
            <div className="flex items-center text-muted-foreground hover:text-white transition-colors">
              <span className="text-[#00ff00] mr-2">●</span>
              <span className="w-32">LinkedIn API</span>
              <span className="w-24 text-center">ACTIVE</span>
              <span className="text-primary text-xs ml-auto">latency: 42ms</span>
            </div>
            <div className="flex items-center text-muted-foreground hover:text-white transition-colors">
              <span className="text-[#00ff00] mr-2">●</span>
              <span className="w-32">PyCharm Bridge</span>
              <span className="w-24 text-center">ACTIVE</span>
              <span className="text-primary text-xs ml-auto">latency: 11ms</span>
            </div>
            <div className="flex items-center text-muted-foreground hover:text-white transition-colors">
              <span className="text-[#00ff00] mr-2">●</span>
              <span className="w-32">StyleDB API</span>
              <span className="w-24 text-center">ACTIVE</span>
              <span className="text-primary text-xs ml-auto">latency: 88ms</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* System Log */}
      <div className="flex-1 bg-black/50 border border-primary/20 rounded-lg p-4 font-mono text-xs overflow-y-auto shadow-[inset_0_0_20px_rgba(0,0,0,1)] relative">
        <div className="absolute top-0 left-0 w-full h-8 bg-gradient-to-b from-black/50 to-transparent pointer-events-none" />
        <div className="space-y-2 text-muted-foreground">
          {logs.map((log, idx) => {
            const isError = log.includes("[WARN]");
            const isSuccess = log.includes("[SUCCESS]");
            let colorClass = "text-muted-foreground";
            if (isError) colorClass = "text-yellow-500";
            if (isSuccess) colorClass = "text-[#00ff00]";
            if (log.includes("[INFO]")) colorClass = "text-primary";

            return (
              <div key={idx} className={`${colorClass} opacity-80 hover:opacity-100`}>
                {log}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
