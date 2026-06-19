import React, { useState, useRef, useEffect } from "react";
import { Bot, Send, Cloud, Sun, Shirt, Briefcase } from "lucide-react";
import { ClosetItem, closetItems } from "@/data/closetData";

interface Message {
  id: number;
  role: "user" | "ai" | "advisory";
  text: string;
  ts: string;
}

interface AIStylistProps {
  onHighlightBrands: (brands: string[]) => void;
  onNavigateToDashboard: () => void;
  onSelectItem: (item: ClosetItem) => void;
}

function getAIReply(input: string): string {
  const msg = input.toLowerCase();
  if (msg.includes("streetwear") || msg.includes("nike") || msg.includes("casual") || msg.includes("hoodie")) {
    return "For a clean streetwear look, pair that Nike Tech Hoodie with the Adidas Track Pants and Air Max sneakers to keep the silhouette sleek and athletic.";
  }
  if (msg.includes("formal") || msg.includes("zara") || msg.includes("blazer")) {
    return "Elevate your style by pairing the Zara Slim Blazer with clean minimalist basics. This balances comfort with a high-end, tailored aesthetic.";
  }
  if (msg.includes("adidas") || msg.includes("track") || msg.includes("pants")) {
    return "The Adidas Track Pants are incredibly versatile — style them with a fitted turtleneck or an oversized hoodie for that athleisure-meets-luxury edge.";
  }
  if (msg.includes("shein") || msg.includes("budget") || msg.includes("cargo")) {
    return "Smart move. Shein's Cargo Pants are a high-value foundation piece. Layer with a Nike hoodie or Zara blazer above to balance the budget-luxury ratio and maximize your Value Optimizer score.";
  }
  if (msg.includes("outfit") || msg.includes("wear") || msg.includes("style") || msg.includes("look")) {
    return "Try mixing high-low fashion! Pair your premium pieces (like Nike or Zara) with casual basics (like Shein) to maximize your Value Optimizer score.";
  }
  return "Try mixing high-low fashion! Pair your premium pieces (like Nike or Zara) with casual basics (like Shein) to maximize your Value Optimizer score. Contrast creates visual interest — a $150 sneaker elevates an $18 cargo pant instantly.";
}

const WEATHER_ADVISORIES: Record<string, string> = {
  rainy: "Rainy Day Advisory: Shein synthetic fabrics repel light rain but trap moisture in prolonged exposure. Nike's Tech Fleece and Zara's structured blazer work best over a waterproof layer. Avoid Adidas Track Pants in heavy rain — absorb water quickly.",
  heatwave: "Heatwave Advisory: Shein synthetic fabrics have low breathability and trap heat — avoid in temperatures above 28°C. Nike Tech Fleece uses moisture-wicking technology. Adidas Track Pants with mesh panels perform well. Opt for light layers and avoid dark synthetics.",
};

type OccasionKey = "streetwear" | "formal" | "rainy" | "heatwave";

const OCCASION_CHIPS: { key: OccasionKey; label: string; icon: React.ReactNode }[] = [
  { key: "streetwear", label: "Streetwear", icon: <Shirt className="w-3 h-3" /> },
  { key: "formal", label: "Formal", icon: <Briefcase className="w-3 h-3" /> },
  { key: "rainy", label: "Rainy Day", icon: <Cloud className="w-3 h-3" /> },
  { key: "heatwave", label: "Heatwave", icon: <Sun className="w-3 h-3" /> },
];

