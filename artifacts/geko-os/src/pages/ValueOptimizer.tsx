import React from "react";
import { ClosetItem } from "@/data/closetData";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Scale, Sparkles, Clock, Droplets } from "lucide-react";

interface ValueOptimizerProps {
  selectedItem: ClosetItem | null;
  onTryOn: () => void;
}

export function ValueOptimizer({ selectedItem, onTryOn }: ValueOptimizerProps) {
  if (!selectedItem) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-6 text-center">
        <TrendingUp className="w-16 h-16 text-muted-foreground mb-4 opacity-50" />
        <h2 className="text-xl font-bold text-white mb-2 tracking-tight">NO ITEM SELECTED</h2>
        <p className="text-muted-foreground font-mono text-sm">Select an item from Virtual Closet to analyze</p>
      </div>
    );
  }

  const multiplier = Math.round(selectedItem.price / selectedItem.budgetAlternative.price);

  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <TrendingUp className="text-primary w-6 h-6" />
          <h2 className="text-2xl font-bold tracking-tight text-white">VALUE OPTIMIZER</h2>
        </div>
        <Button 
          onClick={onTryOn}
          className="font-mono tracking-widest text-xs bg-primary text-primary-foreground hover:bg-primary/90 shadow-[0_0_15px_rgba(0,229,255,0.4)]"
        >
          TRY ON MANNEQUIN
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Luxury Column */}
        <Card className="border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-500 to-transparent" />
          <CardContent className="p-6">
            <div className="text-xs font-mono text-muted-foreground tracking-widest mb-4">LUXURY TARGET</div>
            <div className="text-3xl font-bold text-white mb-1">{selectedItem.name}</div>
            <div className="text-primary font-mono mb-6">{selectedItem.brand}</div>
            
            <div className="text-4xl font-mono font-bold text-white mb-8">
              ${selectedItem.price.toLocaleString()}
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-8 h-8 rounded-full border border-border" style={{ backgroundColor: selectedItem.color }} />
              <span className="font-mono text-xs text-muted-foreground">PRIMARY HUE</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {selectedItem.tags.map(tag => (
                <Badge key={tag} variant="secondary" className="bg-secondary/50 font-mono text-[10px]">
                  {tag}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Center Visualizer */}
        <Card className="border-primary/20 bg-card/50 backdrop-blur flex flex-col items-center justify-center p-6 relative overflow-hidden shadow-[0_0_40px_rgba(0,229,255,0.05)]">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-primary/10 to-transparent pointer-events-none" />
          
          <div className="text-center z-10">
            <div className="text-xs font-mono text-primary tracking-widest mb-8">VALUE MULTIPLIER</div>
            
            <div className="relative inline-flex items-center justify-center mb-8">
              <svg className="w-48 h-48 transform -rotate-90">
                <circle cx="96" cy="96" r="88" className="stroke-muted fill-none" strokeWidth="4" />
                <circle 
                  cx="96" 
                  cy="96" 
                  r="88" 
                  className="stroke-primary fill-none transition-all duration-1000 ease-out" 
                  strokeWidth="4" 
                  strokeDasharray={`${2 * Math.PI * 88}`}
                  strokeDashoffset={`${2 * Math.PI * 88 * (1 - 1/multiplier)}`}
                  style={{ filter: "drop-shadow(0 0 8px rgba(0,229,255,0.5))" }}
                />
              </svg>
              <div className="absolute text-5xl font-bold text-white drop-shadow-[0_0_10px_rgba(255,255,255,0.5)]">
                {multiplier}x
              </div>
            </div>
            
            <p className="text-sm text-muted-foreground font-mono max-w-[200px] mx-auto">
              Luxury item costs {multiplier} times more than the budget alternative.
            </p>
          </div>
        </Card>

        {/* Budget Column */}
        <Card className="border-border bg-card relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-transparent" />
          <CardContent className="p-6">
            <div className="text-xs font-mono text-muted-foreground tracking-widest mb-4">BUDGET ALTERNATIVE</div>
            <div className="text-3xl font-bold text-white mb-1">{selectedItem.budgetAlternative.name}</div>
            <div className="text-emerald-400 font-mono mb-6">{selectedItem.budgetAlternative.brand}</div>
            
            <div className="text-4xl font-mono font-bold text-white mb-8">
              ${selectedItem.budgetAlternative.price.toLocaleString()}
            </div>
            
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-sm text-muted-foreground">
                 <Scale className="w-4 h-4 text-emerald-500" />
                 <span>Similar silhouette</span>
               </div>
               <div className="flex items-center gap-3 text-sm text-muted-foreground">
                 <Droplets className="w-4 h-4 text-emerald-500" />
                 <span>90% color match</span>
               </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border bg-card">
        <CardContent className="p-6">
          <h3 className="text-sm font-mono text-primary tracking-widest mb-6">STYLE COMPATIBILITY</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Scale className="w-4 h-4 text-muted-foreground"/> Fit Score</span>
                <span className="font-mono text-primary text-sm">94%</span>
              </div>
              <Progress value={94} className="h-2 [&>div]:bg-primary" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Sparkles className="w-4 h-4 text-muted-foreground"/> Aesthetic Match</span>
                <span className="font-mono text-primary text-sm">87%</span>
              </div>
              <Progress value={87} className="h-2 [&>div]:bg-primary" />
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-bold text-white flex items-center gap-2"><Clock className="w-4 h-4 text-muted-foreground"/> Longevity</span>
                <span className="font-mono text-primary text-sm">78%</span>
              </div>
              <Progress value={78} className="h-2 [&>div]:bg-primary" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
