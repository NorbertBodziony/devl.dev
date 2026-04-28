import createGlobe, { type COBEOptions, type Marker } from "cobe";
import { useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  getCountryName,
  loadCountryFeatures,
  type CountryFeature,
} from "@/lib/countries";
import type { Protocol, WalletPin } from "@/lib/types";

type Props = {
  protocols: Protocol[];
  pins: WalletPin[];
  pinMode: boolean;
  onCountrySelected: (country: string, feature: CountryFeature) => void;
  onProtocolSelected: (protocol: Protocol) => void;
  onProtocolPreviewChange?: (protocol: Protocol | null, anchor?: { x: number; y: number }) => void;
};

type CobeTheme = {
  foreground: [number, number, number];
  primary: [number, number, number];
  info: [number, number, number];
  success: [number, number, number];
  warning: [number, number, number];
  muted: [number, number, number];
  chart: [number, number, number][];
};

type MarkerStyle = React.CSSProperties & {
  positionAnchor?: string;
  "--cobe-marker-visibility"?: string;
};

type DragState = {
  x: number;
  y: number;
  phi: number;
  theta: number;
};

const CHART_TOKENS = [
  "--chart-1",
  "--chart-2",
  "--chart-3",
  "--chart-4",
  "--chart-5",
] as const;

const PIN_COUNTRY_TARGETS = [
  { country: "United States of America", label: "United States", lat: 37.7749, lng: -122.4194 },
  { country: "United Kingdom", label: "United Kingdom", lat: 51.5072, lng: -0.1276 },
  { country: "Germany", label: "Germany", lat: 52.52, lng: 13.405 },
  { country: "France", label: "France", lat: 48.8566, lng: 2.3522 },
  { country: "Singapore", label: "Singapore", lat: 1.3521, lng: 103.8198 },
  { country: "Japan", label: "Japan", lat: 35.6762, lng: 139.6503 },
  { country: "India", label: "India", lat: 19.076, lng: 72.8777 },
  { country: "Brazil", label: "Brazil", lat: -23.5505, lng: -46.6333 },
] as const;

const MIN_GLOBE_ZOOM = 0.72;
const MAX_GLOBE_ZOOM = 1.82;
const WHEEL_ZOOM_SPEED = 0.0012;
const AUTO_ROTATION_SPEED = 0.0021;
const DRAG_THETA_LIMIT = 0.68;
const DRAG_THETA_DAMPING = 0.82;
const DRAG_INERTIA_FRICTION = 0.92;
const DRAG_INERTIA_STOP = 0.00005;

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

function baseGlobeScale(width: number) {
  return width < 680 ? 0.9 : 1.08;
}

function pointerDistance(points: Map<number, { x: number; y: number }>) {
  const [first, second] = Array.from(points.values());
  if (!first || !second) return 0;
  return Math.hypot(second.x - first.x, second.y - first.y);
}

function globeDragRadius(width: number, height: number, scale: number) {
  return Math.max(180, (Math.min(width, height) * scale) / 2);
}

function clampChannel(value: number) {
  return Math.min(255, Math.max(0, Math.round(value)));
}

function parseColorNumbers(value: string) {
  return value.match(/-?\d*\.?\d+(?:e[-+]?\d+)?%?/gi) ?? [];
}

function parseColorChannel(value: string, scale = 255) {
  if (value.endsWith("%")) return (Number(value.slice(0, -1)) / 100) * scale;
  const number = Number(value);
  return number <= 1 ? number * scale : number;
}

function linearToSrgb(value: number) {
  const channel = Math.min(1, Math.max(0, value));
  if (channel <= 0.0031308) return channel * 12.92;
  return 1.055 * channel ** (1 / 2.4) - 0.055;
}

function oklabToRgb(lightness: number, a: number, b: number): [number, number, number] {
  const lPrime = lightness + 0.3963377774 * a + 0.2158037573 * b;
  const mPrime = lightness - 0.1055613458 * a - 0.0638541728 * b;
  const sPrime = lightness - 0.0894841775 * a - 1.291485548 * b;
  const l = lPrime ** 3;
  const m = mPrime ** 3;
  const s = sPrime ** 3;

  return [
    clampChannel(linearToSrgb(4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s) * 255),
    clampChannel(linearToSrgb(-1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s) * 255),
    clampChannel(linearToSrgb(-0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s) * 255),
  ];
}

