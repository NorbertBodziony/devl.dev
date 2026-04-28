// @ts-nocheck
import { Moon, Sun } from "lucide-solid"; import { Button } from "./ui/button"; import { useTheme } from "./theme-provider";
export function ThemeToggle(props: { class?: string; className?: string }) { const theme = useTheme(); return <Button type="button" variant="ghost" size="icon" class={props.class || props.className} aria-label={theme.resolved === "dark" ? "Switch to light mode" : "Switch to dark mode"} onClick={theme.toggleLightDark}>{theme.resolved === "dark" ? <Sun /> : <Moon />}</Button>; }
