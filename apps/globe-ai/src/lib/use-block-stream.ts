import { useEffect, useMemo, useRef, useState } from "react";
import { clamp } from "./format";

export type BlockEntry = {
  id: number;
  blockNum: number;
  time: string;
  validator: string;
  region: string;
  transactions: number;
  volumeUsd: number;
  finalityMs: number;
  loadPct: number;
  proposalResult: "success" | "failed" | "pending";
};

const VALIDATORS = [
  "Coinbase Cloud",
  "Figment",
  "Chorus One",
  "Everstake",
  "P2P Validator",
  "Stakely",
  "HashKey Cloud",
  "Luganodes",
];

const REGIONS = [
  "Frankfurt",
  "Warsaw",
  "Tokyo",
  "Singapore",
  "New York",
  "Sao Paulo",
  "Seoul",
  "London",
];

let blockNum = 248_239_398;
let loadPct = 68;
let finalityMs = 860;

function randBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pick<T>(items: T[]) {
  return items[Math.floor(Math.random() * items.length)]!;
}

function formatTime(date: Date) {
  return `${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes(),
  ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
}

function makeBlock(id: number): BlockEntry {
  blockNum += 1 + Math.floor(Math.random() * 3);
  loadPct = clamp(loadPct + randBetween(-9, 10), 24, 97);
  finalityMs = clamp(finalityMs + randBetween(-120, 120), 420, 1420);

  return {
    id,
    blockNum,
    time: formatTime(new Date()),
    validator: pick(VALIDATORS),
    region: pick(REGIONS),
    transactions: Math.floor(1_600 + loadPct * 88 + randBetween(-620, 880)),
    volumeUsd: 2_400_000 + loadPct * 510_000 + randBetween(-1_200_000, 3_400_000),
    finalityMs: Math.round(finalityMs),
    loadPct: Math.round(loadPct),
    proposalResult:
      Math.random() < 0.72 ? "success" : Math.random() < 0.55 ? "failed" : "pending",
  };
}

export function useBlockStream() {
  const nextIdRef = useRef(41);
  const [blocks, setBlocks] = useState<BlockEntry[]>(() =>
    Array.from({ length: 40 }, (_, index) => makeBlock(index + 1)).reverse(),
  );

  useEffect(() => {
    const interval = window.setInterval(() => {
      const nextId = nextIdRef.current;
      nextIdRef.current += 1;
      setBlocks((current) => [makeBlock(nextId), ...current].slice(0, 48));
    }, 1250);

    return () => window.clearInterval(interval);
  }, []);

  return useMemo(() => ({ blocks }), [blocks]);
}
