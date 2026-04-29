import { useCallback, useMemo, useRef, useState } from "react";
import {
  ArrowDownRightIcon,
  ArrowUpRightIcon,
  BookmarkIcon,
  ChevronDownIcon,
  CopyIcon,
  ExternalLinkIcon,
  GemIcon,
  LandmarkIcon,
  SearchIcon,
  SparklesIcon,
  TelescopeIcon,
  WalletIcon,
  WavesIcon,
} from "lucide-react";
import { Cell, Pie, PieChart } from "recharts";
import {
  Accordion,
  AccordionItem,
  AccordionPanel,
  AccordionTrigger,
} from "@orbit/ui/accordion";
import { Badge } from "@orbit/ui/badge";
import { Button } from "@orbit/ui/button";
import { Card } from "@orbit/ui/card";
import { ParticleField } from "@orbit/ui/particle-field";
import {
  Collapsible,
  CollapsiblePanel,
  CollapsibleTrigger,
} from "@orbit/ui/collapsible";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@orbit/ui/empty";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@orbit/ui/input-group";
import { Separator } from "@orbit/ui/separator";
import {
  ChartContainer,
  ChartTooltip,
} from "@orbit/ui/patterns/charts/chart";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@orbit/ui/table";
import { toastManager } from "@orbit/ui/toast";
import dustyFieldSrc from "../../../../packages/ui/src/assets/figures/dusty-field.png";
import {
  type AllocationKind,
  type DefiGroupKind,
  formatPct,
  formatUsd,
  formatUsdCompact,
  formatUsdDelta,
  PORTFOLIO_MOCK,
  shortenAddress,
} from "@/lib/portfolio-mock";

function copyToClipboard(value: string) {
  if (typeof navigator === "undefined" || !navigator.clipboard) return;
  navigator.clipboard
    .writeText(value)
    .then(() => {
      toastManager.add({
        id: `clipboard-${Date.now()}`,
        title: "Address copied",
        description: shortenAddress(value),
        type: "info",
        timeout: 2500,
      });
    })
    .catch(() => {
      // ignore — toast omitted on failure
    });
}

function deltaColorClasses(value: number) {
  if (value > 0) return "text-emerald-600 dark:text-emerald-400";
  if (value < 0) return "text-rose-600 dark:text-rose-400";
  return "text-muted-foreground";
}

function defiKindClasses(kind: DefiGroupKind): string {
  switch (kind) {
    case "Lending":
      return "border-rose-500/40 bg-rose-500/8 text-rose-600 dark:text-rose-400";
    case "Liquidity":
      return "border-emerald-500/40 bg-emerald-500/8 text-emerald-600 dark:text-emerald-400";
    case "Staking":
      return "border-sky-500/40 bg-sky-500/8 text-sky-600 dark:text-sky-400";
  }
}

function AddressChip({
  address,
  className,
}: {
  address: string;
  className?: string;
}) {
  return (
    <span
      className={
        "inline-flex h-7 items-center gap-1.5 rounded-full border border-border/60 bg-background/55 px-2.5 font-mono text-[11px] text-muted-foreground " +
        (className ?? "")
      }
    >
      <span>{shortenAddress(address)}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          copyToClipboard(address);
        }}
        aria-label="Copy address"
        className="grid size-4 place-items-center rounded text-muted-foreground transition-colors hover:bg-foreground/10 hover:text-foreground"
      >
        <CopyIcon className="size-3" />
      </button>
    </span>
  );
}

