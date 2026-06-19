import React, { useState } from "react";
import { LayoutDashboard, Shirt, TrendingUp, Terminal, Bot } from "lucide-react";
import { Dashboard } from "@/pages/Dashboard";
import { VirtualCloset } from "@/pages/VirtualCloset";
import { ValueOptimizer } from "@/pages/ValueOptimizer";
import { TheHub } from "@/pages/TheHub";
import { AIStylist } from "@/pages/AIStylist";
import { ClosetItem } from "@/data/closetData";
import { MannequinData } from "@/components/MannequinCanvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tab = "dashboard" | "closet" | "optimizer" | "stylist" | "hub";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);

  const [mannequinData, setMannequinData] = useState<MannequinData>({
    height: 175,
    shoulders: 44,
    chest: 92,
    arms: 62,
    waist: 80,
    color: "#2a2a3a",
  });

  const handleAnalyze = (item: ClosetItem) => {
    setSelectedItem(item);
    setActiveTab("optimizer");
    setMannequinData((prev) => ({ ...prev, color: item.color }));
  };

  const handleSelectItem = (item: ClosetItem) => {
    setSelectedItem(item);
    setMannequinData((prev) => ({ ...prev, color: item.color }));
  };

  const handleTryOn = () => {
    if (selectedItem) {
      setMannequinData((prev) => ({ ...prev, color: selectedItem.color }));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden selection:bg-primary/30">

      {/* Sidebar */}
      <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col z-20 shadow-[4px_0_32px_rgba(0,0,0,0.6)]">
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm glow-violet transition-all group-hover:scale-105">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="font-mono font-bold text-lg tracking-[0.2em] text-white">
              TRUE<span className="text-primary">form</span>
            </h1>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-1">
          <NavItem
            icon={<LayoutDashboard />}
            label="DASHBOARD"
            isActive={activeTab === "dashboard"}
            onClick={() => setActiveTab("dashboard")}
          />
          <NavItem
            icon={<Shirt />}
            label="VIRTUAL CLOSET"
            isActive={activeTab === "closet"}
            onClick={() => setActiveTab("closet")}
          />
          <NavItem
            icon={<TrendingUp />}
            label="VALUE OPTIMIZER"
            isActive={activeTab === "optimizer"}
            onClick={() => setActiveTab("optimizer")}
          />
          <NavItem
            icon={<Bot />}
            label="AI STYLIST"
            isActive={activeTab === "stylist"}
            onClick={() => setActiveTab("stylist")}
          />

          <div className="h-px bg-border/50 my-2" />

          <NavItem
            icon={<Terminal />}
            label="THE HUB"
            isActive={activeTab === "hub"}
            onClick={() => setActiveTab("hub")}
          />
        </div>

        <div className="p-4 border-t border-sidebar-border bg-sidebar/50">
          <div className="flex items-center gap-3 mb-4 px-2">
            <div className="w-2 h-2 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_8px_#00ff00]" />
            <span className="text-[10px] font-mono tracking-widest text-muted-foreground">SYSTEM ONLINE</span>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-md hover:bg-sidebar-accent cursor-pointer transition-colors">
            <Avatar className="h-9 w-9 border border-border">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/20 text-primary font-mono text-xs">TF</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white font-mono">A. GUEST</span>
              <span className="text-[10px] text-muted-foreground font-mono">CURATOR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen relative overflow-hidden" style={{ background: "radial-gradient(ellipse at 80% 0%, rgba(139,92,246,0.06) 0%, transparent 60%), hsl(220 13% 4%)" }}>
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff08_1px,transparent_1px),linear-gradient(to_bottom,#ffffff08_1px,transparent_1px)] bg-[size:28px_28px] pointer-events-none" />

        <main className="relative z-10 w-full h-full">
          {activeTab === "dashboard" && (
            <Dashboard
              mannequinData={mannequinData}
              setMannequinData={setMannequinData}
              onSelectItem={handleSelectItem}
              selectedItemId={selectedItem?.id ?? null}
            />
          )}
          {activeTab === "closet" && <VirtualCloset onAnalyze={handleAnalyze} />}
          {activeTab === "optimizer" && (
            <ValueOptimizer selectedItem={selectedItem} onTryOn={handleTryOn} />
          )}
          {activeTab === "stylist" && <AIStylist />}
          {activeTab === "hub" && <TheHub />}
        </main>
      </div>
    </div>
  );
}

function NavItem({
  icon,
  label,
  isActive,
  onClick,
}: {
  icon: React.ReactNode;
  label: string;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      data-testid={`nav-${label.toLowerCase().replace(/\s+/g, "-")}`}
      className={`btn-liquid w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 font-mono text-xs tracking-wider border-l-2
        ${isActive
          ? "bg-primary/10 text-primary border-primary shadow-[inset_4px_0_12px_rgba(139,92,246,0.12)]"
          : "border-transparent text-sidebar-foreground hover:bg-sidebar-accent/60 hover:text-white"
        }`}
    >
      <div
        className={`w-5 h-5 flex-shrink-0 ${
          isActive
            ? "text-primary drop-shadow-[0_0_8px_rgba(139,92,246,0.9)]"
            : "text-muted-foreground"
        }`}
      >
        {icon}
      </div>
      {label}
    </button>
  );
}
