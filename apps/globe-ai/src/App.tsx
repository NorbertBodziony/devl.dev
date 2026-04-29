import {
  type ComponentPropsWithoutRef,
  type MouseEvent,
  type ReactNode,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { CrosshairIcon, ExternalLinkIcon, MousePointer2Icon } from "lucide-react";
import { Button } from "@orbit/ui/button";
import { Card } from "@orbit/ui/card";
import { toastManager } from "@orbit/ui/toast";
import { AppHeader, type AppHeaderRoute } from "./components/AppHeader";
import { GlobeScene } from "./components/GlobeScene";
import { NetworkIndexPage } from "./components/NetworkIndexPage";
import { BlockHistoryPanel, MarketMetricsPanel, MobilePanelTabs } from "./components/Panels";
import { NetworkPage } from "./components/NetworkPage";
import { ProtocolDetailPanel } from "./components/ProtocolDetailPanel";
import { ProtocolPage } from "./components/ProtocolPage";
import { WalletPinDialog } from "./components/WalletPinDialog";
import type { CountryFeature } from "./lib/countries";
import { transactionExplorerUrl } from "./lib/explorer";
import { NETWORKS, type Network } from "./lib/networks";
import {
  getNetworkFromPath,
  getNetworkIdFromPath,
  isAnyNetworkPath,
  isNetworkIndexPath,
  isNetworkPath,
  navigateToNetwork,
  navigateToNetworkIndex,
} from "./lib/network-route";
import { PROTOCOLS } from "./lib/protocols";
import {
  getProtocolFromPath,
  getProtocolIdFromPath,
  isProtocolPath,
  navigateToGlobe,
  navigateToProtocol,
} from "./lib/protocol-route";
import type { Protocol, WalletPin } from "./lib/types";
import { useBlockStream } from "./lib/use-block-stream";

type SelectedCountry = {
  country: string;
  feature: CountryFeature;
};

type PreviewAnchor = {
  x: number;
  y: number;
};

type MockActivityToast = {
  actionProps?: ComponentPropsWithoutRef<"button">;
  description: ReactNode;
  title: ReactNode;
  type: "info" | "success" | "warning";
};

type MockActivityEvent =
  | {
      amount: string;
      kind: "protocol-flow";
      network: Network;
      protocol: Protocol;
    }
  | {
      kind: "network-event";
      network: Network;
    }
  | {
      flow: string;
      kind: "wallet-transaction";
      network: Network;
      protocol: Protocol;
      txHash: string;
      wallet: string;
    }
  | {
      kind: "protocol-activity";
      network: Network;
      protocol: Protocol;
    };

type MockActivityHandlers = {
  onOpenNetwork: (networkId: string) => void;
  onOpenProtocol: (protocolId: string) => void;
};

const ACTIVITY_INITIAL_DELAY_MS = 900;
const ACTIVITY_INITIAL_BURST_COUNT = 4;
const ACTIVITY_INITIAL_BURST_STAGGER_MS = 650;
const ACTIVITY_INTERVAL_MIN_MS = 3600;
const ACTIVITY_INTERVAL_MAX_MS = 5600;
const ACTIVITY_TOAST_TIMEOUT_MS = 12_000;

const MOCK_WHALE_WALLETS = [
  "8dYbQ...n3M9p",
  "BABBC...Uwwwv",
  "4nq9K...8sL2a",
  "21112...59899",
] as const;

function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min);
}

function pickMockItem<T>(items: readonly T[], index: number) {
  return items[index % items.length]!;
}

function compactUsd(value: number) {
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  return `$${(value / 1_000_000).toFixed(1)}M`;
}

