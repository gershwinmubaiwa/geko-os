import React from "react";
import { MannequinCanvas, MannequinData } from "@/components/MannequinCanvas";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { closetItems, ClosetItem } from "@/data/closetData";

interface DashboardProps {
  mannequinData: MannequinData;
  setMannequinData: React.Dispatch<React.SetStateAction<MannequinData>>;
  onSelectItem: (item: ClosetItem) => void;
  selectedItemId: string | null;
}

export function Dashboard({ mannequinData, setMannequinData, onSelectItem, selectedItemId }: DashboardProps) {
  const handleSliderChange = (key: keyof MannequinData, value: number) => {
    setMannequinData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full h-full p-5 gap-4 overflow-hidden">

      {/* 3D Viewport */}
      <div className="w-[40%] h-full relative group rounded-xl shadow-[0_0_40px_rgba(139,92,246,0.06)]">
        <div className="absolute top-3 left-3 z-10 px-3 py-1 bg-card/80 backdrop-blur border border-primary/30 rounded-md shadow-sm">
          <span className="text-xs font-mono text-primary tracking-widest">3D VIEWPORT</span>
        </div>
        <MannequinCanvas data={mannequinData} />
      </div>

      {/* Brand Catalog */}
      <div className="w-[33%] h-full flex flex-col gap-3 overflow-hidden">
        <h2 className="text-sm font-bold tracking-[0.2em] text-white flex items-center gap-2 flex-shrink-0">
          BRAND CATALOG
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </h2>

        <div className="flex-1 overflow-y-auto grid grid-cols-2 gap-3 pr-1 content-start">
          {closetItems.map((item) => {
            const isSelected = selectedItemId === item.id;
            return (
              <button
                key={item.id}
                data-testid={`catalog-item-${item.id}`}
                onClick={() => onSelectItem(item)}
                className={`btn-liquid relative group text-left rounded-xl border overflow-hidden transition-all duration-300 flex flex-col
                  ${isSelected
                    ? "border-primary shadow-[0_0_20px_rgba(139,92,246,0.3)] bg-primary/10"
                    : "border-border bg-card hover:border-primary/40 hover:bg-card/80"
                  }`}
              >
                {/* Item image */}
                <div className="w-full aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = "none";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_6px_rgba(139,92,246,0.8)]" />
                  )}
                </div>

                {/* Info */}
                <div className="p-2.5">
                  <div className="text-[9px] font-mono text-muted-foreground tracking-widest mb-0.5">{item.brand.toUpperCase()}</div>
                  <div className="text-xs font-bold text-white leading-tight truncate">{item.name}</div>
                  <div className="font-mono text-[11px] mt-1" style={{ color: item.accentColor }}>${item.price}</div>
                </div>
              </button>
            );
          })}
        </div>

        {selectedItemId && (
          <div className="flex-shrink-0 p-3 rounded-lg border border-primary/20 bg-primary/5 font-mono text-[10px] text-muted-foreground tracking-wider">
            ITEM APPLIED TO MANNEQUIN
          </div>
        )}
      </div>

      {/* Biometric Sliders */}
      <div className="w-[27%] h-full flex flex-col gap-4 overflow-hidden">
        <h2 className="text-sm font-bold tracking-[0.2em] text-white flex items-center gap-2 flex-shrink-0">
          BIOMETRICS
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 to-transparent" />
        </h2>

        <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.5)] flex-1 overflow-hidden">
          <CardContent className="p-5 flex flex-col gap-5 h-full overflow-y-auto">
            {[
              { key: "height" as const, label: "HEIGHT", min: 150, max: 210, unit: "cm" },
              { key: "shoulders" as const, label: "SHOULDERS", min: 30, max: 60, unit: "cm" },
              { key: "chest" as const, label: "CHEST", min: 70, max: 120, unit: "cm" },
              { key: "arms" as const, label: "ARMS", min: 50, max: 80, unit: "cm" },
              { key: "waist" as const, label: "WAIST", min: 60, max: 110, unit: "cm" },
            ].map(({ key, label, min, max, unit }) => (
              <div key={key} className="flex flex-col gap-2.5">
                <div className="flex justify-between items-center">
                  <Label className="text-muted-foreground font-mono text-[10px] tracking-widest">{label}</Label>
                  <span className="text-primary font-mono text-xs">{mannequinData[key]} {unit}</span>
                </div>
                <Slider
                  value={[mannequinData[key] as number]}
                  min={min}
                  max={max}
                  step={1}
                  onValueChange={(val) => handleSliderChange(key, val[0])}
                  className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(139,92,246,0.5)]"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-border bg-card/30 flex-shrink-0">
          <CardContent className="p-3 flex flex-wrap gap-x-3 gap-y-1">
            <span className="text-[10px] font-mono text-muted-foreground tracking-widest w-full mb-1">BODY DATA</span>
            {["height", "shoulders", "chest", "arms", "waist"].map((k) => (
              <span key={k} className="font-mono text-[10px] text-foreground/70">
                {k[0].toUpperCase()}:{mannequinData[k as keyof MannequinData]}
              </span>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
