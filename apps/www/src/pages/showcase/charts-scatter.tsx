import { ScatterBubbleChart } from "@orbit/ui/charts/scatter-bubble";
import { Eyebrow, Heading, Text } from "@orbit/ui/typography";

const POINTS = [
  { name: "Acme", x: 9.1, y: 92, size: 124, highlight: true },
  { name: "Initech", x: 7.4, y: 68, size: 88 },
  { name: "Stark", x: 8.6, y: 84, size: 104 },
  { name: "Wayne", x: 6.9, y: 78, size: 72 },
  { name: "Hooli", x: 8.1, y: 74, size: 91 },
  { name: "Pied Piper", x: 5.4, y: 41, size: 32, highlight: true },
  { name: "Aperture", x: 7.0, y: 62, size: 47 },
  { name: "Globex", x: 4.2, y: 48, size: 28 },
  { name: "Cyberdyne", x: 8.9, y: 88, size: 116 },
  { name: "Soylent", x: 3.6, y: 35, size: 22, highlight: true },
  { name: "Tyrell", x: 9.4, y: 95, size: 142 },
  { name: "Massive Dyn.", x: 6.2, y: 56, size: 41 },
  { name: "Vandelay", x: 7.8, y: 80, size: 68 },
  { name: "Bluth", x: 5.0, y: 52, size: 36 },
  { name: "Rekall", x: 4.8, y: 30, size: 24 },
];

export function ChartsScatterShowcasePage() {
  return (
    <div class="min-h-svh bg-background px-4 py-10 sm:px-10">
      <div class="mx-auto max-w-5xl">
        <Eyebrow>
          Account health · top 15 customers
        </Eyebrow>
        <Heading as="h1" size="lg" class="mt-1 tracking-normal">
          Satisfaction × retention
        </Heading>
        <Text tone="muted" size="sm" class="mt-1">
          Bubble size = MRR. Bottom-left quadrant flags churn risk.
        </Text>

        <ScatterBubbleChart
          class="mt-6"
          footerLabel="satisfaction (NPS proxy)"
          footerValue="3 outliers flagged"
          points={POINTS}
        />
      </div>
    </div>
  );
}