function mockTransactionHash(index: number, network: Network) {
  if (network.id === "solana") {
    const solanaHashes = [
      "5YTXpWRiNqP4aHsxDhmvVb6sXehR9vZq9nVt2m4hQZ7fJ6u3A2rV8cWkLq9pNfE1bR7sT4xY8mK2dP6aC3hG9j",
      "3uYbLqK8pR5nVwS2xT9cAaD4eF7hJ1mN6zQ8rU2vX5kB9pC3dE7fG1hL4jM8nP2q",
      "4sNfT9rX2kL6aV3pQ8mC1dB7eH5jY4uW9zR2vP6qA8tK3nD5gF7hJ1lM9xC4bE",
    ];
    return pickMockItem(solanaHashes, index);
  }

  const hex = "0123456789abcdef";
  const body = Array.from({ length: 64 }, (_, position) => hex[(index * 11 + position * 7) % hex.length]).join("");
  return `0x${body}`;
}

function shortHash(hash: string) {
  return `${hash.slice(0, 6)}...${hash.slice(-4)}`;
}

function buildMockActivityEvent(index: number): MockActivityEvent {
  const protocol = pickMockItem(PROTOCOLS, index * 2);
  const networkName = pickMockItem(protocol.networks.length > 0 ? protocol.networks : ["Ethereum"], index);
  const network = NETWORKS.find((item) => item.name === networkName) ?? pickMockItem(NETWORKS, index);
  const wallet = pickMockItem(MOCK_WHALE_WALLETS, index);
  const amount = compactUsd(randomBetween(1_200_000, 24_000_000));
  const flow = compactUsd(randomBetween(800_000, 9_500_000));
  const txHash = mockTransactionHash(index, network);

  const events: MockActivityEvent[] = [
    {
      amount,
      kind: "protocol-flow",
      network,
      protocol,
    },
    {
      kind: "network-event",
      network,
    },
    {
      kind: "protocol-activity",
      network,
      protocol,
    },
    {
      flow,
      kind: "wallet-transaction",
      network,
      protocol,
      txHash,
      wallet,
    },
  ];

  return pickMockItem(events, index);
}

