import { GlobeIcon, LayersIcon } from "lucide-react";

export type AppHeaderRoute = "home" | "networks" | null;

type AppHeaderProps = {
  current: AppHeaderRoute;
  onNavigateHome: () => void;
  onNavigateNetworks: () => void;
};

export function AppHeader({ current, onNavigateHome, onNavigateNetworks }: AppHeaderProps) {
  return (
    <header className="app-header" aria-label="Primary">
      <nav className="app-nav" data-current={current ?? "none"}>
        <span className="app-nav-indicator" aria-hidden="true" />
        <button
          type="button"
          className="app-nav-item"
          data-active={current === "home" ? "true" : undefined}
          onClick={onNavigateHome}
          aria-current={current === "home" ? "page" : undefined}
        >
          <GlobeIcon className="app-nav-icon" />
          <span>Home</span>
        </button>
        <button
          type="button"
          className="app-nav-item"
          data-active={current === "networks" ? "true" : undefined}
          onClick={onNavigateNetworks}
          aria-current={current === "networks" ? "page" : undefined}
        >
          <LayersIcon className="app-nav-icon" />
          <span>Networks</span>
        </button>
      </nav>
    </header>
  );
}
