import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CrosshairIcon, MousePointer2Icon } from "lucide-react";
import { Button } from "@orbit/ui/button";
import { Card } from "@orbit/ui/card";
import { GlobeScene } from "./components/GlobeScene";
import { BlockHistoryPanel, MarketMetricsPanel, MobilePanelTabs } from "./components/Panels";
import { ProtocolDetailPanel } from "./components/ProtocolDetailPanel";
import { ProtocolPage } from "./components/ProtocolPage";
import { WalletPinDialog } from "./components/WalletPinDialog";
import type { CountryFeature } from "./lib/countries";
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
    setSelectedProtocol(protocol);
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

  const handleBackToGlobe = useCallback(() => {
    navigateToGlobe();
    setRoutePath(window.location.pathname);
    setSelectedProtocol(null);
  }, []);

  return (
    <main className="app-shell">
      <div className="starfield" aria-hidden="true" />
      <div className="ambient-grid" aria-hidden="true" />

      {protocolRouteActive ? (
        <ProtocolPage
          protocol={activeProtocol}
          requestedId={activeProtocolId}
          onBack={handleBackToGlobe}
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

          <header className="topbar">
            <div className="topbar-actions">
              <Button
                type="button"
                variant={pinMode ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  setPinMode((value) => !value);
                  setSelectedCountry(null);
                }}
              >
                <CrosshairIcon />
                Pin wallet
              </Button>
            </div>
          </header>

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
              onClose={() => handleProtocolPreviewChange(null)}
              onOpen={handleOpenProtocol}
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
