import { chromium } from "playwright";
import type { Browser, Page } from "playwright";

interface CreditStatus {
  available: boolean;
  redeemed?: boolean;
  unknown?: boolean;
  amount?: number;
  lastChecked: string;
  error?: string;
}

const REFERRAL_REGEX = /https?:\/\/cursor\.com\/referral\?code=([A-Z0-9]+)/i;
const TIMEOUT_MS = 15000;

// Extract referral code from URL
function extractCode(url: string): string | null {
  const match = url.match(REFERRAL_REGEX);
  return match?.[1] ?? null;
}

// Check referral by intercepting API response in browser
async function checkReferralInBrowser(
  page: Page,
  url: string
): Promise<{ available: boolean; redeemed?: boolean; unknown?: boolean; amount?: number }> {
  return new Promise((resolve) => {
    let resolved = false;

    const timeout = setTimeout(() => {
      if (!resolved) {
        resolved = true;
        resolve({ available: false, unknown: true });
      }
    }, TIMEOUT_MS);

    // Listen for API response
    const responseHandler = async (response: any) => {
      if (response.url().includes("/api/dashboard/check-referral-code") && !resolved) {
        resolved = true;
        clearTimeout(timeout);

        try {
          const statusCode = response.status();

          if (statusCode === 200) {
            const json = await response.json();

            // Active: { isValid: true, userIsEligible: true, metadata: {...} }
            if (json && typeof json === "object" && "isValid" in json) {
              const { isValid, userIsEligible } = json;
              if (isValid && userIsEligible) {
                resolve({ available: true, amount: json.metadata?.amount ?? 20 });
                return;
              }
              resolve({ available: false, redeemed: true });
              return;
            }

            // Empty object {} = redeemed
            if (json && typeof json === "object" && Object.keys(json).length === 0) {
              resolve({ available: false, redeemed: true });
              return;
            }
          }

          resolve({ available: false, unknown: true });
        } catch {
          resolve({ available: false, unknown: true });
        } finally {
          page.off("response", responseHandler);
        }
      }
    };

    page.on("response", responseHandler);

    // Navigate to the referral page
    page.goto(url, { waitUntil: "networkidle", timeout: TIMEOUT_MS }).catch(() => {
      if (!resolved) {
        resolved = true;
        clearTimeout(timeout);
        resolve({ available: false, unknown: true });
      }
    });
  });
}

// Shared browser instance for batch checking
let sharedBrowser: Browser | null = null;
let sharedPage: Page | null = null;

export async function initBrowser(headless = false): Promise<void> {
  if (!sharedBrowser) {
    sharedBrowser = await chromium.launch({
      headless,
      channel: "chrome",
    });
    const context = await sharedBrowser.newContext();
    sharedPage = await context.newPage();
  }
}

export async function closeBrowser(): Promise<void> {
  if (sharedBrowser) {
    await sharedBrowser.close();
    sharedBrowser = null;
    sharedPage = null;
  }
}

export async function checkCreditsAvailable(url: string): Promise<CreditStatus> {
  const lastChecked = new Date().toISOString();

  try {
    const code = extractCode(url);

    if (!code) {
      return {
        available: false,
        unknown: true,
        lastChecked,
        error: "Could not extract referral code from URL",
      };
    }

    // Use shared browser if available, otherwise create temporary one
    let browser: Browser | null = null;
    let page: Page;

    if (sharedPage) {
      page = sharedPage;
    } else {
      browser = await chromium.launch({ headless: false, channel: "chrome" });
      const context = await browser.newContext();
      page = await context.newPage();
    }

    const result = await checkReferralInBrowser(page, url);

    // Close temporary browser if we created one
    if (browser) {
      await browser.close();
    }

    return {
      available: result.available,
      redeemed: result.redeemed,
      unknown: result.unknown,
      amount: result.amount,
      lastChecked,
    };
  } catch (error) {
    return {
      available: false,
      unknown: true,
      lastChecked,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

// Batch check multiple URLs efficiently
export async function checkMultipleCredits(
  urls: string[],
  onProgress?: (index: number, total: number, result: CreditStatus) => void
): Promise<Map<string, CreditStatus>> {
  const results = new Map<string, CreditStatus>();

  await initBrowser(false);

  try {
    for (let i = 0; i < urls.length; i++) {
      const url = urls[i];

      if (!url) throw new Error(`URL is undefined at index ${i}`);

      const result = await checkCreditsAvailable(url);
      results.set(url, result);

      if (onProgress) {
        onProgress(i + 1, urls.length, result);
      }

      // 1 second delay between checks to avoid rate limiting
      if (i < urls.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  } finally {
    await closeBrowser();
  }

  return results;
}

// Debug function
export async function debugPage(url: string): Promise<void> {
  console.log(`\n--- Debug: ${url} ---`);

  const code = extractCode(url);
  if (!code) {
    console.log("Could not extract code from URL");
    return;
  }

  console.log(`Extracted code: ${code}`);
  console.log("Launching browser...");

  const result = await checkCreditsAvailable(url);
  console.log("Result:", JSON.stringify(result, null, 2));
}
