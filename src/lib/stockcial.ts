export type Mood = { key: "sunny" | "bright" | "curious"; label: string; face: string };

export function careMood(care: number): Mood {
  if (care >= 4) return { key: "sunny", label: "over the moon", face: "✦" };
  if (care >= 1) return { key: "bright", label: "feeling loved", face: "♡" };
  return { key: "curious", label: "curious", face: "✧" };
}