function SearchAddressInput({
  size = "default",
  onSubmit,
}: {
  size?: "default" | "sm";
  onSubmit: (address: string) => void;
}) {
  const [value, setValue] = useState("");

  return (
    <form
      className={size === "sm" ? "w-full max-w-sm" : "w-full"}
      onSubmit={(e) => {
        e.preventDefault();
        if (value.trim()) {
          onSubmit(value.trim());
          setValue("");
        }
      }}
    >
      <InputGroup
        className={
          "rounded-full border-border/70 bg-background/55 p-1 shadow-[0_1px_0_0_color-mix(in_oklab,var(--foreground)_8%,transparent)_inset,0_16px_40px_-26px_color-mix(in_oklab,var(--foreground)_55%,transparent)] backdrop-blur-xl transition-[background-color,border-color,box-shadow] hover:border-border hover:bg-background/65 focus-within:border-ring/70 focus-within:bg-background/70 focus-within:shadow-[0_0_0_3px_color-mix(in_oklab,var(--ring)_22%,transparent),0_18px_46px_-26px_color-mix(in_oklab,var(--foreground)_65%,transparent)] " +
          (size === "sm" ? "h-10 text-sm" : "h-14 text-base")
        }
      >
        <InputGroupInput
          aria-label="Wallet address"
          placeholder={size === "sm" ? "Search address" : "Search wallet address"}
          type="search"
          value={value}
          className={
            "h-full min-w-0 bg-transparent px-2 placeholder:text-muted-foreground/70 " +
            (size === "sm" ? "text-sm" : "text-[15px]")
          }
          onChange={(e) => setValue(e.target.value)}
        />
        <InputGroupAddon align="inline-start" className="ps-3">
          <span
            aria-hidden
            className={
              "grid shrink-0 place-items-center rounded-full border border-border/55 bg-foreground/[0.04] text-muted-foreground " +
              (size === "sm" ? "size-6" : "size-8")
            }
          >
            <SearchIcon className={size === "sm" ? "size-3.5" : "size-4"} />
          </span>
        </InputGroupAddon>
        <InputGroupAddon align="inline-end" className="pe-1.5 has-[>button]:me-0">
          <Button
            type="submit"
            size={size === "sm" ? "sm" : "default"}
            variant="default"
            className={
              "rounded-full px-4 shadow-[0_8px_20px_-12px_color-mix(in_oklab,var(--foreground)_70%,transparent)] disabled:shadow-none " +
              (size === "sm" ? "h-8" : "h-11 min-w-16")
            }
            disabled={!value.trim()}
          >
            Go
          </Button>
        </InputGroupAddon>
      </InputGroup>
    </form>
  );
}

type SampleWallet = {
  label: string;
  hint: string;
  address: string;
  icon: React.ComponentType<{ className?: string }>;
  accent: string;
};

const SAMPLE_WALLETS: SampleWallet[] = [
  {
    label: "Jupiter treasury",
    hint: "DEX aggregator",
    address: "JUPNkE4hwETjJv8b6m4tKoNxFa2rDkRNWUfj1qZHnXq",
    icon: GemIcon,
    accent: "var(--chart-1)",
  },
  {
    label: "Marinade whale",
    hint: "Liquid staking",
    address: "MarbmsVGz6dD7C7xJ8E2YfCXkRq1L2vG2fH9pYzAaQX",
    icon: WavesIcon,
    accent: "var(--chart-3)",
  },
  {
    label: "Kamino vault",
    hint: "Lending position",
    address: "Kvau9ZA1n3pEr8tQ4nM5gBz2Lh6jRwS9bC3dV1xY7uK",
    icon: LandmarkIcon,
    accent: "var(--chart-5)",
  },
];

