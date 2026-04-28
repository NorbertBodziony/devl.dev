// @ts-nocheck
import { createContext, createEffect, createMemo, createSignal, onCleanup, untrack, useContext, type JSX } from "solid-js";
import { isOrbitThemePalette, type OrbitThemePalette } from "../themes/types.ts";
import { DEFAULT_PALETTE } from "../themes/palettes.ts";

export const ORBIT_THEME_STORAGE_KEY = "orbit-theme";
export const ORBIT_THEME_PALETTE_STORAGE_KEY = "orbit-theme-palette";
export type OrbitThemePreference = "light" | "dark" | "system";

function readPreference(): OrbitThemePreference { if (typeof window === "undefined") return "system"; try { const raw = localStorage.getItem(ORBIT_THEME_STORAGE_KEY); if (raw === "light" || raw === "dark" || raw === "system") return raw; } catch {} return "system"; }
function readPalette(): OrbitThemePalette { if (typeof window === "undefined") return DEFAULT_PALETTE; try { const raw = localStorage.getItem(ORBIT_THEME_PALETTE_STORAGE_KEY); if (isOrbitThemePalette(raw)) return raw; } catch {} return DEFAULT_PALETTE; }
function readOsScheme(): "light" | "dark" { if (typeof window === "undefined") return "dark"; return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light"; }

type ThemeContextValue = { readonly preference: OrbitThemePreference; readonly resolved: "light" | "dark"; readonly palette: OrbitThemePalette; setPreference: (p: OrbitThemePreference) => void; setPalette: (p: OrbitThemePalette) => void; toggleLightDark: () => void; };
const ThemeContext = createContext<ThemeContextValue>();

export function ThemeProvider(props: { children: JSX.Element }) {
  const [preference, setPreferenceState] = createSignal<OrbitThemePreference>(untrack(() => typeof window === "undefined" ? "system" : readPreference()));
  const [osScheme, setOsScheme] = createSignal<"light" | "dark">(untrack(() => typeof window === "undefined" ? "dark" : readOsScheme()));
  const [palette, setPaletteState] = createSignal<OrbitThemePalette>(untrack(() => typeof window === "undefined" ? DEFAULT_PALETTE : readPalette()));
  const resolved = createMemo(() => preference() === "system" ? osScheme() : preference() as "light" | "dark");
  createEffect(() => { if (typeof document !== "undefined") document.documentElement.classList.toggle("dark", resolved() === "dark"); });
  createEffect(() => { if (typeof document !== "undefined") document.documentElement.setAttribute("data-palette", palette()); });
  createEffect(() => { try { localStorage.setItem(ORBIT_THEME_STORAGE_KEY, preference()); } catch {} });
  createEffect(() => { try { localStorage.setItem(ORBIT_THEME_PALETTE_STORAGE_KEY, palette()); } catch {} });
  createEffect(() => { if (typeof window === "undefined" || preference() !== "system") return; const mq = window.matchMedia("(prefers-color-scheme: dark)"); const onChange = () => setOsScheme(mq.matches ? "dark" : "light"); onChange(); mq.addEventListener("change", onChange); onCleanup(() => mq.removeEventListener("change", onChange)); });
  const value: ThemeContextValue = { get preference() { return preference(); }, get resolved() { return resolved(); }, get palette() { return palette(); }, setPreference: setPreferenceState, setPalette: setPaletteState, toggleLightDark: () => setPreferenceState((prev) => { const current = prev === "system" ? readOsScheme() : prev; return current === "dark" ? "light" : "dark"; }) };
  return <ThemeContext.Provider value={value}>{props.children}</ThemeContext.Provider>;
}
export function useTheme(): ThemeContextValue { const ctx = useContext(ThemeContext); if (!ctx) throw new Error("useTheme must be used within ThemeProvider"); return ctx; }
