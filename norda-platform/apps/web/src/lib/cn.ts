/**
 * Minimal className joiner. Accepts strings, falsy values, and arrays.
 * Not a clone of `clsx` — deliberately tiny, and typed.
 */
export type ClassValue = string | number | null | undefined | false | ClassValue[];

export function cn(...values: ClassValue[]): string {
  const out: string[] = [];
  const walk = (v: ClassValue): void => {
    if (v === null || v === undefined || v === false || v === 0) return;
    if (typeof v === 'string') {
      const trimmed = v.trim();
      if (trimmed) out.push(trimmed);
      return;
    }
    if (typeof v === 'number') {
      out.push(String(v));
      return;
    }
    if (Array.isArray(v)) {
      for (const item of v) walk(item);
    }
  };
  for (const v of values) walk(v);
  return out.join(' ');
}