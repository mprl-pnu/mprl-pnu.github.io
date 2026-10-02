/**
 * Loads and validates everything in src/data/*.yaml.
 * A typo in a data file stops the build with a message pointing at the file and the entry.
 */
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { load as parseYaml } from 'js-yaml';
import { z } from 'astro/zod';

import siteRaw from '../data/site.yaml?raw';
import newsRaw from '../data/news.yaml?raw';
import peopleRaw from '../data/people.yaml?raw';
import publicationsRaw from '../data/publications.yaml?raw';
import researchRaw from '../data/research.yaml?raw';
import projectsRaw from '../data/projects.yaml?raw';
import talksRaw from '../data/talks.yaml?raw';
import coursesRaw from '../data/courses.yaml?raw';
import joinRaw from '../data/join.yaml?raw';

// ── shared field types ──────────────────────────────────────

const text = z.union([z.string(), z.object({ ko: z.string().optional(), en: z.string().optional() })]);
const textList = z.union([
  z.array(z.string()),
  z.object({ ko: z.array(z.string()).optional(), en: z.array(z.string()).optional() }),
]);

/** YAML turns 2026-09-07 into a Date; keep everything as 'YYYY-MM-DD' | 'YYYY-MM' | 'YYYY' strings. */
const dateish = z
  .union([z.string(), z.number(), z.date()])
  .transform((v) => (v instanceof Date ? v.toISOString().slice(0, 10) : String(v).trim()))
  .refine((v) => /^\d{4}(-\d{2}(-\d{2})?)?$/.test(v), {
    message: '날짜는 2026-09-07, 2026-09, 2026 중 하나의 형식으로 적어주세요',
  });

const optionalList = z.array(z.string()).nullish().transform((v) => v ?? []);

// ── schemas ─────────────────────────────────────────────────

const siteSchema = z.object({
  name: text,
  short: z.string(),
  affiliation: text,
  tagline: text,
  mission: text,
  hero_loop: z.string().optional(),
  hero_loop_mobile: z.string().optional(),
  hero_poster: z.string().optional(),
  hero_video: z.string().optional(),
  hero_video_caption: text.optional(),
  hero_link: z.string().optional(),
  highlight_authors: optionalList,
  contact: z.object({
    email: z.string(),
    phone: z.string().optional(),
    office: text,
    address: text,
    map: z.string().optional(),
  }),
  links: z.object({ scholar: z.string().optional(), department: z.string().optional() }).default({}),
  recruiting: z.object({
    open: z.boolean(),
    deadline: dateish.optional(),
    positions: text.optional(),
  }),
});

export const NEWS_TAGS = ['paper', 'award', 'grant', 'collab', 'conference', 'talk', 'people', 'media', 'lab'] as const;

const newsSchema = z.array(
  z
    .object({
      date: dateish,
      tag: z.enum(NEWS_TAGS, { message: `tag는 ${NEWS_TAGS.join(' | ')} 중 하나여야 합니다` }),
      ko: z.string().optional(),
      en: z.string().optional(),
      images: optionalList,
      link: z.string().optional(),
    })
    .refine((n) => n.ko || n.en, { message: 'ko 또는 en 문구가 필요합니다' }),
);

const ROLES = ['phd', 'ms', 'integrated', 'grad', 'undergrad', 'staff'] as const;
const DEGREES = ['phd', 'ms', 'undergrad'] as const;

