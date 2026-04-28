// @ts-nocheck
import type { JSX } from "solid-js"; import { OrbitAvatar, type OrbitAvatarTone } from "./orbit-avatar";
export type OrbitAvatarFieldProps = { seed: string; size?: number; tone?: OrbitAvatarTone; backdrop?: boolean; class?: string; className?: string; style?: JSX.CSSProperties; title?: string };
export function OrbitAvatarField(props: OrbitAvatarFieldProps) { return <OrbitAvatar {...props} />; }
