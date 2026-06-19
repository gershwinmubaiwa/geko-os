import React, { useEffect, useState } from "react";
import { closetItems, ClosetItem } from "@/data/closetData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Scale, Sparkles, Clock, Droplets, Tag, Layers } from "lucide-react";

interface ValueOptimizerProps {
  selectedItem: ClosetItem | null;
  outfitPairItem: ClosetItem | null;
  onTryOn: () => void;
  onCompleteOutfit: (paired: ClosetItem) => void;
}

const TOP_CATEGORIES = ["Tops", "Outerwear", "Footwear", "Blazers"];
const BOTTOM_CATEGORIES = ["Bottoms"];

function findOutfitPair(item: ClosetItem): ClosetItem | null {
  if (TOP_CATEGORIES.includes(item.category)) {
    return closetItems.find(i => BOTTOM_CATEGORIES.includes(i.category) && i.id !== item.id) ?? null;
  }
  if (BOTTOM_CATEGORIES.includes(item.category)) {
    return closetItems.find(i => TOP_CATEGORIES.includes(i.category) && i.id !== item.id) ?? null;
  }
  return null;
}

function AnimatedBar({ value, delay = 0, color = "primary" }: { value: number; delay?: number; color?: "primary" | "emerald" }) {
  const [displayed, setDisplayed] = useState(0);
  useEffect(() => {
    const t = setTimeout(() => setDisplayed(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return (
    <Progress
      value={displayed}
      className={`h-2 transition-all duration-700 ${color === "emerald" ? "[&>div]:bg-emerald-500" : "[&>div]:bg-primary"}`}
    />
  );
}

export function ValueOptimizer({ selectedItem, outfitPairItem, onTryOn, onCompleteOutfit }: ValueOptimizerProps) {
  if (!selectedItem) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <TrendingUp className="w-16 h-16 text-muted-foreground mb-4 opacity-30" />
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">NO ITEM SELECTED</h2>
        <p className="text-muted-foreground font-mono text-sm">Select an item from Virtual Closet to analyze</p>
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
    <div className="w-full h-full p-6 overflow-y-auto">
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

      {/* Item hero image */}
      <div className="relative h-28 rounded-xl overflow-hidden mb-5 border border-border">
        <img
          src={selectedItem.image}
          alt={selectedItem.name}
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
                  <div className="text-sm text-white font-bold">
                    Pair with: <span className="text-primary">{pairedCandidate.name}</span>
                  </div>
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

                {/* Split color preview */}
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

                {/* Combined cost-per-wear */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-2 rounded-lg bg-muted/30 border border-border">
                    <div className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">TOP/WEAR</div>
                    <div className="font-mono text-sm text-white font-bold">${(outfitTopItem!.price / 50).toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-muted/30 border border-border">
                    <div className="text-[9px] font-mono text-muted-foreground tracking-widest mb-1">BOTTOM/WEAR</div>
                    <div className="font-mono text-sm text-white font-bold">${(outfitBottomItem!.price / 50).toFixed(2)}</div>
                  </div>
                  <div className="text-center p-2 rounded-lg bg-primary/10 border border-primary/30">
                    <div className="text-[9px] font-mono text-primary tracking-widest mb-1">OUTFIT/WEAR</div>
                    <div className="font-mono text-sm text-primary font-bold">${combinedCostPerWear}</div>
                  </div>
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 mb-5">
        {/* Target item */}
        <Card className="border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-primary to-transparent" />
          <CardContent className="p-5">
            <div className="text-[10px] font-mono text-muted-foreground tracking-widest mb-3">TARGET ITEM</div>
            <div className="text-xl font-bold text-white mb-1">{selectedItem.name}</div>
            <div className="font-mono text-primary text-sm mb-4">{selectedItem.brand}</div>
            <div className="text-3xl font-mono font-bold text-white mb-1">${selectedItem.price.toLocaleString()}</div>
            <div className="text-xs font-mono text-muted-foreground mb-5 flex items-center gap-1">
              <Tag className="w-3 h-3" />
              ${costPerWear} / wear <span className="text-primary/60 ml-1">(50 uses)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded-full border-2 border-border/50 flex-shrink-0" style={{ backgroundColor: selectedItem.color }} />
              <span className="font-mono text-[10px] text-muted-foreground">MANNEQUIN COLOR</span>
            </div>
          </CardContent>
        </Card>

        {/* Value multiplier */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur flex flex-col items-center justify-center p-5 relative overflow-hidden shadow-[0_0_40px_rgba(139,92,246,0.07)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/8 to-transparent pointer-events-none" />
          <div className="z-10 text-center">
            <div className="text-[10px] font-mono text-primary tracking-widest mb-6">VALUE MULTIPLIER</div>
            <div className="relative inline-flex items-center justify-center mb-6">
              <svg className="w-40 h-40 transform -rotate-90">
                <circle cx="80" cy="80" r="72" className="stroke-muted fill-none" strokeWidth="4" />
                <circle
                  cx="80" cy="80" r="72"
                  className="stroke-primary fill-none transition-all duration-1000 ease-out"
                  strokeWidth="4" strokeLinecap="round"
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

        {/* Budget alternative */}
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

      {/* Cost-per-wear bars */}
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
                <div className="h-full rounded-full transition-all duration-700" style={{ width: "100%", background: "linear-gradient(90deg, hsl(264,89%,67%), hsl(186,100%,50%))", boxShadow: "0 0 8px rgba(139,92,246,0.5)" }} />
              </div>
            </div>
            <div>
              <div className="flex justify-between mb-1.5">
                <span className="text-xs font-bold text-white">{selectedItem.budgetAlternative.name}</span>
                <span className="font-mono text-emerald-400 text-xs">${budgetCostPerWear}/wear</span>
              </div>
              <div className="h-2.5 rounded-full bg-muted overflow-hidden">
                <div className="h-full rounded-full transition-all duration-700" style={{ width: `${Math.min(100, (selectedItem.budgetAlternative.price / selectedItem.price) * 100)}%`, background: "linear-gradient(90deg, #10b981, #34d399)", boxShadow: "0 0 8px rgba(16,185,129,0.4)" }} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Style compatibility */}
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <h3 className="text-[10px] font-mono text-primary tracking-widest mb-5">STYLE COMPATIBILITY</h3>
          <div className="space-y-5">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Scale className="w-4 h-4 text-muted-foreground" />Fit Score</span>
                <span className="font-mono text-primary text-sm">94%</span>
              </div>
              <AnimatedBar value={94} delay={100} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-muted-foreground" />Aesthetic Match</span>
                <span className="font-mono text-primary text-sm">87%</span>
              </div>
              <AnimatedBar value={87} delay={250} />
            </div>
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground" />Longevity</span>
                <span className="font-mono text-primary text-sm">78%</span>
              </div>
              <AnimatedBar value={78} delay={400} />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
