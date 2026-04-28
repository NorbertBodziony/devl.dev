// @ts-nocheck
import { cn } from "../lib/utils";
export type ParticleImpulseRef = { current: number };
export type ParticleFieldProps = { src: string; class?: string; className?: string; alt?: string; typingImpulseRef?: ParticleImpulseRef; [key:string]: any };
export function pulseParticleTypingImpulse(impulseRef: ParticleImpulseRef, amount = 0.14) { impulseRef.current = Math.min((impulseRef.current || 0) + amount, 1.35); }
export function pulseParticleSubmitImpulse(impulseRef: ParticleImpulseRef) { pulseParticleTypingImpulse(impulseRef, 0.52); window.setTimeout(() => pulseParticleTypingImpulse(impulseRef, 0.2), 120); }
export function bumpParticleTypingImpulse(impulseRef: ParticleImpulseRef, e: Pick<KeyboardEvent, "repeat" | "metaKey" | "ctrlKey" | "altKey" | "key">) { if (e.repeat || e.metaKey || e.ctrlKey || e.altKey || e.key === "Tab" || e.key === "Escape") return; pulseParticleTypingImpulse(impulseRef); }
export const bumpParticleSubmitImpulse = pulseParticleSubmitImpulse;
export function ParticleField(props: ParticleFieldProps) { return <div class={cn("relative overflow-hidden", props.className, props.class)}><img src={props.src} alt={props.alt || ""} class="size-full object-contain opacity-80" /></div>; }