function ActivityMention({
  children,
  onClick,
}: {
  children: ReactNode;
  onClick: (event: MouseEvent<HTMLButtonElement>) => void;
}) {
  return (
    <button
      type="button"
      className="inline-flex h-5 items-center rounded-md border border-border/60 bg-muted/40 px-1.5 font-medium text-foreground text-xs transition-[background-color,border-color,color,scale] hover:border-border hover:bg-accent hover:text-accent-foreground active:scale-[0.96] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 focus-visible:ring-offset-background"
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function renderMockActivityToast(
  event: MockActivityEvent,
  toastId: string,
  handlers: MockActivityHandlers,
): MockActivityToast {
  const openProtocol = (protocolId: string) => (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation();
    toastManager.close(toastId);
    handlers.onOpenProtocol(protocolId);
  };
  const openNetwork = (networkId: string) => (clickEvent: MouseEvent<HTMLButtonElement>) => {
    clickEvent.stopPropagation();
    toastManager.close(toastId);
    handlers.onOpenNetwork(networkId);
  };
  const protocolMention = (protocol: Protocol) => (
    <ActivityMention onClick={openProtocol(protocol.id)}>{protocol.name}</ActivityMention>
  );
  const networkMention = (network: Network) => (
    <ActivityMention onClick={openNetwork(network.id)}>{network.name}</ActivityMention>
  );

  if (event.kind === "protocol-flow") {
    return {
      type: "success",
      title: (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          {protocolMention(event.protocol)}
          <span>routed {event.amount}</span>
        </span>
      ),
      description: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-snug">
          {networkMention(event.network)}
          <span>liquidity path settled across live markets.</span>
        </span>
      ),
    };
  }

  if (event.kind === "network-event") {
    return {
      type: "info",
      title: (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          {networkMention(event.network)}
          <span>finality stable</span>
        </span>
      ),
      description: `Blocks confirming near ${event.network.finalitySec}s with healthy relay activity.`,
    };
  }

  if (event.kind === "protocol-activity") {
    return {
      type: "info",
      title: (
        <span className="inline-flex flex-wrap items-center gap-1.5">
          {protocolMention(event.protocol)}
          <span>user activity up</span>
        </span>
      ),
      description: (
        <span className="inline-flex flex-wrap items-center gap-1.5 leading-snug">
          {networkMention(event.network)}
          <span>saw a fresh burst of wallet interactions.</span>
        </span>
      ),
    };
  }

  const explorerUrl = transactionExplorerUrl(event.txHash, event.network);
  return {
    type: "warning",
    title: "Whale deposit detected",
    description: (
      <span className="inline-flex flex-wrap items-center gap-1.5 leading-snug">
        <span className="font-mono text-xs tabular-nums">{event.wallet}</span>
        <span>moved {event.flow} into</span>
        {protocolMention(event.protocol)}
        <span>vaults on</span>
        {networkMention(event.network)}
        <span className="font-mono text-[11px] text-muted-foreground tabular-nums">tx {shortHash(event.txHash)}</span>
      </span>
    ),
    actionProps: explorerUrl
      ? {
          "aria-label": `Open ${shortHash(event.txHash)} in explorer`,
          children: (
            <>
              View tx
              <ExternalLinkIcon />
            </>
          ),
          onClick: () => {
            toastManager.close(toastId);
            window.location.assign(explorerUrl);
          },
        }
      : undefined,
  };
}

function useMockGlobeActivity(enabled: boolean, handlers: MockActivityHandlers) {
  const eventIndexRef = useRef(0);

  useEffect(() => {
    if (!enabled) return;

    const timeoutIds = new Set<number>();
    let cancelled = false;

    const emitActivity = () => {
      const toastId = `globe-activity-${Date.now()}-${eventIndexRef.current}`;
      const event = renderMockActivityToast(
        buildMockActivityEvent(eventIndexRef.current),
        toastId,
        handlers,
      );
      eventIndexRef.current += 1;
      toastManager.add({
        description: event.description,
        id: toastId,
        actionProps: event.actionProps,
        timeout: ACTIVITY_TOAST_TIMEOUT_MS,
        title: event.title,
        type: event.type,
      });
    };

    const schedule = (delay: number) => {
      const timeoutId = window.setTimeout(() => {
        timeoutIds.delete(timeoutId);
        if (cancelled) return;
        emitActivity();
        schedule(randomBetween(ACTIVITY_INTERVAL_MIN_MS, ACTIVITY_INTERVAL_MAX_MS));
      }, delay);
      timeoutIds.add(timeoutId);
    };

    for (let i = 0; i < ACTIVITY_INITIAL_BURST_COUNT; i += 1) {
      const timeoutId = window.setTimeout(() => {
        timeoutIds.delete(timeoutId);
        if (!cancelled) emitActivity();
      }, ACTIVITY_INITIAL_DELAY_MS + i * ACTIVITY_INITIAL_BURST_STAGGER_MS);
      timeoutIds.add(timeoutId);
    }
    schedule(
      ACTIVITY_INITIAL_DELAY_MS +
        ACTIVITY_INITIAL_BURST_COUNT * ACTIVITY_INITIAL_BURST_STAGGER_MS +
        randomBetween(ACTIVITY_INTERVAL_MIN_MS, ACTIVITY_INTERVAL_MAX_MS),
    );

    return () => {
      cancelled = true;
      timeoutIds.forEach((timeoutId) => window.clearTimeout(timeoutId));
      timeoutIds.clear();
    };
  }, [enabled, handlers]);
}

function useCompactLayout() {
  const [compact, setCompact] = useState(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 980 || window.innerHeight < 680;
  });

  useEffect(() => {
    const update = () => setCompact(window.innerWidth < 980 || window.innerHeight < 680);
    update();
    window.addEventListener("resize", update);
    window.addEventListener("orientationchange", update);
    return () => {
      window.removeEventListener("resize", update);
      window.removeEventListener("orientationchange", update);
    };
  }, []);

  return compact;
}

