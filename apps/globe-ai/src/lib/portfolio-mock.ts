import { chartColor } from "@orbit/ui/patterns/charts/chart";

export const RECENT_WALLETS_STORAGE_KEY = "globe-ai:recent-wallets";
export const MAX_RECENT_WALLETS = 5;

export type AllocationKind = "tokens" | "defi";
export type DefiGroupKind = "Lending" | "Liquidity" | "Staking";

export type TokenHolding = {
  symbol: string;
  name: string;
  balanceLabel: string;
  usdValue: number;
  usdValueChange24h: number;
  usdValueChangePct24h: number;
  price: number;
  priceChangePct24h: number;
  color: string;
};

export type DefiPositionRow = {
  asset: string;
  balance: string;
  altBalance?: string;
  usd: number;
  usdChange24h: number;
  usdChangePct24h: number;
  yieldLabel: string | null;
};

export type DefiPositionGroup = {
  kind: DefiGroupKind;
  walletShort: string;
  value: number;
  rows: DefiPositionRow[];
};

export type DefiProtocolBlock = {
  protocolId: string;
  protocolName: string;
  protocolHref: string;
  totalValue: number;
  groups: DefiPositionGroup[];
};

export type DefiAllocationSlice = {
  protocolId: string;
  name: string;
  usdValue: number;
  color: string;
};

const TOKENS: TokenHolding[] = [
  {
    symbol: "SOL",
    name: "Wrapped SOL",
    balanceLabel: "1.37 SOL",
    usdValue: 115.44,
    usdValueChange24h: 0.37,
    usdValueChangePct24h: 0.32,
    price: 84.01,
    priceChangePct24h: 0.32,
    color: chartColor(0),
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    balanceLabel: "52.77 USDC",
    usdValue: 52.65,
    usdValueChange24h: -0.04,
    usdValueChangePct24h: -0.09,
    price: 1.0,
    priceChangePct24h: -0.09,
    color: chartColor(1),
  },
  {
    symbol: "pbUSDC",
    name: "PiggyBank USDC",
    balanceLabel: "4.24 pbUSDC",
    usdValue: 4.63,
    usdValueChange24h: 0,
    usdValueChangePct24h: 0,
    price: 1.09,
    priceChangePct24h: 0,
    color: chartColor(2),
  },
  {
    symbol: "jlWSOL",
    name: "Jupiter Lend WSOL",
    balanceLabel: "0.05 jlWSOL",
    usdValue: 4.24,
    usdValueChange24h: 0,
    usdValueChangePct24h: 0,
    price: 86.33,
    priceChangePct24h: 0,
    color: chartColor(3),
  },
  {
    symbol: "jlEURC",
    name: "Jupiter Lend EURC",
    balanceLabel: "2.91 jlEURC",
    usdValue: 3.51,
    usdValueChange24h: 0,
    usdValueChangePct24h: 3.06,
    price: 1.21,
    priceChangePct24h: 3.06,
    color: chartColor(4),
  },
  {
    symbol: "JUP",
    name: "Jupiter",
    balanceLabel: "12.5 JUP",
    usdValue: 8.91,
    usdValueChange24h: 0.12,
    usdValueChangePct24h: 1.36,
    price: 0.71,
    priceChangePct24h: 1.36,
    color: chartColor(5 % 5),
  },
];

