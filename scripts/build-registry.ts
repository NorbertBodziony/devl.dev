#!/usr/bin/env tsx
/**
 * Generate shadcn registry items, one per showcase, into
 * apps/www/public/r/<category>/<design>.json.
 *
 * Each item's source has its `@orbit/ui/<name>` imports rewritten to
 * `@/components/ui/<name>` and inlines the local Solid UI files it uses.
 *
 * Some `@orbit/ui` exports aren't published to the public coss registry
 * (see LOCAL_INLINES). For those, the source is recursively inlined into
 * the registry item along with any of its transitive imports inside the
 * `@orbit/ui` package.
 */
import { existsSync } from "node:fs";
import { readFile, writeFile, mkdir, rm } from "node:fs/promises";
import { resolve, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

import { SOURCE_FILES } from "../apps/www/src/pages/showcase/source-files";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = resolve(__dirname, "..");
const APP_SRC_DIR = resolve(ROOT, "apps/www/src");
const UI_PKG_DIR = resolve(ROOT, "packages/ui/src");
const SHOWCASE_DIR = resolve(APP_SRC_DIR, "pages/showcase");
const OUT_DIR = resolve(ROOT, "apps/www/public/r");

// Known external package dependencies that show up in showcases. Anything not in
// this set is assumed to be a workspace/coss/local import we don't need
// to surface as a package dependency.
const TRACKED_PACKAGE_DEPS = new Set([
  "lucide-solid",
  "solid-js",
]);

// `@orbit/ui/<name>` exports that are NOT published to the public coss
// registry — their source is inlined into each registry item that uses
// them (along with transitive imports inside @orbit/ui). The value is
// the path inside packages/ui/src where the source lives.
const LOCAL_INLINES: Record<string, string> = {
  "particle-field": "components/particle-field.tsx",
  "theme-provider": "components/theme-provider.tsx",
};

interface RegistryFile {
  path: string;
  content: string;
  type: "registry:component" | "registry:lib";
}

interface RegistryItem {
  $schema: string;
  name: string;
  type: "registry:component";
  title: string;
  registryDependencies?: string[];
  dependencies?: string[];
  files: RegistryFile[];
}

interface InlinedFile {
  // Consumer-relative output path used as `files[].path`.
  outputPath: string;
  type: RegistryFile["type"];
  content: string;
}

interface CrawlResult {
  showcaseFiles: { name: string; content: string }[];
  inlined: InlinedFile[];
  registryDeps: Set<string>;
  packageDeps: Set<string>;
}

function titleCase(slug: string): string {
  return slug
    .split("-")
    .map((s) => (s ? s[0]!.toUpperCase() + s.slice(1) : s))
    .join(" ");
}

// Map an absolute path inside packages/ui/src or apps/www/src to the
// consumer's corresponding `@/...` alias and the registry output path.
// Returns `output: null` when the consumer is expected to already have
// the file (e.g. `lib/utils.ts` is created by `shadcn init`).
function mapLibraryPath(absPath: string): {
  alias: string;
  // null when the consumer is expected to already have the file, e.g.
  // `lib/utils` from the target app template.
  output: string | null;
  type: RegistryFile["type"];
  // Reserved for old registry dependency mapping; Solid files are inlined.
  cossDep?: string;
} {
  if (absPath.startsWith(APP_SRC_DIR)) {
    const rel = relative(APP_SRC_DIR, absPath);

    let m = rel.match(/^components\/([a-z0-9-_]+)\.tsx$/);
    if (m) {
      return {
        alias: `@/components/${m[1]}`,
        output: `components/${m[1]}.tsx`,
        type: "registry:component",
      };
    }

    m = rel.match(/^lib\/([a-z0-9-_]+)\.ts$/);
    if (m) {
      return {
        alias: `@/lib/${m[1]}`,
        output: `lib/${m[1]}.ts`,
        type: "registry:lib",
      };
    }

    throw new Error(`unmapped app path: ${rel}`);
  }

  const rel = relative(UI_PKG_DIR, absPath);

  if (rel === "lib/utils.ts") {
    return { alias: "@/lib/utils", output: null, type: "registry:lib" };
  }

  // packages/ui/src/components/ui/<x>.tsx — Solid UI primitive.
  let m = rel.match(/^components\/ui\/([a-z0-9-_]+)\.tsx$/);
  if (m) {
    const name = m[1]!;
    return {
      alias: `@/components/ui/${name}`,
      output: `components/ui/${name}.tsx`,
      type: "registry:component",
    };
  }

  m = rel.match(/^components\/([a-z0-9-]+)\.tsx$/);
  if (m) {
    return {
      alias: `@/components/${m[1]}`,
      output: `components/${m[1]}.tsx`,
      type: "registry:component",
    };
  }

  m = rel.match(/^themes\/([a-z0-9-]+)\.ts$/);
  if (m) {
    return {
      alias: `@/lib/themes/${m[1]}`,
      output: `lib/themes/${m[1]}.ts`,
      type: "registry:lib",
    };
  }

  m = rel.match(/^hooks\/([a-z0-9-]+)\.ts$/);
  if (m) {
    return {
      alias: `@/hooks/${m[1]}`,
      output: `hooks/${m[1]}.ts`,
      type: "registry:lib",
    };
  }

  throw new Error(`unmapped library path: ${rel}`);
}

function rewriteShowcaseImports(source: string): string {
  let out = source.replace(
    /from\s+(["'])@orbit\/ui\/lib\/utils\1/g,
    "from $1@/lib/utils$1",
  );
  out = out.replace(
    /from\s+(["'])@orbit\/ui\/([a-z0-9-]+)\1/g,
    (_match, q: string, name: string) => {
      const dir = name in LOCAL_INLINES ? "components" : "components/ui";
      return `from ${q}@/${dir}/${name}${q}`;
    },
  );
  return out;
}

function resolveOrbitUiImport(importPath: string): string | null {
  if (importPath === "lib/utils") return null;
  const baseName = importPath.split("/").pop()!;
  if (LOCAL_INLINES[baseName]) {
    return resolve(UI_PKG_DIR, LOCAL_INLINES[baseName]!);
  }
  return resolve(UI_PKG_DIR, `components/ui/${baseName}.tsx`);
}

function resolveAppAliasImport(importPath: string): string | null {
  if (!importPath.startsWith("@/components/") && !importPath.startsWith("@/lib/solid-")) {
    return null;
  }
  const rel = importPath.slice(2);
  const candidates = [
    resolve(APP_SRC_DIR, `${rel}.tsx`),
    resolve(APP_SRC_DIR, `${rel}.ts`),
  ];
  return candidates.find((p) => existsSync(p)) ?? null;
}

// Rewrite imports in a file being inlined from packages/ui. Returns the
// rewritten source plus the absolute paths of any further library files
// to follow, and the registry / package deps it surfaces.
function rewriteLibraryFile(absPath: string, source: string): {
  rewritten: string;
  follow: string[];
  registryDeps: Set<string>;
  packageDeps: Set<string>;
} {
  const follow: string[] = [];
  const registryDeps = new Set<string>();
  const packageDeps = new Set<string>();

  // 1. Relative imports — resolve to an abs path, then map to alias.
  let out = source.replace(
    /from\s+(["'])(\.{1,2}\/[^"']+)\1/g,
    (_match, q: string, spec: string) => {
      const stripped = spec.replace(/\.tsx?$/, "");
      const candidates = [
        resolve(dirname(absPath), spec),
        resolve(dirname(absPath), `${stripped}.tsx`),
        resolve(dirname(absPath), `${stripped}.ts`),
      ];
      const target = candidates.find((p) => existsSync(p));
      if (!target) {
        throw new Error(
          `cannot resolve relative import "${spec}" from ${absPath}`,
        );
      }
      const { alias, output, cossDep } = mapLibraryPath(target);
      if (output) follow.push(target);
      return `from ${q}${alias}${q}`;
    },
  );

  // 2. @orbit/ui/<name> imports — rewrite to consumer alias and queue the
  //    Solid source file for inlining.
  out = out.replace(
    /from\s+(["'])@orbit\/ui\/([a-z0-9/-]+)\1/g,
    (_match, q: string, name: string) => {
      if (name === "lib/utils") return `from ${q}@/lib/utils${q}`;
      const target = resolveOrbitUiImport(name);
      if (target) follow.push(target);
      const { alias } = mapLibraryPath(target!);
      return `from ${q}${alias}${q}`;
    },
  );

  // 3. App-owned helpers used by showcases, such as chart wrappers and
  //    tiny Solid lifecycle utilities.
  out = out.replace(
    /from\s+(["'])(@\/[a-z0-9_/-]+)\1/g,
    (_match, q: string, spec: string) => {
      const target = resolveAppAliasImport(spec);
      if (target) follow.push(target);
      return `from ${q}${spec}${q}`;
    },
  );

  // 4. Track known package deps (anything not relative and not @/ or @orbit/).
  const importRe = /from\s+["']([^"']+)["']/g;
  for (const m of out.matchAll(importRe)) {
    const spec = m[1]!;
    if (TRACKED_PACKAGE_DEPS.has(spec)) packageDeps.add(spec);
  }

  return { rewritten: out, follow, registryDeps, packageDeps };
}

async function readShowcase(filename: string): Promise<string> {
  return readFile(resolve(SHOWCASE_DIR, `${filename}.tsx`), "utf8");
}

async function crawl(rootFilename: string): Promise<CrawlResult> {
  const visitedShowcase = new Set<string>();
  const visitedLib = new Set<string>();
  const showcaseFiles: { name: string; content: string }[] = [];
  const inlinedByOutput = new Map<string, InlinedFile>();
  const registryDeps = new Set<string>();
  const packageDeps = new Set<string>();
  const showcaseQueue: string[] = [rootFilename];
  const libQueue: string[] = [];

  const drainLibQueue = async () => {
    while (libQueue.length > 0) {
      const absPath = libQueue.shift()!;
      if (visitedLib.has(absPath)) continue;
      visitedLib.add(absPath);

      const { output, type } = mapLibraryPath(absPath);
      if (!output) continue;

      const raw = await readFile(absPath, "utf8");
      const { rewritten, follow, registryDeps: rDeps, packageDeps: nDeps } =
        rewriteLibraryFile(absPath, raw);

      for (const d of rDeps) registryDeps.add(d);
      for (const d of nDeps) packageDeps.add(d);
      for (const next of follow) libQueue.push(next);

      inlinedByOutput.set(output, { outputPath: output, type, content: rewritten });
    }
  };

  while (showcaseQueue.length > 0) {
    const fname = showcaseQueue.shift()!;
    if (visitedShowcase.has(fname)) continue;
    visitedShowcase.add(fname);

    let raw: string;
    try {
      raw = await readShowcase(fname);
    } catch {
      continue;
    }

    // @orbit/ui/<name> -> queue the Solid UI file used by this showcase.
    const orbitRe = /from\s+["']@orbit\/ui\/([a-z0-9/-]+)["']/g;
    for (const m of raw.matchAll(orbitRe)) {
      const importPath = m[1]!;
      const target = resolveOrbitUiImport(importPath);
      if (target) libQueue.push(target);
    }

    // App-owned helper imports used by showcases.
    const appAliasRe = /from\s+["'](@\/[a-z0-9_/-]+)["']/g;
    for (const m of raw.matchAll(appAliasRe)) {
      const target = resolveAppAliasImport(m[1]!);
      if (target) libQueue.push(target);
    }

    // Sibling/local showcase imports (./foo, ./_components/foo).
    const relRe = /from\s+["']\.\/([a-z0-9_/-]+)["']/g;
    for (const m of raw.matchAll(relRe)) {
      const sibling = m[1]!;
      if (!visitedShowcase.has(sibling)) showcaseQueue.push(sibling);
    }

    const importRe = /from\s+["']([^"']+)["']/g;
    for (const m of raw.matchAll(importRe)) {
      const spec = m[1]!;
      if (TRACKED_PACKAGE_DEPS.has(spec)) packageDeps.add(spec);
    }

    showcaseFiles.push({ name: fname, content: rewriteShowcaseImports(raw) });

    await drainLibQueue();
  }

  await drainLibQueue();

  return {
    showcaseFiles,
    inlined: [...inlinedByOutput.values()],
    registryDeps,
    packageDeps,
  };
}

async function main() {
  await rm(OUT_DIR, { recursive: true, force: true });
  await mkdir(OUT_DIR, { recursive: true });

  let count = 0;
  for (const [category, designs] of Object.entries(SOURCE_FILES)) {
    if (!designs) continue;
    const catDir = resolve(OUT_DIR, category);
    await mkdir(catDir, { recursive: true });

    for (const [designSlug, filename] of Object.entries(designs)) {
      const { showcaseFiles, inlined, registryDeps, packageDeps } =
        await crawl(filename);
      if (showcaseFiles.length === 0) {
        console.warn(`skip ${category}/${designSlug}: no source for ${filename}`);
        continue;
      }
      const item: RegistryItem = {
        $schema: "https://ui.shadcn.com/schema/registry-item.json",
        name: `${category}-${designSlug}`,
        type: "registry:component",
        title: titleCase(designSlug),
        files: [
          ...showcaseFiles.map((f) => ({
            path: `components/${f.name}.tsx`,
            content: f.content,
            type: "registry:component" as const,
          })),
          ...inlined.map((f) => ({
            path: f.outputPath,
            content: f.content,
            type: f.type,
          })),
        ],
      };
      if (registryDeps.size > 0) {
        item.registryDependencies = [...registryDeps].sort();
      }
      if (packageDeps.size > 0) {
        item.dependencies = [...packageDeps].sort();
      }
      await writeFile(
        resolve(catDir, `${designSlug}.json`),
        JSON.stringify(item, null, 2) + "\n",
      );
      count++;
    }
  }
  console.log(`wrote ${count} registry entries to ${OUT_DIR}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
