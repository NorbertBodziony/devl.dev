import { BoxesIcon, GlobeIcon, LayersIcon } from "lucide-react";

export type AppHeaderRoute = "home" | "networks" | "projects" | null;

type AppHeaderProps = {
  current: AppHeaderRoute;
  onNavigateHome: () => void;
  onNavigateNetworks: () => void;
  onNavigateProjects: () => void;
};

export function AppHeader({
  current,
  onNavigateHome,
  onNavigateNetworks,
  onNavigateProjects,
}: AppHeaderProps) {
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
        <button
          type="button"
          className="app-nav-item"
          data-active={current === "projects" ? "true" : undefined}
          onClick={onNavigateProjects}
          aria-current={current === "projects" ? "page" : undefined}
        >
          <BoxesIcon className="app-nav-icon" />
          <span>Projects</span>
        </button>
      </nav>
    </header>
  );
}
