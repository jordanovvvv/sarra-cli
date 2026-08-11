import { getSaveLocation } from "../prompts/prompt-user";

export async function resolveOutputPath(
  out: string | undefined,
  save: boolean,
  defaultPath: string
): Promise<string | null> {
  if (out) return out;
  if (save) return getSaveLocation(defaultPath);
  return null;
}
