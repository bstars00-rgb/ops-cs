import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type SopFrontmatter = {
  id: string;
  title: string;
  version: string;
  effective_date: string;
  prepared_by: string;
  team: string;
  category: string;
  summary: string;
  keywords?: string[];
  related?: string[];
  escalation_to?: string;
  estimated_time_minutes?: number;
  recurrence?: string;
};

export type Sop = SopFrontmatter & {
  slug: string;
  content: string; // raw markdown body
};

const SOPS_DIR = path.join(process.cwd(), "sops");

let cache: Sop[] | null = null;

export function getAllSops(): Sop[] {
  if (cache) return cache;
  if (!fs.existsSync(SOPS_DIR)) return [];

  const files = fs
    .readdirSync(SOPS_DIR)
    .filter((f) => f.startsWith("SOP-") && f.endsWith(".md"));

  const sops: Sop[] = files.map((filename) => {
    const filePath = path.join(SOPS_DIR, filename);
    const raw = fs.readFileSync(filePath, "utf8");
    const { data, content } = matter(raw);
    const slug = filename.replace(/\.md$/, "");

    // YAML auto-converts ISO dates to Date objects — coerce back to "YYYY-MM-DD" strings
    // so React can render them directly.
    const normalize = (v: unknown): unknown => {
      if (v instanceof Date) return v.toISOString().split("T")[0];
      if (Array.isArray(v)) return v.map(normalize);
      if (v && typeof v === "object") {
        const out: Record<string, unknown> = {};
        for (const [k, val] of Object.entries(v as Record<string, unknown>)) {
          out[k] = normalize(val);
        }
        return out;
      }
      return v;
    };
    const normalized = normalize(data) as Record<string, unknown>;

    return {
      ...(normalized as SopFrontmatter),
      slug,
      content,
    };
  });

  // Sort by id
  sops.sort((a, b) => a.id.localeCompare(b.id));
  cache = sops;
  return sops;
}

export function getSopBySlug(slug: string): Sop | undefined {
  return getAllSops().find((s) => s.slug === slug);
}

export function getSopCategories(): { category: string; count: number }[] {
  const map = new Map<string, number>();
  for (const s of getAllSops()) {
    map.set(s.category, (map.get(s.category) || 0) + 1);
  }
  return [...map.entries()]
    .map(([category, count]) => ({ category, count }))
    .sort((a, b) => b.count - a.count);
}
