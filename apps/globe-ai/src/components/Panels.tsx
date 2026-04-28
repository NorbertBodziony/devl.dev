import { ActivityIcon, DatabaseIcon, RadioTowerIcon, TrendingUpIcon } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@orbit/ui/button";
import { Card } from "@orbit/ui/card";
import { fmtCompact, fmtUsd } from "@/lib/format";
import type { BlockEntry } from "@/lib/use-block-stream";

type BlockPanelProps = {
  blocks: BlockEntry[];
  compact?: boolean;
};

type MarketPanelProps = {
  protocolCount: number;
  compact?: boolean;
};

function latencyColor(value: number) {
  if (value < 620) return "latency-good";
  if (value < 980) return "latency-ok";
  return "latency-warn";
}

export function BlockHistoryPanel({ blocks, compact }: BlockPanelProps) {
  const latest = blocks[0];
  const visible = blocks.slice(0, compact ? 24 : 32).reverse();
  const avgLatency = useMemo(() => {
    if (visible.length === 0) return 0;
    return Math.round(
      visible.reduce((total, block) => total + block.finalityMs, 0) / visible.length,
    );
  }, [visible]);

  return (
    <Card className="data-panel block-panel" render={<aside />}>
      <div className="panel-header">
        <div className="panel-title">
          <span className="live-dot" />
          <span>Block Stream</span>
        </div>
        <span className="panel-kpi">#{latest?.blockNum.toLocaleString("en-US")}</span>
      </div>
      <div className="block-bars" aria-label="Recent blocks">
        {visible.map((block) => (
          <span
            key={block.id}
            className={`block-bar block-bar-${block.proposalResult}`}
            style={{ height: `${Math.max(18, block.loadPct * 0.42)}px` }}
            title={`${block.validator} / ${block.finalityMs}ms`}
          />
        ))}
      </div>
      <div className="panel-footer">
        <span>Avg latency</span>
        <strong className={latencyColor(avgLatency)}>{avgLatency} ms</strong>
      </div>
    </Card>
  );
}

export function MarketMetricsPanel({ protocolCount, compact }: MarketPanelProps) {
  const [tick, setTick] = useState(0);

  useEffect(() => {
    const interval = window.setInterval(() => setTick((value) => value + 1), 1100);
    return () => window.clearInterval(interval);
  }, []);

  const tvl = 62_460_000_000 + Math.sin(tick / 3) * 320_000_000;
  const volume = 14_240_000_000 + Math.cos(tick / 4) * 180_000_000;
  const tps = Math.round(3842 + Math.sin(tick / 2) * 420);

  return (
    <Card className="data-panel market-panel" render={<aside />}>
      <div className="panel-header">
        <div className="panel-title">
          <span className="live-dot" />
          <span>Live Markets</span>
        </div>
        <span className="panel-kpi">{protocolCount} Protocols</span>
      </div>
      <div className="metric-grid" data-compact={compact ? "" : undefined}>
        <Metric icon={<TrendingUpIcon />} label="Total TVL" value={fmtUsd(tvl)} delta="+1.84%" />
        <Metric icon={<DatabaseIcon />} label="24h Volume" value={fmtUsd(volume)} delta="-0.42%" />
        <Metric icon={<RadioTowerIcon />} label="Live TPS" value={fmtCompact(tps)} delta="rolling" />
      </div>
      <div className="panel-footer">
        <span>Mainnet</span>
        <strong>24h rolling</strong>
      </div>
    </Card>
  );
}

function Metric({
  icon,
  label,
  value,
  delta,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  delta: string;
}) {
  return (
    <div className="metric">
      <div className="metric-icon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
      <small>{delta}</small>
    </div>
  );
}

export function MobilePanelTabs({
  active,
  onChange,
}: {
  active: "blocks" | "markets" | null;
  onChange: (value: "blocks" | "markets" | null) => void;
}) {
  return (
    <div className="mobile-tabs">
      <Button
        type="button"
        variant={active === "blocks" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange(active === "blocks" ? null : "blocks")}
      >
        <ActivityIcon />
        Blocks
      </Button>
      <Button
        type="button"
        variant={active === "markets" ? "default" : "outline"}
        size="sm"
        onClick={() => onChange(active === "markets" ? null : "markets")}
      >
        <TrendingUpIcon />
        Markets
      </Button>
    </div>
  );
}
