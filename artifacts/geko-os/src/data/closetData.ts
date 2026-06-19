import { closetItems } from "@/data/closetData";

export type ClosetItem = typeof closetItems[0];

export const closetItems = [
  {
    id: "1",
    name: "Obsidian Overcoat",
    brand: "Maison Noir",
    category: "Outerwear",
    price: 2800,
    budgetAlternative: { name: "Urban Shield Coat", brand: "Zara", price: 149 },
    color: "#1a1a2e",
    accentColor: "#4fc3f7",
    tags: ["Luxury", "Winter", "Formal"],
  },
  {
    id: "2",
    name: "Carbon Fiber Blazer",
    brand: "Rick Owens",
    category: "Blazers",
    price: 1950,
    budgetAlternative: { name: "Structured Blazer", brand: "H&M", price: 89 },
    color: "#16213e",
    accentColor: "#a78bfa",
    tags: ["Statement", "Work", "Evening"],
  },
  {
    id: "3",
    name: "Stealth Turtleneck",
    brand: "Bottega Veneta",
    category: "Tops",
    price: 890,
    budgetAlternative: { name: "Merino Turtleneck", brand: "Uniqlo", price: 49 },
    color: "#0f3460",
    accentColor: "#34d399",
    tags: ["Minimal", "Versatile", "Essentials"],
  },
];