function PortfolioEmptyBackground() {
  const typingImpulse = useRef(0);

  return (
    <div aria-hidden className="absolute inset-0 overflow-hidden">
      <ParticleField
        src={dustyFieldSrc}
        sampleStep={2}
        threshold={48}
        dotSize={0.9}
        renderScale={1}
        align="center"
        mouseForce={120}
        mouseRadius={140}
        typingImpulseRef={typingImpulse}
        trackPointerAcrossPage
      />

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(1200px 800px at 50% 45%, transparent 35%, color-mix(in srgb, var(--background) 80%, transparent) 95%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-[60%]"
        style={{
          background:
            "linear-gradient(to bottom, transparent 0%, color-mix(in srgb, var(--background) 50%, transparent) 35%, color-mix(in srgb, var(--background) 90%, transparent) 70%, var(--background) 100%)",
        }}
      />
    </div>
  );
}

function SampleWalletCard({
  wallet,
  onPick,
}: {
  wallet: SampleWallet;
  onPick: (addr: string) => void;
}) {
  const Icon = wallet.icon;
  return (
    <button
      type="button"
      onClick={() => onPick(wallet.address)}
      className="group relative flex flex-col gap-3 rounded-xl border border-border/60 bg-background/40 p-4 text-left backdrop-blur-md transition-all hover:-translate-y-0.5 hover:border-border hover:bg-background/60 hover:shadow-[0_8px_28px_-16px_color-mix(in_oklab,var(--foreground)_45%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-border to-transparent opacity-60"
      />
      <div className="flex items-center justify-between">
        <span
          className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/60 text-foreground/80 transition-colors group-hover:text-foreground"
          style={{
            background: `linear-gradient(135deg, color-mix(in oklab, ${wallet.accent} 28%, transparent), transparent)`,
          }}
        >
          <Icon className="size-4" />
        </span>
        <ArrowUpRightIcon className="size-4 text-muted-foreground/60 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-foreground" />
      </div>
      <div className="min-w-0">
        <div className="truncate text-sm font-medium text-foreground">{wallet.label}</div>
        <div className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-[0.16em] text-muted-foreground">
          {wallet.hint}
        </div>
      </div>
      <div className="font-mono text-[11px] tabular-nums text-muted-foreground/80">
        {shortenAddress(wallet.address)}
      </div>
    </button>
  );
}

function PortfolioEmptyState({
  onSubmitAddress,
}: {
  onSubmitAddress: (address: string) => void;
}) {
  return (
    <div className="relative z-10 mx-auto w-full max-w-3xl px-6 pt-4 pb-24 md:pt-8">
      {/* Decorative halo */}
      <div
        aria-hidden
        className="-z-10 pointer-events-none absolute inset-x-0 top-0 mx-auto h-[420px] max-w-2xl bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--ring)_18%,transparent),transparent_70%)] blur-2xl"
      />

      <Empty className="gap-7">
        <EmptyHeader className="gap-4">
          <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.3em]">
            <SparklesIcon className="size-3" />
            Wallet inspector
          </div>
          <EmptyTitle className="font-heading text-3xl tracking-tight md:text-4xl">
            Inspect any wallet.
          </EmptyTitle>
          <EmptyDescription className="max-w-md text-balance text-[15px]/6">
            Enter a Solana address for balances, DeFi positions, and protocol
            exposure in one view.
          </EmptyDescription>
        </EmptyHeader>

        <EmptyContent className="w-full max-w-xl gap-5">
          <SearchAddressInput onSubmit={onSubmitAddress} />

          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <Separator className="flex-1" />
            <span className="inline-flex items-center gap-1.5 font-mono uppercase tracking-[0.3em]">
              <TelescopeIcon className="size-3" />
              Try one
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="grid w-full grid-cols-1 gap-3 sm:grid-cols-3">
            {SAMPLE_WALLETS.map((wallet) => (
              <SampleWalletCard
                key={wallet.address}
                wallet={wallet}
                onPick={onSubmitAddress}
              />
            ))}
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}

function NetWorthAndAllocation() {
  const [allocationKind, setAllocationKind] = useState<AllocationKind>("tokens");
  const totalValue =
    allocationKind === "tokens"
      ? PORTFOLIO_MOCK.tokens.reduce((acc, t) => acc + t.usdValue, 0)
      : PORTFOLIO_MOCK.defiAllocation.reduce((acc, a) => acc + a.usdValue, 0);

  const slices =
    allocationKind === "tokens"
      ? PORTFOLIO_MOCK.tokens.map((t) => ({
          key: t.symbol,
          name: t.symbol,
          value: t.usdValue,
          color: t.color,
        }))
      : PORTFOLIO_MOCK.defiAllocation.map((a) => ({
          key: a.protocolId,
          name: a.name,
          value: a.usdValue,
          color: a.color,
        }));

  const negative = PORTFOLIO_MOCK.netWorthChange24h < 0;

  return (
    <Card className="grid grid-cols-1 gap-6 border-border/60 bg-background/40 p-6 backdrop-blur-md md:grid-cols-[1fr_1.4fr]">
      <div>
        <div className="flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
          <WalletIcon className="size-3" />
          Net Worth
          <span className="opacity-60">/ 24H Change</span>
        </div>
        <div className="mt-3 flex flex-wrap items-baseline gap-3">
          <div className="font-heading text-4xl tracking-tight tabular-nums md:text-5xl">
            ${PORTFOLIO_MOCK.netWorth.toFixed(2)}
          </div>
          <span
            className={
              "inline-flex items-center gap-1 rounded-md px-2 py-1 font-mono text-xs tabular-nums " +
              (negative
                ? "bg-rose-500/10 text-rose-600 dark:text-rose-400"
                : "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400")
            }
          >
            {negative ? (
              <ArrowDownRightIcon className="size-3" />
            ) : (
              <ArrowUpRightIcon className="size-3" />
            )}
            {formatUsdDelta(PORTFOLIO_MOCK.netWorthChange24h)} (
            {formatPct(PORTFOLIO_MOCK.netWorthChangePct24h)})
          </span>
        </div>
        <p className="mt-6 max-w-sm text-muted-foreground text-xs leading-relaxed">
          Total net worth is the combined value of your wallet assets and open
          positions across supported protocols, converted to USD.
        </p>
      </div>

      <div className="border-border/60 border-t pt-5 md:border-l md:border-t-0 md:pl-6 md:pt-0">
        <div className="flex items-center justify-between gap-3">
          <div className="font-mono text-[11px] text-muted-foreground uppercase tracking-[0.25em]">
            {allocationKind === "tokens" ? "Token allocation" : "DeFi allocation"}
          </div>
          <div className="inline-flex h-7 items-center gap-1 rounded-full border border-border/60 bg-background/55 p-0.5">
            <AllocationToggleButton
              active={allocationKind === "tokens"}
              onClick={() => setAllocationKind("tokens")}
              label="Tokens"
            />
            <AllocationToggleButton
              active={allocationKind === "defi"}
              onClick={() => setAllocationKind("defi")}
              label="DeFi"
            />
          </div>
        </div>

        <div className="mt-4 grid grid-cols-1 items-center gap-4 sm:grid-cols-[200px_1fr]">
          <div className="relative grid place-items-center">
            <ChartContainer className="h-44 w-44">
              <PieChart>
                <ChartTooltip />
                <Pie
                  data={slices}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={52}
                  outerRadius={82}
                  paddingAngle={1}
                  strokeWidth={0}
                  startAngle={90}
                  endAngle={-270}
                >
                  {slices.map((slice) => (
                    <Cell key={slice.key} fill={slice.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <div className="text-center">
                <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
                  Total
                </div>
                <div className="mt-0.5 font-heading text-base tabular-nums">
                  {formatUsdCompact(totalValue)}
                </div>
              </div>
            </div>
          </div>

          <div className="max-h-44 overflow-y-auto pr-1">
            <div className="grid grid-cols-[1fr_auto_60px] items-center gap-3 pb-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
              <span>{allocationKind === "tokens" ? "Token" : "Protocol"}</span>
              <span className="text-right">USD Value</span>
              <span className="text-right">% Share</span>
            </div>
            <ul className="flex flex-col">
              {slices.map((slice) => {
                const share = totalValue > 0 ? (slice.value / totalValue) * 100 : 0;
                return (
                  <li
                    key={slice.key}
                    className="grid grid-cols-[1fr_auto_60px] items-center gap-3 border-border/40 border-t py-2 first:border-t-0"
                  >
                    <div className="flex items-center gap-2 text-sm">
                      <span
                        className="size-2.5 shrink-0 rounded-sm"
                        style={{ backgroundColor: slice.color }}
                      />
                      <span className="truncate">{slice.name}</span>
                    </div>
                    <span className="text-right font-mono text-xs tabular-nums">
                      ${slice.value.toFixed(2)}
                    </span>
                    <span className="text-right font-mono text-muted-foreground text-xs tabular-nums">
                      {share.toFixed(2)}%
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </Card>
  );
}

function AllocationToggleButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      data-active={active ? "true" : undefined}
      className="inline-flex h-6 items-center gap-1 rounded-full px-2.5 font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground transition-colors data-[active=true]:bg-foreground/10 data-[active=true]:text-foreground"
    >
      {label}
    </button>
  );
}

function ProtocolStripRow() {
  return (
    <div className="-mx-1 mt-4 flex gap-2 overflow-x-auto px-1 pb-1 [scrollbar-width:thin]">
      <Card className="flex h-16 min-w-[170px] shrink-0 items-center gap-3 border-border/60 bg-background/40 px-3 backdrop-blur-md">
        <span className="grid size-9 place-items-center rounded-lg border border-border/60 bg-background/55 text-muted-foreground">
          <WalletIcon className="size-4" />
        </span>
        <div>
          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.2em]">
            Holdings
          </div>
          <div className="font-mono text-sm tabular-nums">
            {formatUsdCompact(PORTFOLIO_MOCK.holdingsTotal)}
          </div>
        </div>
      </Card>
      {PORTFOLIO_MOCK.defiPositions.map((p) => (
        <Card
          key={p.protocolId}
          className="flex h-16 min-w-[170px] shrink-0 items-center gap-3 border-border/60 bg-background/40 px-3 backdrop-blur-md"
        >
          <span
            className="size-9 shrink-0 rounded-lg"
            style={{
              background: `linear-gradient(135deg, ${PORTFOLIO_MOCK.defiAllocation.find((a) => a.protocolId === p.protocolId)?.color ?? "var(--muted)"}, transparent)`,
            }}
            aria-hidden
          />
          <div className="min-w-0">
            <div className="flex items-center gap-1 truncate font-mono text-[11px] text-foreground uppercase tracking-[0.18em]">
              <span className="truncate">{p.protocolName}</span>
              <a
                href={p.protocolHref}
                target="_blank"
                rel="noreferrer"
                className="text-muted-foreground transition-colors hover:text-foreground"
                onClick={(e) => e.stopPropagation()}
              >
                <ExternalLinkIcon className="size-3" />
              </a>
            </div>
            <div className="font-mono text-[11px] text-muted-foreground tabular-nums">
              {formatUsdCompact(p.totalValue)}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

function HoldingsSection() {
  return (
    <Collapsible defaultOpen>
      <Card className="border-border/60 bg-background/40 backdrop-blur-md">
        <CollapsibleTrigger
          render={
            <button
              type="button"
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left"
            />
          }
        >
          <span className="flex items-center gap-2 font-mono text-[11px] text-muted-foreground uppercase tracking-[0.25em]">
            <WalletIcon className="size-3.5" />
            Holdings
          </span>
          <ChevronDownIcon
            className="size-4 shrink-0 text-muted-foreground transition-transform duration-200 in-data-panel-open:rotate-180"
            aria-hidden
          />
        </CollapsibleTrigger>
        <CollapsiblePanel>
          <div className="overflow-x-auto border-border/60 border-t">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="ps-4">Asset</TableHead>
                  <TableHead>Balance</TableHead>
                  <TableHead className="text-right">
                    USD Value
                    <span className="ml-1 text-muted-foreground/70">/ 24H %</span>
                  </TableHead>
                  <TableHead className="pe-4 text-right">
                    Token Price
                    <span className="ml-1 text-muted-foreground/70">/ 24H %</span>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {PORTFOLIO_MOCK.tokens.map((token) => (
                  <TableRow key={token.symbol}>
                    <TableCell className="ps-4">
                      <div className="flex items-center gap-3">
                        <span
                          className="grid size-8 shrink-0 place-items-center rounded-full border border-border/60 font-mono text-[10px] uppercase tracking-[0.16em]"
                          style={{
                            background: `linear-gradient(135deg, ${token.color}, transparent)`,
                          }}
                        >
                          {token.symbol.slice(0, 3)}
                        </span>
                        <div>
                          <div className="font-medium text-sm">{token.name}</div>
                          <div className="font-mono text-[10px] text-muted-foreground uppercase tracking-[0.18em]">
                            {token.symbol}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm tabular-nums text-muted-foreground">
                      {token.balanceLabel}
                    </TableCell>
                    <TableCell className="text-right font-mono tabular-nums">
                      <div className="text-sm">${token.usdValue.toFixed(2)}</div>
                      <div
                        className={
                          "text-[11px] " + deltaColorClasses(token.usdValueChange24h)
                        }
                      >
                        {formatUsdDelta(token.usdValueChange24h)} (
                        {formatPct(token.usdValueChangePct24h)})
                      </div>
                    </TableCell>
                    <TableCell className="pe-4 text-right font-mono tabular-nums">
                      <div className="text-sm">${token.price.toFixed(2)}</div>
                      <div
                        className={
                          "text-[11px] " + deltaColorClasses(token.priceChangePct24h)
                        }
                      >
                        {formatPct(token.priceChangePct24h)}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CollapsiblePanel>
      </Card>
    </Collapsible>
  );
}

function DefiPositionsSection() {
  const allProtocolIds = useMemo(
    () => PORTFOLIO_MOCK.defiPositions.map((p) => p.protocolId),
    [],
  );
  const allGroupIds = useMemo(
    () =>
      PORTFOLIO_MOCK.defiPositions.flatMap((p) =>
        p.groups.map((g, i) => `${p.protocolId}:${i}`),
      ),
    [],
  );

  return (
    <Accordion
      multiple
      defaultValue={allProtocolIds}
      className="flex flex-col gap-3"
    >
      {PORTFOLIO_MOCK.defiPositions.map((protocol) => {
        const color = PORTFOLIO_MOCK.defiAllocation.find(
          (a) => a.protocolId === protocol.protocolId,
        )?.color;
        return (
          <AccordionItem
            key={protocol.protocolId}
            value={protocol.protocolId}
            className="border-b-0"
          >
            <Card className="border-border/60 bg-background/40 backdrop-blur-md">
              <AccordionTrigger className="px-4 py-3 hover:bg-foreground/[0.03]">
                <div className="flex items-center gap-3">
                  <span
                    className="size-9 shrink-0 rounded-lg"
                    style={{
                      background: `linear-gradient(135deg, ${color ?? "var(--muted)"}, transparent)`,
                    }}
                    aria-hidden
                  />
                  <div className="flex items-center gap-2 font-mono text-[12px] uppercase tracking-[0.18em]">
                    <span>{protocol.protocolName}</span>
                    <a
                      href={protocol.protocolHref}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      <ExternalLinkIcon className="size-3" />
                    </a>
                  </div>
                </div>
              </AccordionTrigger>
              <AccordionPanel className="px-0 pt-0 pb-0">
                <Accordion
                  multiple
                  defaultValue={allGroupIds}
                  className="border-border/60 border-t"
                >
                  {protocol.groups.map((group, groupIndex) => {
                    const groupValue = `${protocol.protocolId}:${groupIndex}`;
                    return (
                      <AccordionItem
                        key={groupValue}
                        value={groupValue}
                        className="border-b border-border/40 last:border-b-0"
                      >
                        <AccordionTrigger className="px-4 py-3 hover:bg-foreground/[0.03]">
                          <div className="flex flex-wrap items-center gap-2">
                            <Badge
                              variant="outline"
                              className={defiKindClasses(group.kind)}
                            >
                              {group.kind}
                            </Badge>
                            <AddressChip address={group.walletShort} />
                            <Badge variant="secondary" className="font-mono">
                              VALUE: ${group.value.toFixed(2)}
                            </Badge>
                          </div>
                        </AccordionTrigger>
                        <AccordionPanel className="px-0 pb-0 pt-0">
                          <div className="overflow-x-auto border-border/40 border-t">
                            <Table>
                              <TableHeader>
                                <TableRow>
                                  <TableHead className="ps-4">Position</TableHead>
                                  <TableHead>Balance</TableHead>
                                  <TableHead className="text-right">
                                    USD Value
                                    <span className="ml-1 text-muted-foreground/70">
                                      / 24H %
                                    </span>
                                  </TableHead>
                                  <TableHead className="pe-4 text-right">
                                    Yield
                                  </TableHead>
                                </TableRow>
                              </TableHeader>
                              <TableBody>
                                {group.rows.map((row, rowIndex) => (
                                  <TableRow key={`${row.asset}-${rowIndex}`}>
                                    <TableCell className="ps-4 font-medium text-sm">
                                      {row.asset}
                                    </TableCell>
                                    <TableCell className="font-mono text-sm tabular-nums text-muted-foreground">
                                      <div>{row.balance}</div>
                                      {row.altBalance ? (
                                        <div className="text-[11px] opacity-80">
                                          {row.altBalance}
                                        </div>
                                      ) : null}
                                    </TableCell>
                                    <TableCell className="text-right font-mono tabular-nums">
                                      <div className="text-sm">{formatUsd(row.usd)}</div>
                                      <div
                                        className={
                                          "text-[11px] " +
                                          deltaColorClasses(row.usdChange24h)
                                        }
                                      >
                                        {formatUsdDelta(row.usdChange24h)} (
                                        {formatPct(row.usdChangePct24h)})
                                      </div>
                                    </TableCell>
                                    <TableCell className="pe-4 text-right font-mono text-sm tabular-nums text-muted-foreground">
                                      {row.yieldLabel ?? "—"}
                                    </TableCell>
                                  </TableRow>
                                ))}
                              </TableBody>
                            </Table>
                          </div>
                        </AccordionPanel>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              </AccordionPanel>
            </Card>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

export function PortfolioPage({
  walletAddress,
  onClearWallet,
  onOpenWallet,
}: {
  walletAddress: string | null;
  onClearWallet: () => void;
  onOpenWallet: (address: string) => void;
}) {
  const handleSubmit = useCallback(
    (next: string) => {
      onOpenWallet(next);
    },
    [onOpenWallet],
  );

  return (
    <div className="absolute inset-0 z-40 overflow-y-auto overflow-x-hidden bg-background pt-[64px] text-foreground">
      {walletAddress === null ? (
        <>
          <PortfolioEmptyBackground />
          <PortfolioEmptyState onSubmitAddress={handleSubmit} />
        </>
      ) : (
        <main className="mx-auto max-w-6xl px-6 pt-6 pb-24">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                size="icon-sm"
                onClick={onClearWallet}
                aria-label="New search"
              >
                <ArrowUpRightIcon className="-rotate-[135deg]" />
              </Button>
              <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-border/60 bg-background/55 text-muted-foreground">
                <WalletIcon className="size-4" />
              </span>
              <div className="font-mono text-sm">{shortenAddress(walletAddress)}</div>
              <button
                type="button"
                onClick={() => copyToClipboard(walletAddress)}
                aria-label="Copy address"
                className="grid size-7 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <CopyIcon className="size-3.5" />
              </button>
            </div>
            <div className="flex items-center gap-2">
              <SearchAddressInput size="sm" onSubmit={handleSubmit} />
              <Button
                type="button"
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() =>
                  toastManager.add({
                    id: `addr-book-${Date.now()}`,
                    title: "Address book",
                    description: "Coming soon — bring your saved wallets here.",
                    type: "info",
                    timeout: 2200,
                  })
                }
              >
                <BookmarkIcon />
                Address Book
              </Button>
            </div>
          </div>

          <div className="mt-6">
            <NetWorthAndAllocation />
          </div>

          <ProtocolStripRow />

          <div className="mt-4">
            <HoldingsSection />
          </div>

          <div className="mt-4 flex items-center gap-2 font-mono text-[10px] text-muted-foreground uppercase tracking-[0.25em]">
            <span>DeFi positions</span>
          </div>
          <div className="mt-2">
            <DefiPositionsSection />
          </div>
        </main>
      )}
    </div>
  );
}