function colorStringToRgb(color: string): [number, number, number] | null {
  const trimmed = color.trim();
  const numbers = parseColorNumbers(trimmed);

  if (trimmed.startsWith("color(srgb") && numbers.length >= 3) {
    return [
      clampChannel(parseColorChannel(numbers[0]!)),
      clampChannel(parseColorChannel(numbers[1]!)),
      clampChannel(parseColorChannel(numbers[2]!)),
    ];
  }

  if (trimmed.startsWith("oklab(") && numbers.length >= 3) {
    return oklabToRgb(
      parseColorChannel(numbers[0]!, 1),
      Number(numbers[1]),
      Number(numbers[2]),
    );
  }

  if (trimmed.startsWith("oklch(") && numbers.length >= 3) {
    const lightness = parseColorChannel(numbers[0]!, 1);
    const chroma = Number(numbers[1]);
    const hue = (Number(numbers[2]) * Math.PI) / 180;
    return oklabToRgb(lightness, chroma * Math.cos(hue), chroma * Math.sin(hue));
  }

  const hex = trimmed.match(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i)?.[1];
  if (hex) {
    const normalized =
      hex.length === 3
        ? hex
            .split("")
            .map((value) => value + value)
            .join("")
        : hex;
    const value = Number.parseInt(normalized, 16);
    return [(value >> 16) & 255, (value >> 8) & 255, value & 255];
  }

  if (numbers.length >= 3) {
    return [
      clampChannel(Number(numbers[0])),
      clampChannel(Number(numbers[1])),
      clampChannel(Number(numbers[2])),
    ];
  }

  return null;
}

function resolveTokenColor(token: string, fallback: [number, number, number]) {
  if (typeof document === "undefined") return fallback;

  const probe = document.createElement("span");
  probe.style.color = `var(${token})`;
  probe.style.position = "absolute";
  probe.style.pointerEvents = "none";
  probe.style.visibility = "hidden";
  document.body.append(probe);
  const computedColor = getComputedStyle(probe).color;
  probe.remove();

  return colorStringToRgb(computedColor) ?? fallback;
}

function toUnitColor(color: [number, number, number]): [number, number, number] {
  return [color[0] / 255, color[1] / 255, color[2] / 255];
}

function readTheme(): CobeTheme {
  return {
    foreground: toUnitColor(resolveTokenColor("--foreground", [245, 245, 245])),
    primary: toUnitColor(resolveTokenColor("--primary", [245, 245, 245])),
    info: toUnitColor(resolveTokenColor("--info", [96, 165, 250])),
    success: toUnitColor(resolveTokenColor("--success", [16, 185, 129])),
    warning: toUnitColor(resolveTokenColor("--warning", [245, 158, 11])),
    muted: toUnitColor(resolveTokenColor("--muted-foreground", [161, 161, 170])),
    chart: CHART_TOKENS.map((token) =>
      toUnitColor(resolveTokenColor(token, [96, 165, 250])),
    ),
  };
}

function markerAnchorStyle(id: string): MarkerStyle {
  return {
    positionAnchor: `--cobe-${id}`,
    "--cobe-marker-visibility": `var(--cobe-visible-${id}, 0)`,
    opacity: "var(--cobe-marker-visibility)",
  };
}

function markerId(prefix: string, value: string) {
  return `${prefix}-${value.replace(/[^a-zA-Z0-9_-]/g, "-")}`;
}

function findCountryFeature(features: CountryFeature[], country: string) {
  return features.find((feature) => getCountryName(feature) === country) ?? null;
}

