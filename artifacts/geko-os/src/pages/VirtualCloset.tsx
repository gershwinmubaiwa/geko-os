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
        <h2 className="text-2xl font-bold tracking-tight text-white">VIRTUAL CLOSET</h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {closetItems.map((item) => (
          <Card key={item.id} className="border-border bg-card hover:border-primary/50 transition-all duration-300 group shadow-lg hover:shadow-[0_0_30px_rgba(0,229,255,0.15)] flex flex-col overflow-hidden">
            <div 
              className="h-40 w-full relative flex items-center justify-center border-b border-border/50"
              style={{ backgroundColor: item.color }}
            >
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent mix-blend-overlay"></div>
              <Shirt className="w-16 h-16 text-white/20" />
            </div>
            
            <CardContent className="p-5 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <div className="text-xs font-mono text-primary mb-1 tracking-widest">{item.brand.toUpperCase()}</div>
                  <h3 className="text-lg font-bold text-white leading-tight">{item.name}</h3>
                </div>
                <div className="text-right">
                  <div className="font-mono font-bold text-white">${item.price}</div>
                  <div className="text-[10px] text-muted-foreground uppercase">{item.category}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mt-4 mb-6">
                {item.tags.map((tag) => (
                  <Badge key={tag} variant="outline" className="bg-background/50 text-muted-foreground text-[10px] font-mono border-border">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="mt-auto pt-4 border-t border-border/50">
                <Button 
                  className="w-full font-mono tracking-widest text-xs h-10 border border-primary/50 hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                  variant="outline"
                  onClick={() => onAnalyze(item)}
                >
                  ANALYZE
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
