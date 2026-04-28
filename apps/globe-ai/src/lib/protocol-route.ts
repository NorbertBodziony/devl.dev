import { PROTOCOLS } from "./protocols";
import type { Protocol } from "./types";

const PROTOCOL_PREFIX = "/protocol/";

export function getProtocolIdFromPath(pathname: string) {
  if (!pathname.startsWith(PROTOCOL_PREFIX)) return null;
  return decodeURIComponent(pathname.slice(PROTOCOL_PREFIX.length)).split("/")[0] || null;
}

export function isProtocolPath(pathname: string) {
  return getProtocolIdFromPath(pathname) !== null;
}

export function getProtocolFromPath(pathname: string): Protocol | null {
  const protocolId = getProtocolIdFromPath(pathname);
  if (!protocolId) return null;
  return PROTOCOLS.find((protocol) => protocol.id === protocolId) ?? null;
}

export function navigateToProtocol(protocolId: string) {
  window.history.pushState(null, "", `/protocol/${encodeURIComponent(protocolId)}`);
}

export function navigateToGlobe() {
  window.history.pushState(null, "", "/");
}
