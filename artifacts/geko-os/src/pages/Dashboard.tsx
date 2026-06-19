import React, { useMemo } from "react";
import { MannequinCanvas, MannequinData } from "@/components/MannequinCanvas";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { closetItems, ClosetItem } from "@/data/closetData";
import {
  AlertTriangle, TrendingUp, DollarSign, BarChart3, Percent,
  ShieldCheck, ShieldAlert,
} from "lucide-react";

interface DashboardProps {
  mannequinData: MannequinData;
  setMannequinData: React.Dispatch<React.SetStateAction<MannequinData>>;
  onSelectItem: (item: ClosetItem) => void;
  selectedItemId: string | null;
  highlightedBrands: string[];
}

type RiskLevel = "Low" | "Medium" | "High";
interface SizeRec { size: string; risk: RiskLevel; note: string; }

const RETENTION_RATES: Record<string, number> = {
  nike: 0.45, adidas: 0.45, zara: 0.30, shein: 0,
};

function getRetentionRate(brand: string): number {
  return RETENTION_RATES[brand.toLowerCase()] ?? 0.20;
}

function getSizeRec(item: ClosetItem, bio: MannequinData): SizeRec {
  const brand = item.brand.toLowerCase();
  const { chest, shoulders, waist } = bio;
  if (brand === "nike" || brand === "adidas") {
    if (chest > 95 || shoulders > 45) return { size: "L", risk: "Low", note: "" };
    if (chest >= 85 && chest <= 95) return { size: "M", risk: "Low", note: "" };
    return { size: "S", risk: "Low", note: "" };
  }
  if (brand === "zara") {
    if (waist > 82) return { size: "L", risk: "Medium", note: "Runs Tailored" };
    return { size: "M", risk: "Medium", note: "Runs Tailored" };
  }
  if (brand === "shein") {
    if (chest > 90) return { size: "XL", risk: "High", note: "Size up" };
    return { size: "L", risk: "High", note: "" };
  }
  return { size: "M", risk: "Low", note: "" };
}

const RISK_STYLES: Record<RiskLevel, string> = {
  Low: "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
  Medium: "bg-yellow-500/15 text-yellow-400 border-yellow-500/30",
  High: "bg-red-500/15 text-red-400 border-red-500/30",
};

function AnimatedBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, pct)}%`, background: color, boxShadow: `0 0 6px ${color}55` }}
      />
    </div>
  );
}

export function Dashboard({ mannequinData, setMannequinData, onSelectItem, selectedItemId, highlightedBrands }: DashboardProps) {

  const analytics = useMemo(() => {
    const totalValue = closetItems.reduce((s, i) => s + i.price, 0);
    const equity = closetItems.reduce((s, i) => s + i.price * getRetentionRate(i.brand), 0);

    const avgCPW = totalValue / (closetItems.length * 50);
    const cpwScore = Math.max(0, Math.min(100, (1 - avgCPW / 5) * 100));
    const retentionScore = (equity / totalValue) * 100;
    const baseROI = Math.round(cpwScore * 0.6 + retentionScore * 0.4);

    const selectedItem = selectedItemId ? closetItems.find(i => i.id === selectedItemId) : null;
    const fitRisk = selectedItem ? getSizeRec(selectedItem, mannequinData).risk === "High" : false;
    const roi = fitRisk ? Math.max(0, baseROI - 20) : baseROI;

    return { totalValue, equity, baseROI, roi, fitRisk, avgCPW, retentionScore };
  }, [mannequinData, selectedItemId]);

  const roiGrade = analytics.roi >= 75 ? { label: "EXCELLENT", color: "#10b981" }
    : analytics.roi >= 55 ? { label: "GOOD", color: "#8b5cf6" }
    : analytics.roi >= 35 ? { label: "FAIR", color: "#f59e0b" }
    : { label: "POOR", color: "#ef4444" };

  const handleSlider = (key: keyof MannequinData, value: number) => {
    setMannequinData(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto">
      {/* ── TOP 3-COLUMN SECTION ── */}
      <div className="flex w-full gap-4 p-5 pb-0" style={{ minHeight: "min(68vh, 480px)" }}>

        {/* 3D Viewport */}
        <div className="w-[40%] relative rounded-xl shadow-[0_0_40px_rgba(139,92,246,0.06)] flex-shrink-0">
          <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-card/80 backdrop-blur border border-primary/30 rounded-md shadow-sm">
            <span className="text-xs font-mono text-primary tracking-widest">3D VIEWPORT</span>
          </div>
          <MannequinCanvas data={mannequinData} />
        </div>

        {/* Brand Catalog */}
        <div className="flex-1 flex flex-col gap-3 overflow-hidden min-w-0">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white flex items-center gap-2 flex-shrink-0">
            BRAND CATALOG
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </h2>

          <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pr-1 content-start">
            {closetItems.map((item) => {
              const isSelected = selectedItemId === item.id;
              const isHighlighted = highlightedBrands.length > 0 && highlightedBrands.map(b => b.toLowerCase()).includes(item.brand.toLowerCase());
              const isDimmed = highlightedBrands.length > 0 && !isHighlighted;
              const rec = getSizeRec(item, mannequinData);

              return (
                <button
                  key={item.id}
                  data-testid={`catalog-item-${item.id}`}
                  onClick={() => onSelectItem(item)}
                  className={`btn-liquid relative group text-left rounded-xl border overflow-hidden transition-all duration-300 flex flex-col
                    ${isSelected
                      ? "border-primary shadow-[0_0_20px_rgba(139,92,246,0.35)] bg-primary/10"
                      : isHighlighted
                        ? "border-cyan-400/60 shadow-[0_0_18px_rgba(0,229,255,0.3)] bg-cyan-400/5"
                        : isDimmed
                          ? "border-border bg-card opacity-40"
                          : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
                    }`}
                >
                  <div className="w-full aspect-square overflow-hidden bg-muted relative">
                    <img
                      src={item.image} alt={item.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                    {isSelected && <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_rgba(139,92,246,0.9)]" />}
                    {isHighlighted && (
                      <div className="absolute top-2 left-2 px-1.5 py-0.5 rounded bg-cyan-400/20 border border-cyan-400/40 text-[8px] font-mono text-cyan-400 tracking-widest">MATCH</div>
                    )}
                  </div>
                  <div className="p-2.5 flex flex-col gap-1.5">
                    <div className="text-[9px] font-mono text-muted-foreground tracking-widest">{item.brand.toUpperCase()}</div>
                    <div className="text-xs font-bold text-white leading-tight truncate">{item.name}</div>
                    <div className="font-mono text-[11px]" style={{ color: item.accentColor }}>${item.price}</div>
                    <div className="flex items-center gap-1 flex-wrap mt-0.5">
                      <span className="text-[9px] font-mono text-muted-foreground">Size {rec.size}</span>
                      <span className={`text-[8px] font-mono px-1.5 py-0.5 rounded-full border ${RISK_STYLES[rec.risk]}`}>
                        {rec.risk} Risk{rec.note ? ` · ${rec.note}` : ""}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Biometrics */}
        <div className="w-[27%] flex flex-col gap-4 overflow-hidden flex-shrink-0">
          <h2 className="text-sm font-bold tracking-[0.2em] text-white flex items-center gap-2 flex-shrink-0">
            BIOMETRICS
            <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
          </h2>
          <Card className="border-primary/20 bg-card/50 backdrop-blur flex-1 overflow-hidden">
            <CardContent className="p-5 flex flex-col gap-5 h-full overflow-y-auto">
              {([
                { key: "height" as const, label: "HEIGHT", min: 150, max: 210, unit: "cm" },
                { key: "shoulders" as const, label: "SHOULDERS", min: 30, max: 60, unit: "cm" },
                { key: "chest" as const, label: "CHEST", min: 70, max: 120, unit: "cm" },
                { key: "arms" as const, label: "ARMS", min: 50, max: 80, unit: "cm" },
                { key: "waist" as const, label: "WAIST", min: 60, max: 110, unit: "cm" },
              ] as const).map(({ key, label, min, max, unit }) => (
                <div key={key} className="flex flex-col gap-2.5">
                  <div className="flex justify-between items-center">
                    <Label className="text-muted-foreground font-mono text-[10px] tracking-widest">{label}</Label>
                    <span className="text-primary font-mono text-xs">{mannequinData[key]} {unit}</span>
                  </div>
                  <Slider
                    value={[mannequinData[key] as number]}
                    min={min} max={max} step={1}
                    onValueChange={val => handleSlider(key, val[0])}
                    className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                  />
                </div>
              ))}
            </CardContent>
          </Card>
          <Card className="border-border bg-card/30 flex-shrink-0">
            <CardContent className="p-3 flex flex-wrap gap-x-3 gap-y-1">
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest w-full mb-1">BODY DATA</span>
              {(["height", "shoulders", "chest", "arms", "waist"] as const).map(k => (
                <span key={k} className="font-mono text-[10px] text-foreground/70">{k[0].toUpperCase()}:{mannequinData[k]}</span>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── CLOSET CAPITAL ANALYTICS ── */}
      <div className="px-5 py-5">
        {/* Section header */}
        <div className="flex items-center gap-3 mb-4">
          <div className="w-8 h-8 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-primary" />
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-[0.2em] text-white">TRUEFORM CLOSET CAPITAL ANALYTICS</h2>
            <p className="text-[10px] font-mono text-muted-foreground tracking-wider mt-0.5">Live financial intelligence · 6-item portfolio</p>
          </div>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/30 to-transparent" />
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-card border border-border">
            <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse" />
            <span className="font-mono text-[9px] text-muted-foreground tracking-widest">LIVE</span>
          </div>
        </div>

        {/* Fit-risk warning */}
        {analytics.fitRisk && (
          <div className="mb-4 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/8">
            <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <span className="font-mono text-[10px] text-red-400 font-bold tracking-wider block">ASSET RISK DETECTED</span>
              <span className="text-xs text-red-300/80 mt-0.5 block">Inaccurate fit increases liquidation/return probability. Portfolio ROI Score penalized −20 pts.</span>
            </div>
          </div>
        )}

        {/* 3 metric cards */}
        <div className="grid grid-cols-3 gap-4 mb-4">

          {/* Card 1 — Total Asset Value */}
          <div className="relative rounded-xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(0,229,255,0.04),_transparent_60%)] pointer-events-none" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">TOTAL WARDROBE ASSET VALUE</p>
                  <p className="text-3xl font-mono font-bold text-white">${analytics.totalValue.toLocaleString()}</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-cyan-400/10 border border-cyan-400/25 flex items-center justify-center flex-shrink-0">
                  <DollarSign className="w-4 h-4 text-cyan-400" />
                </div>
              </div>

              <div className="space-y-2">
                {[
                  { label: "Nike", value: closetItems.filter(i => i.brand === "Nike").reduce((s, i) => s + i.price, 0), total: analytics.totalValue, color: "#00e5ff" },
                  { label: "Adidas", value: closetItems.filter(i => i.brand === "Adidas").reduce((s, i) => s + i.price, 0), total: analytics.totalValue, color: "#8b5cf6" },
                  { label: "Zara", value: closetItems.filter(i => i.brand === "Zara").reduce((s, i) => s + i.price, 0), total: analytics.totalValue, color: "#a78bfa" },
                  { label: "Shein", value: closetItems.filter(i => i.brand === "Shein").reduce((s, i) => s + i.price, 0), total: analytics.totalValue, color: "#34d399" },
                ].map(({ label, value, total, color }) => (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
                      <span className="text-[9px] font-mono text-foreground/70">${value}</span>
                    </div>
                    <AnimatedBar pct={(value / total) * 100} color={color} />
                  </div>
                ))}
              </div>
              <p className="text-[9px] font-mono text-muted-foreground mt-3 pt-3 border-t border-border/50">Avg. item price: ${(analytics.totalValue / closetItems.length).toFixed(0)}</p>
            </div>
          </div>

          {/* Card 2 — Wardrobe Equity */}
          <div className="relative rounded-xl border border-border bg-card overflow-hidden group hover:border-primary/30 transition-all duration-300">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(139,92,246,0.05),_transparent_60%)] pointer-events-none" />
            <div className="p-5">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">WARDROBE EQUITY · NET RETAINED</p>
                  <p className="text-3xl font-mono font-bold text-white">${analytics.equity.toFixed(0)}</p>
                  <p className="text-[10px] font-mono text-muted-foreground mt-0.5">after 12-month depreciation</p>
                </div>
                <div className="w-9 h-9 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center flex-shrink-0">
                  <TrendingUp className="w-4 h-4 text-primary" />
                </div>
              </div>

              <div className="space-y-2.5 mb-4">
                {[
                  { label: "Nike (45% retention)", brand: "Nike", rate: 0.45, color: "#00e5ff" },
                  { label: "Adidas (45% retention)", brand: "Adidas", rate: 0.45, color: "#8b5cf6" },
                  { label: "Zara (30% retention)", brand: "Zara", rate: 0.30, color: "#a78bfa" },
                  { label: "Shein (0% · full depreciation)", brand: "Shein", rate: 0, color: "#ef4444" },
                ].map(({ label, brand, rate, color }) => {
                  const itemVal = closetItems.filter(i => i.brand === brand).reduce((s, i) => s + i.price, 0);
                  return (
                    <div key={brand} className="flex items-center gap-2.5">
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                      <span className="text-[9px] font-mono text-muted-foreground flex-1 truncate">{label}</span>
                      <span className="text-[9px] font-mono font-bold" style={{ color }}>
                        ${(itemVal * rate).toFixed(0)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-border/50">
                <div className="flex justify-between mb-1.5">
                  <span className="text-[9px] font-mono text-muted-foreground">Retained value</span>
                  <span className="text-[9px] font-mono text-primary">{analytics.retentionScore.toFixed(1)}%</span>
                </div>
                <AnimatedBar pct={analytics.retentionScore} color="#8b5cf6" />
                <p className="text-[9px] font-mono text-muted-foreground mt-2">
                  Depreciation loss: <span className="text-red-400">${(analytics.totalValue - analytics.equity).toFixed(0)}</span>
                </p>
              </div>
            </div>
          </div>

          {/* Card 3 — Portfolio ROI Score */}
          <div className={`relative rounded-xl border bg-card overflow-hidden group transition-all duration-300 ${analytics.fitRisk ? "border-red-500/40" : "border-border hover:border-primary/30"}`}>
            <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${analytics.fitRisk ? "from-red-500" : "from-emerald-500"} to-transparent`} />
            <div className="p-5">
              <div className="flex items-start justify-between mb-5">
                <div>
                  <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">PORTFOLIO ROI SCORE</p>
                  <div className="flex items-end gap-2">
                    <p className="text-5xl font-mono font-bold" style={{ color: roiGrade.color }}>{analytics.roi}</p>
                    <span className="text-lg font-mono text-muted-foreground mb-1">/ 100</span>
                  </div>
                  <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: roiGrade.color }}>
                    {roiGrade.label}
                  </span>
                </div>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${analytics.fitRisk ? "bg-red-500/15 border border-red-500/30" : "bg-emerald-500/15 border border-emerald-500/30"}`}>
                  {analytics.fitRisk
                    ? <ShieldAlert className="w-4 h-4 text-red-400" />
                    : <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  }
                </div>
              </div>

              {/* Circular progress ring */}
              <div className="flex justify-center mb-5">
                <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
                  <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(220 13% 12%)" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="52" fill="none"
                    stroke={roiGrade.color}
                    strokeWidth="8" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 52}`}
                    strokeDashoffset={`${2 * Math.PI * 52 * (1 - analytics.roi / 100)}`}
                    style={{ transition: "stroke-dashoffset 0.8s ease-out", filter: `drop-shadow(0 0 6px ${roiGrade.color}88)` }}
                  />
                </svg>
              </div>

              <div className="space-y-2 text-[9px] font-mono">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">CPW Efficiency (60%)</span>
                  <span className="text-foreground/80">{Math.round((1 - analytics.avgCPW / 5) * 100)}%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Retention Rate (40%)</span>
                  <span className="text-foreground/80">{analytics.retentionScore.toFixed(0)}%</span>
                </div>
                {analytics.fitRisk && (
                  <div className="flex justify-between text-red-400">
                    <span>Fit Risk Penalty</span>
                    <span>−20 pts</span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-border/50">
                <p className="text-[9px] font-mono text-muted-foreground">
                  {analytics.roi >= 55
                    ? "Smart portfolio. Prioritize retention-positive brands."
                    : analytics.fitRisk
                      ? "Fix fit mismatch to recover ROI points."
                      : "Add premium retained-value items to improve score."
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom analytics bar */}
        <div className="grid grid-cols-4 gap-3">
          {[
            { label: "AVG COST/WEAR", value: `$${analytics.avgCPW.toFixed(2)}`, sub: "across 50 uses", color: "#00e5ff" },
            { label: "TOTAL DEPRECIATION", value: `-$${(analytics.totalValue - analytics.equity).toFixed(0)}`, sub: "12-month projection", color: "#ef4444" },
            { label: "EQUITY RETENTION", value: `${analytics.retentionScore.toFixed(1)}%`, sub: "of gross value retained", color: "#8b5cf6" },
            { label: "ITEMS IN PORTFOLIO", value: `${closetItems.length}`, sub: "catalogued assets", color: "#34d399" },
          ].map(({ label, value, sub, color }) => (
            <div key={label} className="rounded-xl border border-border bg-card/50 p-4 relative overflow-hidden group hover:border-border/80 transition-colors">
              <div className="absolute top-0 left-0 w-8 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
              <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-2">{label}</p>
              <p className="font-mono text-xl font-bold text-white" style={{ textShadow: `0 0 12px ${color}44` }}>{value}</p>
              <p className="text-[9px] font-mono text-muted-foreground mt-1">{sub}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
