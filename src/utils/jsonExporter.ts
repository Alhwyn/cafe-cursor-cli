import { writeFile, unlink } from "fs/promises";

interface CreditResult {
  url: string;
  status: "available" | "redeemed" | "unknown";
  amount?: number;
  lastChecked: string;
  error?: string;
}

export function getAvailableUrls(results: Map<string, CreditResult>): string[] {
  const urls: string[] = [];
  for (const [url, result] of results) {
    if (result.status === "available") {
      urls.push(url);
    }
  }
  return urls;
}

export async function exportAvailableToJSON(
  results: Map<string, CreditResult>,
  filename: string
): Promise<string[]> {
  const availableUrls = getAvailableUrls(results);
  await writeFile(filename, JSON.stringify(availableUrls, null, 2), "utf-8");
  return availableUrls;
}

export async function deleteJSON(filename: string): Promise<void> {
  await unlink(filename);
}