const peopleSchema = z.object({
  group_photo: z.object({ src: z.string(), caption: text.optional() }).optional(),
  pi: z.object({
    name: text,
    title: text,
    photo: z.string().optional(),
    email: z.string().optional(),
    cv: z.string().optional(),
    interests: textList.optional(),
    bio: text.optional(),
    career: z.array(z.object({ period: z.string(), ko: z.string().optional(), en: z.string().optional() })).default([]),
    awards: z.array(z.object({ year: z.union([z.string(), z.number()]), ko: z.string().optional(), en: z.string().optional() })).default([]),
  }),
  members: z
    .array(
      z.object({
        name: text,
        role: z.enum(ROLES, { message: `role은 ${ROLES.join(' | ')} 중 하나여야 합니다` }),
        photo: z.string().optional(),
        since: z.union([z.string(), z.number()]).optional(),
        email: z.string().optional(),
        lab_manager: z.boolean().default(false),
        topics: textList.optional(),
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
  alumni: z
    .array(
      z.object({
        name: text,
        degree: z.enum(DEGREES, { message: `degree는 ${DEGREES.join(' | ')} 중 하나여야 합니다` }).optional(),
        year: z.union([z.string(), z.number()]).optional(),
        now: text.optional(),
      }),
    )
    .nullish()
    .transform((v) => v ?? []),
});

export const PUB_TYPES = ['journal', 'conference', 'preprint', 'thesis', 'patent'] as const;

const publicationsSchema = z.array(
  z.object({
    title: z.string(),
    authors: z.string(),
    venue: z.string(),
    details: z.union([z.string(), z.number()]).transform(String).optional(),
    year: z.number({ message: 'year는 숫자(예: 2026)로 적어주세요' }),
    type: z.enum(PUB_TYPES, { message: `type은 ${PUB_TYPES.join(' | ')} 중 하나여야 합니다` }),
    link: z.string().optional(),
    video: z.string().optional(),
    extra_video: z.string().optional(),
    image: z.string().optional(),
    thrusts: optionalList,
    selected: z.boolean().default(false),
    note: z.string().optional(),
  }),
);

const researchSchema = z.array(
  z.object({
    id: z.string(),
    number: z.string().optional(),
    title: text,
    summary: text,
    points: textList.optional(),
    video: z.string().optional(),
    image: z.string().optional(),
    thumb: z.string().optional(),
    loop: z.string().optional(),
    figures: optionalList,
  }),
);

const projectsSchema = z.array(
  z.object({
    start: dateish,
    end: dateish,
    title: text.optional(),
    sponsor: text,
    confidential: z.boolean().default(false),
    thrusts: optionalList,
  }),
);

const talksSchema = z.object({
  talks: z.array(z.object({ date: dateish, title: z.string(), venue: z.string(), link: z.string().optional() })).default([]),
  media: z.array(z.object({ date: dateish, title: z.string(), outlet: z.string(), link: z.string().optional() })).default([]),
});

const coursesSchema = z.array(
  z.object({
    level: z.enum(['undergraduate', 'graduate'], { message: 'level은 undergraduate | graduate 중 하나여야 합니다' }),
    name: text,
    terms: text.optional(),
  }),
);

const joinSchema = z.object({
  intro: text,
  topics: textList,
  looking_for: textList,
  you_get: textList,
  how_to_apply: text,
  closing: text.optional(),
});

// ── loader ──────────────────────────────────────────────────

function formatPath(path: PropertyKey[]): string {
  return path.map((p) => (typeof p === 'number' ? `${p + 1}번째 항목` : String(p))).join(' › ') || '(파일 전체)';
}

function load<S extends z.ZodType>(file: string, raw: string, schema: S): z.output<S> {
  let parsed: unknown;
  try {
    parsed = parseYaml(raw);
  } catch (e) {
    throw new Error(`\n\n[src/data/${file}] YAML 문법 오류 — 들여쓰기나 콜론(:)을 확인해주세요.\n${(e as Error).message}\n`);
  }
  const result = schema.safeParse(parsed);
  if (!result.success) {
    const lines = result.error.issues.map((i) => `  • ${formatPath(i.path)}: ${i.message}`);
    throw new Error(`\n\n[src/data/${file}] 형식 오류\n${lines.join('\n')}\n`);
  }
  return result.data;
}

export const site = load('site.yaml', siteRaw, siteSchema);
export const people = load('people.yaml', peopleRaw, peopleSchema);
export const research = load('research.yaml', researchRaw, researchSchema);
export const courses = load('courses.yaml', coursesRaw, coursesSchema);
export const joinInfo = load('join.yaml', joinRaw, joinSchema);
export const { talks, media } = load('talks.yaml', talksRaw, talksSchema);

const byDateDesc = <T extends { date: string }>(a: T, b: T) => b.date.localeCompare(a.date);

export const news = load('news.yaml', newsRaw, newsSchema).sort(byDateDesc);
talks.sort(byDateDesc);
media.sort(byDateDesc);

/** The current student lab manager (members entry with lab_manager: true and an email). */
export const labManager = people.members.find((m) => m.lab_manager && m.email);

export const publications = load('publications.yaml', publicationsRaw, publicationsSchema).sort((a, b) => b.year - a.year);

const projects = load('projects.yaml', projectsRaw, projectsSchema).sort((a, b) => b.start.localeCompare(a.start));

// ── cross-file checks ───────────────────────────────────────

const thrustIds = new Set(research.map((r) => r.id));
for (const [file, items] of [
  ['publications.yaml', publications],
  ['projects.yaml', projects],
] as const) {
  items.forEach((item, i) => {
    for (const id of item.thrusts) {
      if (!thrustIds.has(id)) {
        throw new Error(
          `\n\n[src/data/${file}] ${i + 1}번째 항목 › thrusts: '${id}'는 research.yaml에 없는 id입니다 (가능한 값: ${[...thrustIds].join(', ')})\n`,
        );
      }
    }
  });
}

// ── derived data ────────────────────────────────────────────

/** Build date as 'YYYY-MM-DD' (the site is rebuilt weekly, so this stays fresh). */
export const today = new Date().toISOString().slice(0, 10);

const monthOf = (d: string) => d.slice(0, 7);

export const activeProjects = projects.filter((p) => monthOf(p.end) >= monthOf(today));
export const pastProjects = projects.filter((p) => monthOf(p.end) < monthOf(today));

export const recruitingDeadline =
  site.recruiting.deadline && site.recruiting.deadline >= today ? site.recruiting.deadline : undefined;

export const selectedPublications = publications.filter((p) => p.selected);

export function publicationsFor(thrust: string) {
  return publications.filter((p) => p.thrusts.includes(thrust));
}

/** Unique sponsors, current projects first. */
export const sponsors = [...activeProjects, ...pastProjects]
  .map((p) => p.sponsor)
  .filter((s, i, all) => all.findIndex((o) => JSON.stringify(o) === JSON.stringify(s)) === i);

const missingWarned = new Set<string>();

/** True if public/images/<path> exists; warns once per missing file so typos are visible in the build log. */
export function hasImage(path: string | undefined): path is string {
  if (!path) return false;
  const ok = existsSync(join(process.cwd(), 'public', 'images', path));
  if (!ok && !missingWarned.has(path)) {
    missingWarned.add(path);
    console.warn(`[이미지 없음] public/images/${path} 파일을 찾을 수 없어 표시하지 않습니다.`);
  }
  return ok;
}
