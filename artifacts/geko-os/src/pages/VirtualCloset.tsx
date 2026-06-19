import React from "react";
import { closetItems, ClosetItem } from "@/data/closetData";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Shirt } from "lucide-react";

interface VirtualClosetProps {
  onAnalyze: (item: ClosetItem) => void;
}

export function VirtualCloset({ onAnalyze }: VirtualClosetProps) {
  return (
    <div className="w-full h-full p-6 overflow-y-auto">
      <div className="flex items-center gap-3 mb-8">
        <Shirt className="text-primary w-6 h-6" />
        <h2 className="text-2xl font-bold tracking-tight text-white">BRAND CATALOG</h2>
        <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent ml-2" />
        <span className="font-mono text-xs text-muted-foreground tracking-widest">{closetItems.length} ITEMS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {closetItems.map((item) => (
          <Card
            key={item.id}
            data-testid={`closet-card-${item.id}`}
            className="border-border bg-card hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(139,92,246,0.18)] flex flex-col overflow-hidden"
          >
            {/* Product image */}
            <div className="relative h-52 w-full overflow-hidden bg-muted">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-106"
                onError={(e) => {
                  const el = e.target as HTMLImageElement;
                  el.style.display = "none";
                  el.parentElement!.style.background = item.color;
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />

              {/* Brand badge overlay */}
              <div className="absolute top-3 left-3">
                <span className="px-2 py-1 rounded-md bg-black/60 backdrop-blur text-[10px] font-mono tracking-widest text-white border border-white/10">
                  {item.brand.toUpperCase()}
                </span>
              </div>

              {/* Color swatch */}
              <div
                className="absolute bottom-3 right-3 w-5 h-5 rounded-full border-2 border-white/30 shadow-md"
                style={{ backgroundColor: item.color }}
              />
            </div>

            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <div className="text-[10px] font-mono text-muted-foreground mb-1 tracking-widest">{item.category.toUpperCase()}</div>
                  <h3 className="text-base font-bold text-white leading-tight">{item.name}</h3>
                </div>
                <div className="text-right flex-shrink-0 ml-2">
                  <div className="font-mono font-bold text-white">${item.price}</div>
                  <div className="text-[10px] text-muted-foreground font-mono">${(item.price / 50).toFixed(2)}/wear</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 mb-5">
                {item.tags.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="bg-background/50 text-muted-foreground text-[9px] font-mono border-border px-1.5 py-0.5"
                  >
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border/50">
                <Button
                  data-testid={`analyze-btn-${item.id}`}
                  className="btn-liquid w-full font-mono tracking-widest text-[11px] h-10 border border-primary/50 hover:border-primary bg-transparent text-primary transition-all duration-300"
                  variant="outline"
                  onClick={() => onAnalyze(item)}
                >
                  ANALYZE VALUE
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