export function App() {
  const { blocks } = useBlockStream();
  const compact = useCompactLayout();
  const [pinMode, setPinMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState<SelectedCountry | null>(null);
  const [routePath, setRoutePath] = useState(() => {
    if (typeof window === "undefined") return "/";
    return window.location.pathname;
  });
  const [pins, setPins] = useState<WalletPin[]>([]);
  const [mobilePanel, setMobilePanel] = useState<"blocks" | "markets" | null>(null);
  const [selectedProtocol, setSelectedProtocol] = useState<Protocol | null>(null);
  const [protocolPreviewAnchor, setProtocolPreviewAnchor] = useState<PreviewAnchor | null>(null);
  const protocolPreviewCloseRef = useRef<number | null>(null);
  const protocolPreviewHoverRef = useRef(false);
  const activeProtocol = useMemo(() => getProtocolFromPath(routePath), [routePath]);
  const activeProtocolId = useMemo(() => getProtocolIdFromPath(routePath), [routePath]);
  const protocolRouteActive = isProtocolPath(routePath);
  const activeNetwork = useMemo(() => getNetworkFromPath(routePath), [routePath]);
  const activeNetworkId = useMemo(() => getNetworkIdFromPath(routePath), [routePath]);
  const networkIndexRouteActive = isNetworkIndexPath(routePath);
  const networkRouteActive = isNetworkPath(routePath);
  const anyNetworkRouteActive = isAnyNetworkPath(routePath);

  useEffect(() => {
    const updateRoute = () => setRoutePath(window.location.pathname);
    window.addEventListener("popstate", updateRoute);
    return () => window.removeEventListener("popstate", updateRoute);
  }, []);

  const handleCountrySelected = useCallback((country: string, feature: CountryFeature) => {
    setSelectedCountry({ country, feature });
  }, []);

  const handlePinCreated = useCallback((pin: WalletPin) => {
    setPins((current) => [pin, ...current].slice(0, 24));
    setPinMode(false);
  }, []);

  const handleProtocolSelected = useCallback((protocol: Protocol) => {
    navigateToProtocol(protocol.id);
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
    setProtocolPreviewAnchor(null);
    setPinMode(false);
    setSelectedCountry(null);
    setMobilePanel(null);
  }, []);

  const handleProtocolPreviewChange = useCallback((protocol: Protocol | null, anchor?: PreviewAnchor) => {
    if (protocolPreviewCloseRef.current) {
      window.clearTimeout(protocolPreviewCloseRef.current);
      protocolPreviewCloseRef.current = null;
    }

    if (!protocol) {
      protocolPreviewCloseRef.current = window.setTimeout(() => {
        if (protocolPreviewHoverRef.current) return;
        setSelectedProtocol(null);
        setProtocolPreviewAnchor(null);
        protocolPreviewCloseRef.current = null;
      }, 120);
      return;
    }

    setSelectedProtocol(protocol);
    if (anchor) setProtocolPreviewAnchor(anchor);
    if (protocol) {
      setPinMode(false);
      setSelectedCountry(null);
      setMobilePanel(null);
    }
  }, []);

  const handleProtocolPreviewClose = useCallback(() => {
    if (protocolPreviewCloseRef.current) {
      window.clearTimeout(protocolPreviewCloseRef.current);
      protocolPreviewCloseRef.current = null;
    }
    protocolPreviewHoverRef.current = false;
    setSelectedProtocol(null);
    setProtocolPreviewAnchor(null);
  }, []);

  useEffect(() => {
    return () => {
      if (protocolPreviewCloseRef.current) {
        window.clearTimeout(protocolPreviewCloseRef.current);
      }
    };
  }, []);

  const handleOpenProtocol = useCallback((protocol: Protocol) => {
    navigateToProtocol(protocol.id);
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
    setPinMode(false);
    setSelectedCountry(null);
    setMobilePanel(null);
  }, []);

  const handleOpenNetwork = useCallback((networkId: string) => {
    navigateToNetwork(networkId);
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
    setPinMode(false);
    setSelectedCountry(null);
    setMobilePanel(null);
  }, []);

  const handleBackToGlobe = useCallback(() => {
    navigateToGlobe();
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
  }, []);

  const handleNavigateNetworks = useCallback(() => {
    navigateToNetworkIndex();
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
    setProtocolPreviewAnchor(null);
    setPinMode(false);
    setSelectedCountry(null);
    setMobilePanel(null);
  }, []);

  const activeHeaderRoute: AppHeaderRoute = routePath === "/"
    ? "home"
    : anyNetworkRouteActive
      ? "networks"
      : null;

  const activityHandlers = useMemo(
    () => ({
      onOpenNetwork: handleOpenNetwork,
      onOpenProtocol: (protocolId: string) => {
        const protocol = PROTOCOLS.find((item) => item.id === protocolId);
        if (protocol) handleOpenProtocol(protocol);
      },
    }),
    [handleOpenNetwork, handleOpenProtocol],
  );

  useMockGlobeActivity(routePath === "/", activityHandlers);

  return (
    <main className="app-shell">
      <div className="starfield" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      <AppHeader
        current={activeHeaderRoute}
        onNavigateHome={handleBackToGlobe}
        onNavigateNetworks={handleNavigateNetworks}
      />

      {protocolRouteActive ? (
        <ProtocolPage
          protocol={activeProtocol}
          requestedId={activeProtocolId}
          onBack={handleBackToGlobe}
          onOpenNetwork={handleOpenNetwork}
        />
      ) : networkIndexRouteActive ? (
        <NetworkIndexPage onOpenNetwork={handleOpenNetwork} />
      ) : networkRouteActive ? (
        <NetworkPage
          network={activeNetwork}
          requestedId={activeNetworkId}
          onBack={handleBackToGlobe}
          onOpenProtocol={handleOpenProtocol}
        />
      ) : anyNetworkRouteActive ? (
        <NetworkPage
          network={null}
          requestedId={activeNetworkId}
          onBack={handleBackToGlobe}
          onOpenProtocol={handleOpenProtocol}
        />
      ) : (
        <>
          <GlobeScene
            protocols={PROTOCOLS}
            pins={pins}
            pinMode={pinMode}
            onCountrySelected={handleCountrySelected}
            onProtocolSelected={handleProtocolSelected}
            onProtocolPreviewChange={handleProtocolPreviewChange}
          />

          {false ? (
            <header className="topbar">
              <div className="topbar-actions">
                <Button
                  type="button"
                  variant={pinMode ? "default" : "outline"}
                  size="lg"
                  className="wallet-pin-trigger"
                  data-active={pinMode ? "true" : undefined}
                  onClick={() => {
                    setPinMode((value) => !value);
                    setSelectedCountry(null);
                  }}
                >
                  <span className="wallet-pin-trigger-icon">
                    <CrosshairIcon />
                  </span>
                  <span>{pinMode ? "Pick country" : "Pin wallet"}</span>
                </Button>
              </div>
            </header>
          ) : null}

          {pinMode ? (
            <Card className="pin-mode-banner">
              <MousePointer2Icon />
              Click a country to attach a local wallet pin. Press the button again to exit.
            </Card>
          ) : null}

          {selectedProtocol ? (
            <ProtocolDetailPanel
              protocol={selectedProtocol}
              anchor={protocolPreviewAnchor}
              onClose={handleProtocolPreviewClose}
              onOpen={handleOpenProtocol}
              onOpenNetwork={handleOpenNetwork}
              onPointerEnter={() => {
                protocolPreviewHoverRef.current = true;
                handleProtocolPreviewChange(selectedProtocol);
              }}
              onPointerLeave={() => {
                protocolPreviewHoverRef.current = false;
                handleProtocolPreviewChange(null);
              }}
            />
          ) : null}

          {compact ? (
            <>
              {mobilePanel === "blocks" ? (
                <div className="mobile-panel-sheet">
                  <BlockHistoryPanel blocks={blocks} compact />
                </div>
              ) : null}
              {mobilePanel === "markets" ? (
                <div className="mobile-panel-sheet">
                  <MarketMetricsPanel protocolCount={PROTOCOLS.length} compact />
                </div>
              ) : null}
              <MobilePanelTabs active={mobilePanel} onChange={setMobilePanel} />
            </>
          ) : (
            <>
              <BlockHistoryPanel blocks={blocks} />
              <MarketMetricsPanel protocolCount={PROTOCOLS.length} />
            </>
          )}

          <WalletPinDialog
            selected={selectedCountry}
            onClose={() => setSelectedCountry(null)}
            onPinCreated={handlePinCreated}
          />
        </>
      )}
    </main>
  );
}
