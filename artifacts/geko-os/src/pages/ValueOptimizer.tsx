import React, { useEffect, useMemo, useState } from "react";
import { closetItems, ClosetItem } from "@/data/closetData";
import { MannequinData } from "@/components/MannequinCanvas";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  TrendingUp, Scale, Sparkles, Clock, Droplets, Tag, Layers,
  DollarSign, BarChart3, ShieldCheck, ShieldAlert, AlertTriangle,
} from "lucide-react";

interface ValueOptimizerProps {
  selectedItem: ClosetItem | null;
  outfitPairItem: ClosetItem | null;
  mannequinData: MannequinData;
  onTryOn: () => void;
  onCompleteOutfit: (paired: ClosetItem) => void;
}

const TOP_CATEGORIES = ["Tops", "Outerwear", "Footwear", "Blazers"];
const BOTTOM_CATEGORIES = ["Bottoms"];

const RETENTION_RATES: Record<string, number> = {
  nike: 0.45, adidas: 0.45, zara: 0.30, shein: 0,
};

function getRetentionRate(brand: string) { return RETENTION_RATES[brand.toLowerCase()] ?? 0.20; }

function findOutfitPair(item: ClosetItem): ClosetItem | null {
  if (TOP_CATEGORIES.includes(item.category))
    return closetItems.find(i => BOTTOM_CATEGORIES.includes(i.category) && i.id !== item.id) ?? null;
  if (BOTTOM_CATEGORIES.includes(item.category))
    return closetItems.find(i => TOP_CATEGORIES.includes(i.category) && i.id !== item.id) ?? null;
  return null;
}

function getSizeRisk(item: ClosetItem, bio: MannequinData): "Low" | "Medium" | "High" {
  const brand = item.brand.toLowerCase();
  if (brand === "nike" || brand === "adidas") return "Low";
  if (brand === "zara") return "Medium";
  if (brand === "shein") return bio.chest > 90 ? "High" : "High";
  return "Low";
}

function AnimatedBar({ value, delay = 0 }: { value: number; delay?: number }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return <Progress value={displayed} className="h-2 transition-all duration-700" />;
}

function PortfolioBar({ pct, color }: { pct: number; color: string }) {
  return (
    <div className="h-2 rounded-full bg-muted overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-700"
        style={{ width: `${Math.min(100, pct)}%`, background: color, boxShadow: `0 0 6px ${color}55` }}
      />
    </div>
  );
}

