import { readFile } from "fs/promises";

const REFERRAL_REGEX = /https?:\/\/cursor\.com\/referral\?code=[A-Z0-9]+/gi;

export async function parseCSVForUrls(filepath: string): Promise<string[]> {
  const content = await readFile(filepath, "utf-8");
  
  // Extract all cursor referral URLs from the CSV
  const matches = content.match(REFERRAL_REGEX);
  if (matches) {
    // Deduplicate URLs
    return [...new Set(matches)];
  }
  
  return [];
}