export function GlobeScene({
  protocols,
  pins,
  pinMode,
  onCountrySelected,
  onProtocolSelected,
  onProtocolPreviewChange,
}: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const globeRef = useRef<ReturnType<typeof createGlobe> | null>(null);
  const phiRef = useRef(-0.46);
  const thetaRef = useRef(0.24);
  const zoomRef = useRef(1);
  const dragRef = useRef<DragState | null>(null);
  const rotationVelocityRef = useRef({ phi: 0, theta: 0 });
  const markerHoverRef = useRef(false);
  const activePointersRef = useRef(new Map<number, { x: number; y: number }>());
  const pinchRef = useRef<{ distance: number; zoom: number } | null>(null);
  const [size, setSize] = useState({ width: 1, height: 1 });
  const [countryFeatures, setCountryFeatures] = useState<CountryFeature[]>([]);
  const [hoveredCountry, setHoveredCountry] = useState<string | null>(null);
  const [anchorRoot, setAnchorRoot] = useState<HTMLElement | null>(null);

  const protocolMarkers = useMemo<Marker[]>(
    () =>
      protocols.map((protocol, index) => ({
        id: markerId("protocol", protocol.id),
        location: [protocol.lat, protocol.lng],
        size: 0,
        color: readTheme().chart[index % CHART_TOKENS.length] ?? readTheme().muted,
      })),
    [protocols],
  );

  const pinMarkers = useMemo<Marker[]>(
    () =>
      pins.map((pin) => ({
        id: markerId("pin", pin.id),
        location: [pin.lat, pin.lng],
        size: 0.03,
        color: readTheme().success,
      })),
    [pins],
  );

  const pinTargetMarkers = useMemo<Marker[]>(
    () =>
      PIN_COUNTRY_TARGETS.map((target) => ({
        id: markerId("target", target.country),
        location: [target.lat, target.lng],
        size: pinMode ? 0.028 : 0.001,
        color: readTheme().warning,
      })),
    [pinMode],
  );

  const markers = useMemo(
    () => [...protocolMarkers, ...pinMarkers, ...pinTargetMarkers],
    [pinMarkers, pinTargetMarkers, protocolMarkers],
  );

  useEffect(() => {
    let cancelled = false;
    loadCountryFeatures()
      .then((features) => {
        if (!cancelled) setCountryFeatures(features);
      })
      .catch(console.error);
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new ResizeObserver(([entry]) => {
      if (!entry) return;
      setSize({
        width: Math.max(1, Math.round(entry.contentRect.width)),
        height: Math.max(1, Math.round(entry.contentRect.height)),
      });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const theme = readTheme();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const width = Math.round(size.width * dpr);
    const height = Math.round(size.height * dpr);
    const baseScale = baseGlobeScale(size.width);
    let animationFrame = 0;
    let pausedUntil = 0;

    const options: COBEOptions = {
      devicePixelRatio: dpr,
      width,
      height,
      phi: phiRef.current,
      theta: thetaRef.current,
      dark: 1,
      diffuse: 2.4,
      mapSamples: 22000,
      mapBrightness: 4.8,
      mapBaseBrightness: 0.03,
      baseColor: [0.16, 0.17, 0.18],
      markerColor: theme.info,
      glowColor: theme.primary,
      markerElevation: 0.025,
      scale: baseScale * zoomRef.current,
      offset: [0, size.width < 680 ? 26 : 18],
      opacity: 0.96,
      markers,
      context: {
        alpha: true,
        antialias: true,
        preserveDrawingBuffer: true,
      },
    };

    const globe = createGlobe(canvas, options);
    const cobeWrapper = canvas.parentElement;
    const cobeHost = cobeWrapper?.parentElement;
    globeRef.current = globe;
    setAnchorRoot(cobeWrapper ?? null);

    const dragSensitivity = () => {
      const radius = globeDragRadius(size.width, size.height, baseScale * zoomRef.current);
      return {
        phi: 1 / radius,
        theta: DRAG_THETA_DAMPING / radius,
      };
    };

    const animate = () => {
      const velocity = rotationVelocityRef.current;

      if (!dragRef.current && (Math.abs(velocity.phi) > 0 || Math.abs(velocity.theta) > 0)) {
        phiRef.current += velocity.phi;
        thetaRef.current = clamp(
          thetaRef.current + velocity.theta,
          -DRAG_THETA_LIMIT,
          DRAG_THETA_LIMIT,
        );
        velocity.phi *= DRAG_INERTIA_FRICTION;
        velocity.theta *= DRAG_INERTIA_FRICTION;

        if (Math.abs(velocity.phi) < DRAG_INERTIA_STOP) velocity.phi = 0;
        if (Math.abs(velocity.theta) < DRAG_INERTIA_STOP) velocity.theta = 0;
      } else if (!dragRef.current && !markerHoverRef.current && Date.now() > pausedUntil) {
        phiRef.current += AUTO_ROTATION_SPEED;
      }
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        scale: baseScale * zoomRef.current,
        markers,
      });
      animationFrame = requestAnimationFrame(animate);
    };
    animationFrame = requestAnimationFrame(animate);

    const pause = () => {
      pausedUntil = Date.now() + 9000;
    };

    const updateZoom = (nextZoom: number) => {
      const zoom = clamp(nextZoom, MIN_GLOBE_ZOOM, MAX_GLOBE_ZOOM);
      if (zoom === zoomRef.current) return;
      zoomRef.current = zoom;
      globe.update({
        phi: phiRef.current,
        theta: thetaRef.current,
        scale: baseScale * zoomRef.current,
        markers,
      });
    };

    const handleWheel = (event: WheelEvent) => {
      event.preventDefault();
      updateZoom(zoomRef.current * Math.exp(-event.deltaY * WHEEL_ZOOM_SPEED));
      pause();
    };

    const handlePointerDown = (event: PointerEvent) => {
      canvas.setPointerCapture(event.pointerId);
      activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      rotationVelocityRef.current = { phi: 0, theta: 0 };

      if (activePointersRef.current.size >= 2) {
        pinchRef.current = {
          distance: pointerDistance(activePointersRef.current),
          zoom: zoomRef.current,
        };
        dragRef.current = null;
        pause();
        return;
      }

      dragRef.current = {
        x: event.clientX,
        y: event.clientY,
        phi: phiRef.current,
        theta: thetaRef.current,
      };
      pause();
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (activePointersRef.current.has(event.pointerId)) {
        activePointersRef.current.set(event.pointerId, { x: event.clientX, y: event.clientY });
      }

      const pinch = pinchRef.current;
      if (pinch && activePointersRef.current.size >= 2) {
        const distance = pointerDistance(activePointersRef.current);
        if (distance > 0 && pinch.distance > 0) {
          updateZoom(pinch.zoom * (distance / pinch.distance));
        }
        rotationVelocityRef.current = { phi: 0, theta: 0 };
        pause();
        return;
      }

      const drag = dragRef.current;
      if (!drag) return;
      const sensitivity = dragSensitivity();
      const nextPhi = drag.phi + (event.clientX - drag.x) * sensitivity.phi;
      const nextTheta = clamp(
        drag.theta - (event.clientY - drag.y) * sensitivity.theta,
        -DRAG_THETA_LIMIT,
        DRAG_THETA_LIMIT,
      );
      rotationVelocityRef.current = {
        phi: nextPhi - phiRef.current,
        theta: nextTheta - thetaRef.current,
      };
      phiRef.current = nextPhi;
      thetaRef.current = nextTheta;
      pause();
    };

    const handlePointerUp = (event: PointerEvent) => {
      activePointersRef.current.delete(event.pointerId);
      pinchRef.current = null;

      if (canvas.hasPointerCapture(event.pointerId)) {
        canvas.releasePointerCapture(event.pointerId);
      }

      const [remainingPointer] = activePointersRef.current.values();
      dragRef.current = remainingPointer
        ? {
            x: remainingPointer.x,
            y: remainingPointer.y,
            phi: phiRef.current,
            theta: thetaRef.current,
          }
        : null;
      pause();
    };

    canvas.addEventListener("wheel", handleWheel, { passive: false });
    canvas.addEventListener("pointerdown", handlePointerDown);
    canvas.addEventListener("pointermove", handlePointerMove);
    canvas.addEventListener("pointerup", handlePointerUp);
    canvas.addEventListener("pointercancel", handlePointerUp);

    return () => {
      cancelAnimationFrame(animationFrame);
      canvas.removeEventListener("wheel", handleWheel);
      canvas.removeEventListener("pointerdown", handlePointerDown);
      canvas.removeEventListener("pointermove", handlePointerMove);
      canvas.removeEventListener("pointerup", handlePointerUp);
      canvas.removeEventListener("pointercancel", handlePointerUp);
      activePointersRef.current.clear();
      pinchRef.current = null;
      dragRef.current = null;
      rotationVelocityRef.current = { phi: 0, theta: 0 };
      markerHoverRef.current = false;
      setAnchorRoot(null);
      globe.destroy();
      if (cobeHost && cobeWrapper && canvas.parentElement === cobeWrapper) {
        cobeHost.insertBefore(canvas, cobeWrapper);
        cobeWrapper.remove();
      }
      globeRef.current = null;
    };
  }, [markers, size.height, size.width]);

  const selectCountry = (country: string) => {
    const feature = findCountryFeature(countryFeatures, country);
    if (feature) onCountrySelected(country, feature);
  };

  const handleMarkerEnter = (
    protocol?: Protocol,
    event?: React.PointerEvent<HTMLElement> | React.FocusEvent<HTMLElement>,
  ) => {
    markerHoverRef.current = true;

    if (protocol && event) {
      const rect = event.currentTarget.getBoundingClientRect();
      const pointerX = "clientX" in event && event.clientX > 0 ? event.clientX : rect.left + rect.width / 2;
      const pointerY = "clientY" in event && event.clientY > 0 ? event.clientY : rect.top;
      onProtocolPreviewChange?.(protocol, {
        x: pointerX,
        y: pointerY,
      });
    }
  };

  const handleMarkerLeave = (protocol?: Protocol) => {
    markerHoverRef.current = false;
    if (protocol) onProtocolPreviewChange?.(null);
  };

  const markerLayer = (
    <div className="cobe-marker-layer" aria-label="Protocol markers">
          {protocols.map((protocol) => {
            const id = markerId("protocol", protocol.id);
            return (
              <button
                key={protocol.id}
                type="button"
                className="protocol-marker cobe-marker"
                style={markerAnchorStyle(id)}
                onPointerEnter={(event) => handleMarkerEnter(protocol, event)}
                onPointerLeave={() => handleMarkerLeave(protocol)}
                onFocus={(event) => handleMarkerEnter(protocol, event)}
                onBlur={() => handleMarkerLeave(protocol)}
                onClick={() => onProtocolSelected(protocol)}
                aria-label={`${protocol.name} protocol marker`}
              >
                <span className="protocol-marker-logo">
                  {protocol.logo ? <img src={protocol.logo} alt="" /> : protocol.symbol.slice(0, 3)}
                </span>
                <span className="protocol-marker-label">{protocol.name}</span>
              </button>
            );
          })}

          {pins.map((pin) => {
            const id = markerId("pin", pin.id);
            return (
              <span
                key={pin.id}
                className="wallet-pin-marker"
                style={markerAnchorStyle(id)}
                onPointerEnter={() => handleMarkerEnter()}
                onPointerLeave={() => handleMarkerLeave()}
                title={pin.country}
              />
            );
          })}

          {pinMode
            ? PIN_COUNTRY_TARGETS.map((target) => {
                const id = markerId("target", target.country);
                return (
                  <button
                    key={target.country}
                    type="button"
                    className="country-target-marker"
                    style={markerAnchorStyle(id)}
                    onClick={() => selectCountry(target.country)}
                    onPointerEnter={() => {
                      handleMarkerEnter();
                      setHoveredCountry(target.label);
                    }}
                    onPointerLeave={() => {
                      handleMarkerLeave();
                      setHoveredCountry(null);
                    }}
                  >
                    {target.label}
                  </button>
              );
            })
            : null}
    </div>
  );

  return (
    <section className="globe-stage cobe-stage" aria-label="Interactive DeFi globe">
      <div ref={containerRef} className="globe-canvas cobe-canvas-wrap">
        <canvas
          ref={canvasRef}
          className="cobe-canvas"
          style={{
            width: size.width,
            height: size.height,
          }}
          width={size.width * Math.min(window.devicePixelRatio || 1, 2)}
          height={size.height * Math.min(window.devicePixelRatio || 1, 2)}
        />
      </div>

      {anchorRoot ? createPortal(markerLayer, anchorRoot) : null}

      {hoveredCountry && (
        <div className="country-chip">
          <span>Pin target</span>
          <strong>{hoveredCountry}</strong>
          <small>Cobe marker</small>
        </div>
      )}
    </section>
  );
}