const DEFI_POSITIONS: DefiProtocolBlock[] = [
  {
    protocolId: "loopscale",
    protocolName: "LOOPSCALE",
    protocolHref: "https://loopscale.app",
    totalValue: 16.03,
    groups: [
      {
        kind: "Lending",
        walletShort: "tEsT1...j51nd",
        value: 16.03,
        rows: [
          {
            asset: "SOL",
            balance: "0.1088 SOL",
            usd: 9.1401,
            usdChange24h: 0.03,
            usdChangePct24h: 0.32,
            yieldLabel: null,
          },
          {
            asset: "USDC",
            balance: "4.923 USDC",
            usd: 4.9117,
            usdChange24h: 0,
            usdChangePct24h: -0.09,
            yieldLabel: null,
          },
          {
            asset: "USDC",
            balance: "1.0273 USDC",
            usd: 1.025,
            usdChange24h: 0,
            usdChangePct24h: -0.09,
            yieldLabel: null,
          },
          {
            asset: "JupSOL",
            balance: "0.0071 JupSOL",
            usd: 0.7032,
            usdChange24h: 0,
            usdChangePct24h: -0.07,
            yieldLabel: null,
          },
          {
            asset: "CbKQ — USDC",
            balance: "1 CbKQ…",
            altBalance: "0.1861 USDC",
            usd: 0.1856,
            usdChange24h: 0,
            usdChangePct24h: -0.09,
            yieldLabel: null,
          },
          {
            asset: "zBTC",
            balance: "<0.0001 zBTC",
            usd: 0.0642,
            usdChange24h: 0,
            usdChangePct24h: 0.47,
            yieldLabel: null,
          },
          {
            asset: "MLP",
            balance: "0.0002 MLP",
            usd: 0,
            usdChange24h: 0,
            usdChangePct24h: 0,
            yieldLabel: null,
          },
        ],
      },
    ],
  },
  {
    protocolId: "omnipair",
    protocolName: "OMNIPAIR",
    protocolHref: "https://omnipair.io",
    totalValue: 14.28,
    groups: [
      {
        kind: "Lending",
        walletShort: "tEsT1...j51nd",
        value: 1.2,
        rows: [
          {
            asset: "USDC — JupUSD",
            balance: "1 USDC",
            altBalance: "0.2039 JupUSD",
            usd: 1.2016,
            usdChange24h: 0,
            usdChangePct24h: -0.1,
            yieldLabel: null,
          },
        ],
      },
      {
        kind: "Liquidity",
        walletShort: "tEsT1...j51nd",
        value: 13.08,
        rows: [
          {
            asset: "JupSOL — USDC",
            balance: "0.0512 JupSOL",
            altBalance: "8.42 USDC",
            usd: 13.08,
            usdChange24h: 0.04,
            usdChangePct24h: 0.31,
            yieldLabel: "12.4% APR",
          },
        ],
      },
    ],
  },
  {
    protocolId: "kamino",
    protocolName: "KAMINO FINANCE",
    protocolHref: "https://app.kamino.finance",
    totalValue: 6281.39,
    groups: [
      {
        kind: "Lending",
        walletShort: "tEsT1...j51nd",
        value: 4521.0,
        rows: [
          {
            asset: "USDC",
            balance: "4521 USDC",
            usd: 4521.0,
            usdChange24h: -0.41,
            usdChangePct24h: -0.09,
            yieldLabel: "5.8% APY",
          },
        ],
      },
      {
        kind: "Liquidity",
        walletShort: "tEsT1...j51nd",
        value: 1760.39,
        rows: [
          {
            asset: "SOL — USDC",
            balance: "12.4 SOL",
            altBalance: "1041 USDC",
            usd: 1760.39,
            usdChange24h: 4.21,
            usdChangePct24h: 0.24,
            yieldLabel: "18.9% APR",
          },
        ],
      },
    ],
  },
  {
    protocolId: "meteora",
    protocolName: "METEORA",
    protocolHref: "https://meteora.ag",
    totalValue: 6281.39,
    groups: [
      {
        kind: "Liquidity",
        walletShort: "tEsT1...j51nd",
        value: 6281.39,
        rows: [
          {
            asset: "JupSOL — USDC",
            balance: "29.8 JupSOL",
            altBalance: "2509 USDC",
            usd: 6281.39,
            usdChange24h: 12.04,
            usdChangePct24h: 0.19,
            yieldLabel: "22.1% APR",
          },
        ],
      },
    ],
  },
  {
    protocolId: "metapool",
    protocolName: "META POOL",
    protocolHref: "https://metapool.app",
    totalValue: 6281.39,
    groups: [
      {
        kind: "Staking",
        walletShort: "tEsT1...j51nd",
        value: 6281.39,
        rows: [
          {
            asset: "stSOL",
            balance: "57.21 stSOL",
            usd: 6281.39,
            usdChange24h: 9.12,
            usdChangePct24h: 0.15,
            yieldLabel: "7.2% APY",
          },
        ],
      },
    ],
  },
];

const DEFI_ALLOCATION: DefiAllocationSlice[] = DEFI_POSITIONS.map((p, i) => ({
  protocolId: p.protocolId,
  name: p.protocolName,
  usdValue: p.totalValue,
  color: chartColor(i),
}));

const HOLDINGS_TOTAL = 14_420;

export const PORTFOLIO_MOCK = {
  netWorth: 678.96,
  netWorthChange24h: -4.93,
  netWorthChangePct24h: -0.7,
  holdingsTotal: HOLDINGS_TOTAL,
  tokens: TOKENS,
  defiPositions: DEFI_POSITIONS,
  defiAllocation: DEFI_ALLOCATION,
};

export function shortenAddress(addr: string): string {
  const trimmed = addr.trim();
  if (trimmed.length <= 13) return trimmed;
  return `${trimmed.slice(0, 5)}...${trimmed.slice(-5)}`;
}

export function formatUsdCompact(value: number): string {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(2)}K`;
  return `$${value.toFixed(2)}`;
}

export function formatUsd(value: number): string {
  return value.toLocaleString("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  });
}

export function formatPct(value: number): string {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(2)}%`;
}

export function formatUsdDelta(value: number): string {
  const sign = value > 0 ? "+" : value < 0 ? "-" : "";
  return `${sign}$${Math.abs(value).toFixed(2)}`;
}