export function ValueOptimizer({ selectedItem, outfitPairItem, mannequinData, onTryOn, onCompleteOutfit }: ValueOptimizerProps) {

  const analytics = useMemo(() => {
    const totalValue = closetItems.reduce((s, i) => s + i.price, 0);
    const equity = closetItems.reduce((s, i) => s + i.price * getRetentionRate(i.brand), 0);
    const avgCPW = totalValue / (closetItems.length * 50);
    const cpwScore = Math.max(0, Math.min(100, (1 - avgCPW / 5) * 100));
    const retentionScore = (equity / totalValue) * 100;
    const baseROI = Math.round(cpwScore * 0.6 + retentionScore * 0.4);
    const fitRisk = selectedItem ? getSizeRisk(selectedItem, mannequinData) === "High" : false;
    const roi = fitRisk ? Math.max(0, baseROI - 20) : baseROI;
    return { totalValue, equity, baseROI, roi, fitRisk, avgCPW, retentionScore, cpwScore };
  }, [selectedItem, mannequinData]);

  const roiGrade = analytics.roi >= 75 ? { label: "EXCELLENT", color: "#10b981" }
    : analytics.roi >= 55 ? { label: "GOOD", color: "#8b5cf6" }
    : analytics.roi >= 35 ? { label: "FAIR", color: "#f59e0b" }
    : { label: "POOR", color: "#ef4444" };

  if (!selectedItem) {
    return (
      <div className="w-full h-full flex flex-col overflow-y-auto">
        <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
          <TrendingUp className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
          <h2 className="text-xl font-bold text-white mb-2 tracking-tight">NO ITEM SELECTED</h2>
          <p className="text-muted-foreground font-mono text-sm mb-8">Select an item from Virtual Closet to analyze</p>
        </div>
        <CapitalAnalytics analytics={analytics} roiGrade={roiGrade} />
      </div>
    );
  }

  const multiplier = Math.max(1, Math.round(selectedItem.price / selectedItem.budgetAlternative.price));
  const costPerWear = (selectedItem.price / 50).toFixed(2);
  const budgetCostPerWear = (selectedItem.budgetAlternative.price / 50).toFixed(2);

  const pairedCandidate = findOutfitPair(selectedItem);
  const isOutfitComplete = !!outfitPairItem;
  const outfitTopItem = TOP_CATEGORIES.includes(selectedItem.category) ? selectedItem : outfitPairItem;
  const outfitBottomItem = BOTTOM_CATEGORIES.includes(selectedItem.category) ? selectedItem : outfitPairItem;
  const combinedPrice = outfitPairItem ? selectedItem.price + outfitPairItem.price : 0;
  const combinedCostPerWear = outfitPairItem ? (combinedPrice / 50).toFixed(2) : "0.00";

  return (
    <div className="w-full h-full overflow-y-auto">
      <div className="p-6">

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <TrendingUp className="text-primary w-6 h-6" />
            <h2 className="text-2xl font-bold tracking-tight text-white">VALUE OPTIMIZER</h2>
            <div className="h-px w-24 bg-gradient-to-r from-primary/40 to-transparent" />
          </div>
          <Button
            data-testid="try-on-btn"
            onClick={onTryOn}
            className="btn-liquid font-mono tracking-widest text-xs bg-primary text-primary-foreground hover:bg-primary/90"
          >
            TRY ON MANNEQUIN
          </Button>
        </div>

        {/* Hero image */}
        <div className="relative h-28 rounded-xl overflow-hidden mb-5 border border-border">
          <img
            src={selectedItem.image} alt={selectedItem.name}
            className="w-full h-full object-cover"
            onError={e => { (e.target as HTMLImageElement).style.display = "none"; }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent" />
          <div className="absolute inset-0 p-5 flex flex-col justify-center">
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-1">{selectedItem.brand.toUpperCase()} · {selectedItem.category.toUpperCase()}</div>
            <div className="text-2xl font-bold text-white">{selectedItem.name}</div>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            {selectedItem.tags.map(tag => (
              <Badge key={tag} variant="secondary" className="bg-black/50 backdrop-blur font-mono text-[9px] border border-white/10">{tag}</Badge>
            ))}
          </div>
        </div>

        {/* Complete the Outfit */}
        {pairedCandidate && (
          <Card className={`mb-5 border transition-all duration-500 ${isOutfitComplete ? "border-primary/40 bg-primary/5 shadow-[0_0_20px_rgba(139,92,246,0.15)]" : "border-border bg-card"}`}>
            <CardContent className="p-4">
              {!isOutfitComplete ? (
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-1">OUTFIT COMPLETION</div>
                    <div className="text-sm text-white font-bold">Pair with: <span className="text-primary">{pairedCandidate.name}</span></div>
                    <div className="text-[10px] font-mono text-muted-foreground mt-0.5">{pairedCandidate.brand} · ${pairedCandidate.price}</div>
                  </div>
                  <Button
                    data-testid="complete-outfit-btn"
                    onClick={() => onCompleteOutfit(pairedCandidate)}
                    className="btn-liquid font-mono tracking-widest text-[11px] h-9 border border-primary/50 bg-transparent text-primary hover:border-primary flex items-center gap-2 flex-shrink-0"
                    variant="outline"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    COMPLETE THE OUTFIT
                  </Button>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-mono text-primary tracking-widest mb-3 flex items-center gap-2">
                    <Layers className="w-3 h-3" /> OUTFIT ASSEMBLED
                  </div>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="flex flex-col gap-1 flex-shrink-0">
                      <div className="w-10 h-5 rounded-t-sm border border-white/10" style={{ backgroundColor: outfitTopItem?.color }} />
                      <div className="w-10 h-5 rounded-b-sm border border-white/10" style={{ backgroundColor: outfitBottomItem?.color }} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white">{outfitTopItem?.name} <span className="text-muted-foreground font-normal">+</span> {outfitBottomItem?.name}</div>
                      <div className="text-[10px] font-mono text-muted-foreground mt-0.5">${outfitTopItem?.price} + ${outfitBottomItem?.price} = <span className="text-white font-bold">${combinedPrice}</span></div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {[
                      { label: "TOP/WEAR", val: `$${(outfitTopItem!.price / 50).toFixed(2)}` },
                      { label: "BOTTOM/WEAR", val: `$${(outfitBottomItem!.price / 50).toFixed(2)}` },
                      { label: "OUTFIT/WEAR", val: `$${combinedCostPerWear}`, highlight: true },
                    ].map(({ label, val, highlight }) => (
                      <div key={label} className={`text-center p-2 rounded-lg border ${highlight ? "bg-primary/10 border-primary/30" : "bg-muted/30 border-border"}`}>
                        <div className={`text-[9px] font-mono tracking-widest mb-1 ${highlight ? "text-primary" : "text-muted-foreground"}`}>{label}</div>
                        <div className={`font-mono text-sm font-bold ${highlight ? "text-primary" : "text-white"}`}>{val}</div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 pt-3 border-t border-border/50 flex justify-between items-center">
                    <span className="text-[10px] font-mono text-muted-foreground tracking-wider">TOTAL OUTFIT VALUE</span>
                    <span className="font-mono text-lg font-bold text-white">${combinedPrice} <span className="text-[11px] text-muted-foreground font-normal">/ 50 wears = <span className="text-primary">${combinedCostPerWear}</span></span></span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* 3-column item comparison */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
            <CardContent className="p-5">
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-3">TARGET ITEM</div>
              <div className="text-xl font-bold text-white mb-1">{selectedItem.name}</div>
              <div className="font-mono text-primary text-sm mb-4">{selectedItem.brand}</div>
              <div className="text-3xl font-mono font-bold text-white mb-1">${selectedItem.price.toLocaleString()}</div>
              <div className="text-xs font-mono text-muted-foreground mb-5 flex items-center gap-1">
                <Tag className="w-3 h-3" />${costPerWear} / wear <span className="text-primary/60 ml-1">(50 uses)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-full border-2 border-border/50" style={{ backgroundColor: selectedItem.color }} />
                <span className="font-mono text-[10px] text-muted-foreground">MANNEQUIN COLOR</span>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-card/50 backdrop-blur flex flex-col items-center justify-center p-5 relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.07)]">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 to-transparent pointer-events-none" />
            <div className="z-10 text-center">
              <div className="text-[10px] font-mono text-primary tracking-widest mb-6">VALUE MULTIPLIER</div>
              <div className="relative inline-flex items-center justify-center mb-6">
                <svg className="w-40 h-40 transform -rotate-90">
                  <circle cx="80" cy="80" r="72" className="stroke-muted fill-none" strokeWidth="4" />
                  <circle cx="80" cy="80" r="72" className="stroke-primary fill-none transition-all duration-1000 ease-out" strokeWidth="4" strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 72}`}
                    strokeDashoffset={`${2 * Math.PI * 72 * (1 - Math.min(1, 1 / multiplier))}`}
                    style={{ filter: "drop-shadow(0 0 8px rgba(139,92,246,0.6))" }}
                  />
                </svg>
                <div className="absolute text-4xl font-bold text-white drop-shadow-[0_0_12px_rgba(139,92,246,0.6)]">{multiplier}x</div>
              </div>
              <p className="text-xs text-muted-foreground font-mono max-w-[180px] mx-auto leading-relaxed">
                Target costs {multiplier}× more than the budget pick
              </p>
            </div>
          </Card>

          <Card className="border-border bg-card relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-emerald-500 to-transparent" />
            <CardContent className="p-5">
              <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-3">BUDGET ALTERNATIVE</div>
              <div className="text-xl font-bold text-white mb-1">{selectedItem.budgetAlternative.name}</div>
              <div className="text-emerald-400 font-mono text-sm mb-4">{selectedItem.budgetAlternative.brand}</div>
              <div className="text-3xl font-mono font-bold text-white mb-1">${selectedItem.budgetAlternative.price.toLocaleString()}</div>
              <div className="text-xs font-mono text-muted-foreground mb-5 flex items-center gap-1">
                <Tag className="w-3 h-3" />${budgetCostPerWear} / wear <span className="text-emerald-400/60 ml-1">(50 uses)</span>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground"><Scale className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />Similar silhouette</div>
                <div className="flex items-center gap-2.5 text-xs text-muted-foreground"><Droplets className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />90% color match</div>
                <div className="flex items-center gap-2.5 text-xs font-bold text-emerald-400"><TrendingUp className="w-3.5 h-3.5 flex-shrink-0" />Saves ${(selectedItem.price - selectedItem.budgetAlternative.price).toLocaleString()}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CPW bars */}
        <Card className="border-border bg-card mb-5">
          <CardContent className="p-5">
            <div className="text-[10px] font-mono text-primary tracking-widest mb-4">COST-PER-WEAR ANALYSIS <span className="text-muted-foreground">(based on 50 uses)</span></div>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{selectedItem.name}</span>
                  <span className="font-mono text-primary text-xs">${costPerWear}/wear</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: "100%", background: "linear-gradient(90deg, hsl(264,89%,67%), hsl(186,100%,50%))", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between mb-1.5">
                  <span className="text-xs font-bold text-white">{selectedItem.budgetAlternative.name}</span>
                  <span className="font-mono text-emerald-400 text-xs">${budgetCostPerWear}/wear</span>
                </div>
                <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(100, (selectedItem.budgetAlternative.price / selectedItem.price) * 100)}%`, background: "linear-gradient(90deg, #10b981, #34d399)", boxShadow: "0 0 8px rgba(16,185,129,0.4)" }} />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Style compatibility */}
        <Card className="border-border bg-card mb-8">
          <CardContent className="p-5">
            <h3 className="text-[10px] font-mono text-primary tracking-widest mb-5">STYLE COMPATIBILITY</h3>
            <div className="space-y-5">
              {[
                { label: "Fit Score", icon: <Scale className="w-4 h-4 text-muted-foreground" />, value: 94, delay: 100 },
                { label: "Aesthetic Match", icon: <Sparkles className="w-4 h-4 text-muted-foreground" />, value: 87, delay: 250 },
                { label: "Longevity", icon: <Clock className="w-4 h-4 text-muted-foreground" />, value: 78, delay: 400 },
              ].map(({ label, icon, value, delay }) => (
                <div key={label}>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-bold text-white flex items-center gap-2">{icon}{label}</span>
                    <span className="font-mono text-primary text-sm">{value}%</span>
                  </div>
                  <AnimatedBar value={value} delay={delay} />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── CLOSET CAPITAL ANALYTICS ── */}
      <CapitalAnalytics analytics={analytics} roiGrade={roiGrade} />
    </div>
  );
}

interface AnalyticsData {
  totalValue: number; equity: number; baseROI: number; roi: number;
  fitRisk: boolean; avgCPW: number; retentionScore: number; cpwScore: number;
}

function CapitalAnalytics({ analytics, roiGrade }: { analytics: AnalyticsData; roiGrade: { label: string; color: string } }) {
  return (
    <div className="px-6 pb-8">
      {/* Section header */}
      <div className="flex items-center gap-3 mb-5">
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
        <div className="mb-5 flex items-start gap-3 px-4 py-3 rounded-xl border border-red-500/30 bg-red-500/8">
          <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
          <div>
            <span className="font-mono text-[10px] text-red-400 font-bold tracking-wider block">ASSET RISK DETECTED</span>
            <span className="text-xs text-red-300/80 mt-0.5 block">Inaccurate fit increases liquidation/return probability. Portfolio ROI Score penalized −20 pts.</span>
          </div>
        </div>
      )}

      {/* 3 metric cards */}
      <div className="grid grid-cols-3 gap-4 mb-4">

        {/* Total Asset Value */}
        <div className="relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-cyan-400 to-transparent" />
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
                { label: "Nike", color: "#00e5ff" },
                { label: "Adidas", color: "#8b5cf6" },
                { label: "Zara", color: "#a78bfa" },
                { label: "Shein", color: "#34d399" },
              ].map(({ label, color }) => {
                const val = closetItems.filter(i => i.brand === label).reduce((s, i) => s + i.price, 0);
                return (
                  <div key={label}>
                    <div className="flex justify-between mb-1">
                      <span className="text-[9px] font-mono text-muted-foreground">{label}</span>
                      <span className="text-[9px] font-mono text-foreground/70">${val}</span>
                    </div>
                    <div className="h-2 rounded-full bg-muted overflow-hidden">
                      <div className="h-full rounded-full transition-all duration-700"
                        style={{ width: `${(val / analytics.totalValue) * 100}%`, background: color, boxShadow: `0 0 6px ${color}55` }} />
                    </div>
                  </div>
                );
              })}
            </div>
            <p className="text-[9px] font-mono text-muted-foreground mt-3 pt-3 border-t border-border/50">Avg. item price: ${(analytics.totalValue / closetItems.length).toFixed(0)}</p>
          </div>
        </div>

        {/* Wardrobe Equity */}
        <div className="relative rounded-xl border border-border bg-card overflow-hidden hover:border-primary/30 transition-all duration-300">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
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
                const v = closetItems.filter(i => i.brand === brand).reduce((s, i) => s + i.price, 0);
                return (
                  <div key={brand} className="flex items-center gap-2.5">
                    <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
                    <span className="text-[9px] font-mono text-muted-foreground flex-1 truncate">{label}</span>
                    <span className="text-[9px] font-mono font-bold" style={{ color }}>${(v * rate).toFixed(0)}</span>
                  </div>
                );
              })}
            </div>
            <div className="pt-3 border-t border-border/50">
              <div className="flex justify-between mb-1.5">
                <span className="text-[9px] font-mono text-muted-foreground">Retained value</span>
                <span className="text-[9px] font-mono text-primary">{analytics.retentionScore.toFixed(1)}%</span>
              </div>
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full" style={{ width: `${analytics.retentionScore}%`, background: "#8b5cf6", boxShadow: "0 0 6px #8b5cf655" }} />
              </div>
              <p className="text-[9px] font-mono text-muted-foreground mt-2">Depreciation loss: <span className="text-red-400">${(analytics.totalValue - analytics.equity).toFixed(0)}</span></p>
            </div>
          </div>
        </div>

        {/* ROI Score */}
        <div className={`relative rounded-xl border bg-card overflow-hidden transition-all duration-300 ${analytics.fitRisk ? "border-red-500/40" : "border-border hover:border-primary/30"}`}>
          <div className={`absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r ${analytics.fitRisk ? "from-red-500" : "from-emerald-500"} to-transparent`} />
          <div className="p-5">
            <div className="flex items-start justify-between mb-5">
              <div>
                <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">PORTFOLIO ROI SCORE</p>
                <div className="flex items-end gap-2">
                  <p className="text-5xl font-mono font-bold" style={{ color: roiGrade.color }}>{analytics.roi}</p>
                  <span className="text-lg font-mono text-muted-foreground mb-1">/ 100</span>
                </div>
                <span className="text-[10px] font-mono tracking-widest font-bold" style={{ color: roiGrade.color }}>{roiGrade.label}</span>
              </div>
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${analytics.fitRisk ? "bg-red-500/15 border border-red-500/30" : "bg-emerald-500/15 border border-emerald-500/30"}`}>
                {analytics.fitRisk ? <ShieldAlert className="w-4 h-4 text-red-400" /> : <ShieldCheck className="w-4 h-4 text-emerald-400" />}
              </div>
            </div>
            <div className="flex justify-center mb-5">
              <svg viewBox="0 0 120 120" className="w-28 h-28 -rotate-90">
                <circle cx="60" cy="60" r="52" fill="none" stroke="hsl(220 13% 12%)" strokeWidth="8" />
                <circle cx="60" cy="60" r="52" fill="none" stroke={roiGrade.color} strokeWidth="8" strokeLinecap="round"
                  strokeDasharray={`${2 * Math.PI * 52}`}
                  strokeDashoffset={`${2 * Math.PI * 52 * (1 - analytics.roi / 100)}`}
                  style={{ transition: "stroke-dashoffset 0.8s ease-out", filter: `drop-shadow(0 0 6px ${roiGrade.color}88)` }}
                />
              </svg>
            </div>
            <div className="space-y-2 text-[9px] font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">CPW Efficiency (60%)</span>
                <span className="text-foreground/80">{Math.round(analytics.cpwScore)}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Retention Rate (40%)</span>
                <span className="text-foreground/80">{analytics.retentionScore.toFixed(0)}%</span>
              </div>
              {analytics.fitRisk && <div className="flex justify-between text-red-400"><span>Fit Risk Penalty</span><span>−20 pts</span></div>}
            </div>
            <div className="mt-3 pt-3 border-t border-border/50">
              <p className="text-[9px] font-mono text-muted-foreground">
                {analytics.roi >= 55 ? "Smart portfolio. Prioritize retention-positive brands."
                  : analytics.fitRisk ? "Fix fit mismatch to recover ROI points."
                  : "Add premium retained-value items to improve score."}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom stat bar */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: "AVG COST/WEAR", value: `$${analytics.avgCPW.toFixed(2)}`, sub: "across 50 uses", color: "#00e5ff" },
          { label: "TOTAL DEPRECIATION", value: `-$${(analytics.totalValue - analytics.equity).toFixed(0)}`, sub: "12-month projection", color: "#ef4444" },
          { label: "EQUITY RETENTION", value: `${analytics.retentionScore.toFixed(1)}%`, sub: "of gross value retained", color: "#8b5cf6" },
          { label: "ITEMS IN PORTFOLIO", value: `${closetItems.length}`, sub: "catalogued assets", color: "#34d399" },
        ].map(({ label, value, sub, color }) => (
          <div key={label} className="rounded-xl border border-border bg-card/50 p-4 relative overflow-hidden hover:border-border/80 transition-colors">
            <div className="absolute top-0 left-0 w-8 h-0.5" style={{ background: `linear-gradient(90deg, ${color}, transparent)` }} />
            <p className="text-[9px] font-mono text-muted-foreground tracking-widest mb-2">{label}</p>
            <p className="font-mono text-xl font-bold text-white" style={{ textShadow: `0 0 12px ${color}44` }}>{value}</p>
            <p className="text-[9px] font-mono text-muted-foreground mt-1">{sub}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
