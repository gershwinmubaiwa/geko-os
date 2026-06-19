import React, { useState } from "react";
import { MannequinCanvas, MannequinData } from "@/components/MannequinCanvas";
import { Slider } from "@/components/ui/slider";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

interface DashboardProps {
  mannequinData: MannequinData;
  setMannequinData: React.Dispatch<React.SetStateAction<MannequinData>>;
}

export function Dashboard({ mannequinData, setMannequinData }: DashboardProps) {
  const handleSliderChange = (key: keyof MannequinData, value: number) => {
    setMannequinData((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="flex w-full h-full p-6 gap-6">
      <div className="w-[60%] h-full relative group shadow-[0_0_40px_rgba(0,229,255,0.05)] rounded-xl">
        <div className="absolute top-4 left-4 z-10 px-3 py-1 bg-card/80 backdrop-blur border border-primary/20 rounded-md shadow-sm">
          <span className="text-xs font-mono text-primary tracking-widest">3D VIEWPORT</span>
        </div>
        <MannequinCanvas data={mannequinData} />
      </div>

      <div className="w-[40%] h-full flex flex-col gap-6">
        <h2 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
          BIOMETRIC CALIBRATION
          <div className="h-[2px] flex-1 bg-gradient-to-r from-primary/50 to-transparent ml-2" />
        </h2>

        <Card className="border-primary/20 bg-card/50 backdrop-blur shadow-[0_0_20px_rgba(0,0,0,0.5)]">
          <CardContent className="p-6 flex flex-col gap-6">
            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground font-mono text-xs tracking-wider">HEIGHT</Label>
                <span className="text-primary font-mono text-sm">{mannequinData.height} cm</span>
              </div>
              <Slider
                value={[mannequinData.height]}
                min={150}
                max={210}
                step={1}
                onValueChange={(val) => handleSliderChange("height", val[0])}
                className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground font-mono text-xs tracking-wider">SHOULDERS</Label>
                <span className="text-primary font-mono text-sm">{mannequinData.shoulders} cm</span>
              </div>
              <Slider
                value={[mannequinData.shoulders]}
                min={30}
                max={60}
                step={1}
                onValueChange={(val) => handleSliderChange("shoulders", val[0])}
                className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground font-mono text-xs tracking-wider">CHEST</Label>
                <span className="text-primary font-mono text-sm">{mannequinData.chest} cm</span>
              </div>
              <Slider
                value={[mannequinData.chest]}
                min={70}
                max={120}
                step={1}
                onValueChange={(val) => handleSliderChange("chest", val[0])}
                className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground font-mono text-xs tracking-wider">ARMS</Label>
                <span className="text-primary font-mono text-sm">{mannequinData.arms} cm</span>
              </div>
              <Slider
                value={[mannequinData.arms]}
                min={50}
                max={80}
                step={1}
                onValueChange={(val) => handleSliderChange("arms", val[0])}
                className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            </div>

            <div className="flex flex-col gap-3">
              <div className="flex justify-between items-center">
                <Label className="text-muted-foreground font-mono text-xs tracking-wider">WAIST</Label>
                <span className="text-primary font-mono text-sm">{mannequinData.waist} cm</span>
              </div>
              <Slider
                value={[mannequinData.waist]}
                min={60}
                max={110}
                step={1}
                onValueChange={(val) => handleSliderChange("waist", val[0])}
                className="[&>[role=slider]]:border-primary [&>[role=slider]]:shadow-[0_0_10px_rgba(0,229,255,0.5)]"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="border-border bg-card/30">
          <CardContent className="p-4 flex justify-between items-center">
            <span className="text-xs font-mono text-muted-foreground tracking-widest">BODY DATA</span>
            <div className="flex gap-4 font-mono text-xs text-foreground/80">
              <span>H:{mannequinData.height}</span>
              <span>S:{mannequinData.shoulders}</span>
              <span>C:{mannequinData.chest}</span>
              <span>A:{mannequinData.arms}</span>
              <span>W:{mannequinData.waist}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
