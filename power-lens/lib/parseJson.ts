/**
 * Extract JSON from model output, tolerating markdown fences.
 */
export function parseModelJson<T>(raw: string): T {
  const trimmed = raw.trim();
  const fenceMatch = trimmed.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const candidate = fenceMatch ? fenceMatch[1].trim() : trimmed;
  return JSON.parse(candidate) as T;
}