export function AIStylist({ onHighlightBrands, onNavigateToDashboard, onSelectItem }: AIStylistProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 0,
      role: "ai",
      text: "Trueform AI online. Ask me about outfits, or tap an occasion chip to get instant style guidance.",
      ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [activeOccasion, setActiveOccasion] = useState<OccasionKey | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const addMessage = (msg: Omit<Message, "id" | "ts">) => {
    setMessages(prev => [...prev, { ...msg, id: Date.now() + Math.random(), ts: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }) }]);
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    addMessage({ role: "user", text: text.trim() });
    setInput("");
    setIsTyping(true);
    setTimeout(() => {
      const reply = getAIReply(text);
      setIsTyping(false);
      addMessage({ role: "ai", text: `Trueform AI: ${reply}` });
    }, 850 + Math.random() * 300);
  };

  const handleOccasionChip = (key: OccasionKey) => {
    setActiveOccasion(prev => prev === key ? null : key);

    if (key === "streetwear") {
      onHighlightBrands(["Nike", "Adidas"]);
      const nikeHoodie = closetItems.find(i => i.name.toLowerCase().includes("hoodie"));
      if (nikeHoodie) onSelectItem(nikeHoodie);
      send("Show me a streetwear combination.");
    } else if (key === "formal") {
      onHighlightBrands(["Zara"]);
      const zaraBlazer = closetItems.find(i => i.name.toLowerCase().includes("blazer"));
      if (zaraBlazer) onSelectItem(zaraBlazer);
      send("How should I style this formal piece?");
    } else if (key === "rainy" || key === "heatwave") {
      onHighlightBrands([]);
      addMessage({ role: "advisory", text: WEATHER_ADVISORIES[key] });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // clear any occasion highlights when user manually types
    onHighlightBrands([]);
    send(input);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 gap-4 overflow-hidden">

      {/* Header */}
      <div className="flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/20 border border-primary/30 flex items-center justify-center shadow-[0_0_16px_rgba(139,92,246,0.25)]">
            <Bot className="w-5 h-5 text-primary" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-white">TRUEFORM AI STYLIST</h2>
            <div className="flex items-center gap-2 mt-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#00ff00] animate-pulse shadow-[0_0_6px_#00ff00]" />
              <span className="text-[10px] font-mono text-muted-foreground tracking-widest">INTELLIGENCE ONLINE</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => { onHighlightBrands([]); onNavigateToDashboard(); }}
          className="btn-liquid px-3 py-1.5 rounded-lg border border-border bg-card/50 text-[11px] font-mono text-muted-foreground hover:text-white hover:border-primary/40 transition-all"
        >
          VIEW ON MANNEQUIN
        </button>
      </div>

      {/* Occasion chips */}
      <div className="flex gap-2 flex-wrap flex-shrink-0">
        {OCCASION_CHIPS.map(({ key, label, icon }) => (
          <button
            key={key}
            data-testid={`occasion-chip-${key}`}
            onClick={() => handleOccasionChip(key)}
            className={`btn-liquid flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-mono tracking-wider transition-all duration-300
              ${activeOccasion === key
                ? "border-primary bg-primary/15 text-primary shadow-[0_0_12px_rgba(139,92,246,0.3)]"
                : "border-border bg-card/50 text-muted-foreground hover:text-white hover:border-primary/40"
              }`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Chat window */}
      <div className="flex-1 min-h-0 rounded-xl border border-primary/15 overflow-hidden flex flex-col bg-black/30">
        <div className="flex items-center gap-2 px-4 py-2.5 bg-card/80 border-b border-border/50 flex-shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-red-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-yellow-500/60" />
            <div className="w-2.5 h-2.5 rounded-full bg-[#00ff00]/60" />
          </div>
          <span className="font-mono text-[10px] text-muted-foreground tracking-widest ml-2">STYLE SESSION</span>
          {activeOccasion && (
            <span className="ml-auto font-mono text-[9px] text-primary tracking-widest uppercase">
              {activeOccasion} mode
            </span>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map(msg => {
            if (msg.role === "advisory") {
              return (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-7 h-7 rounded-lg bg-yellow-500/20 border border-yellow-500/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Cloud className="w-3.5 h-3.5 text-yellow-400" />
                  </div>
                  <div className="max-w-[80%] flex flex-col gap-1">
                    <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-yellow-500/10 border border-yellow-500/25 text-sm leading-relaxed text-yellow-200/90">
                      <span className="font-bold font-mono text-yellow-400 text-[10px] tracking-widest block mb-1">FABRIC ADVISORY</span>
                      {msg.text}
                    </div>
                    <span className="font-mono text-[9px] text-muted-foreground px-1">{msg.ts}</span>
                  </div>
                </div>
              );
            }

            return (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} gap-3`}>
                {msg.role === "ai" && (
                  <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-3.5 h-3.5 text-primary" />
                  </div>
                )}
                <div className={`max-w-[75%] flex flex-col gap-1 ${msg.role === "user" ? "items-end" : "items-start"}`}>
                  <div className={`px-4 py-3 rounded-xl text-sm leading-relaxed font-sans ${
                    msg.role === "user"
                      ? "bg-primary/20 border border-primary/30 text-white rounded-tr-sm"
                      : "bg-card border border-border text-foreground/90 rounded-tl-sm"
                  }`}>
                    {msg.text}
                  </div>
                  <span className="font-mono text-[9px] text-muted-foreground px-1">{msg.ts}</span>
                </div>
                {msg.role === "user" && (
                  <div className="w-7 h-7 rounded-lg bg-secondary border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="font-mono text-[9px] text-muted-foreground">YOU</span>
                  </div>
                )}
              </div>
            );
          })}

          {isTyping && (
            <div className="flex justify-start gap-3">
              <div className="w-7 h-7 rounded-lg bg-primary/20 border border-primary/30 flex items-center justify-center flex-shrink-0">
                <Bot className="w-3.5 h-3.5 text-primary" />
              </div>
              <div className="px-4 py-3 rounded-xl rounded-tl-sm bg-card border border-border">
                <div className="flex items-center gap-1.5">
                  {[0, 1, 2].map(i => (
                    <div key={i} className="w-1.5 h-1.5 rounded-full bg-primary animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
                  ))}
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0 p-4 border-t border-border/50 bg-card/30">
          <form onSubmit={handleSubmit} className="flex gap-3 items-center">
            <input
              data-testid="stylist-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Ask about Nike, blazers, casual looks..."
              className="flex-1 bg-input border border-border rounded-xl px-4 py-3 text-sm font-sans text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary/60 focus:ring-1 focus:ring-primary/30 transition-all duration-200"
            />
            <button
              type="submit"
              data-testid="stylist-send"
              disabled={!input.trim() || isTyping}
              className="btn-liquid w-11 h-11 rounded-xl bg-primary flex items-center justify-center disabled:opacity-40 disabled:pointer-events-none flex-shrink-0"
            >
              <Send className="w-4 h-4 text-primary-foreground" />
            </button>
          </form>
          <p className="text-[10px] font-mono text-muted-foreground mt-2 text-center tracking-wider">
            Tap an occasion chip or type: "Nike", "Zara blazer", "formal", "budget"
          </p>
        </div>
      </div>
    </div>
  );
}
