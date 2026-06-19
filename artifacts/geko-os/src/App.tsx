import React, { useState } from "react";
import { LayoutDashboard, Shirt, TrendingUp, Terminal } from "lucide-react";
import { Dashboard } from "@/pages/Dashboard";
import { VirtualCloset } from "@/pages/VirtualCloset";
import { ValueOptimizer } from "@/pages/ValueOptimizer";
import { TheHub } from "@/pages/TheHub";
import { ClosetItem } from "@/data/closetData";
import { MannequinData } from "@/components/MannequinCanvas";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

type Tab = "dashboard" | "closet" | "optimizer" | "hub";

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [selectedItem, setSelectedItem] = useState<ClosetItem | null>(null);
  
  const [mannequinData, setMannequinData] = useState<MannequinData>({
    height: 175,
    shoulders: 44,
    chest: 92,
    arms: 62,
    waist: 80,
    color: "#2a2a3a"
  });

  const handleAnalyze = (item: ClosetItem) => {
    setSelectedItem(item);
    setActiveTab("optimizer");
    setMannequinData(prev => ({ ...prev, color: item.color }));
  };

  const handleTryOn = () => {
    if (selectedItem) {
      setMannequinData(prev => ({ ...prev, color: selectedItem.color }));
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background text-foreground overflow-hidden selection:bg-primary/30">
      
      {/* Sidebar */}
      <div className="w-64 h-full bg-sidebar border-r border-sidebar-border flex flex-col z-20 shadow-[4px_0_24px_rgba(0,0,0,0.5)]">
        <div className="h-20 flex items-center px-6 border-b border-sidebar-border">
          <div className="flex items-center gap-3 group cursor-default">
            <div className="w-8 h-8 bg-primary flex items-center justify-center rounded-sm shadow-[0_0_12px_rgba(0,229,255,0.4)] group-hover:shadow-[0_0_20px_rgba(0,229,255,0.6)] transition-all">
              <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-sidebar" stroke="currentColor" strokeWidth="2">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
              </svg>
            </div>
            <h1 className="font-mono font-bold text-lg tracking-[0.2em] text-white">GEKO<span className="text-primary">OS</span></h1>
          </div>
        </div>

        <div className="flex-1 py-6 px-4 flex flex-col gap-2">
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
              <AvatarFallback className="bg-primary/20 text-primary font-mono text-xs">AG</AvatarFallback>
            </Avatar>
            <div className="flex flex-col">
              <span className="text-xs font-bold text-white font-mono">A. GUEST</span>
              <span className="text-[10px] text-muted-foreground font-mono">CURATOR</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 h-screen relative bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-card via-background to-background overflow-hidden">
        {/* Subtle grid background for the entire app area */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />
        
        <main className="relative z-10 w-full h-full">
          {activeTab === "dashboard" && <Dashboard mannequinData={mannequinData} setMannequinData={setMannequinData} />}
          {activeTab === "closet" && <VirtualCloset onAnalyze={handleAnalyze} />}
          {activeTab === "optimizer" && <ValueOptimizer selectedItem={selectedItem} onTryOn={handleTryOn} />}
          {activeTab === "hub" && <TheHub />}
        </main>
      </div>
    </div>
  );
}

function NavItem({ icon, label, isActive, onClick }: { icon: React.ReactNode, label: string, isActive: boolean, onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-300 font-mono text-xs tracking-wider border-l-2
        ${isActive 
          ? 'bg-sidebar-accent text-primary border-primary shadow-[inset_4px_0_10px_rgba(0,229,255,0.1)]' 
          : 'border-transparent text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-white'
        }`}
    >
      <div className={`w-5 h-5 ${isActive ? 'text-primary drop-shadow-[0_0_8px_rgba(0,229,255,0.8)]' : 'text-muted-foreground'}`}>
        {icon}
      </div>
      {label}
    </button>
  );
}
