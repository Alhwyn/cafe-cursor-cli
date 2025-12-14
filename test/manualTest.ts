import { checkCreditsAvailable, initBrowser, closeBrowser } from "../src/utils/creditChecker";
import { exportAvailableToJSON, deleteJSON } from "../src/utils/jsonExporter";

// Human-readable DSL for credit checker tests
const when = (url: string) => ({
  shouldBe: (status: "available" | "redeemed" | "unknown") => ({ url, expected: status }),
});

const CURSOR_CREDITS_URL = process.env.CURSOR_CREDITS_URL;

console.log("CURSOR_CREDITS_URL:", CURSOR_CREDITS_URL);
if (!CURSOR_CREDITS_URL) {
  console.error("CURSOR_CREDITS_URL is not defined in .env");
  process.exit(1);
}

const TEST_CASES = [
  when(CURSOR_CREDITS_URL).shouldBe("available"),
  when("https://cursor.com/referral?code=OMZLNMI7QM0D").shouldBe("redeemed"),
  when("https://alhwyn.com").shouldBe("unknown"),
];

function getStatus(result: { available: boolean; redeemed?: boolean; unknown?: boolean }) {
  if (result.available) return "available";
  if (result.redeemed) return "redeemed";
  return "unknown";
}

interface CreditResult {
  url: string;
  status: "available" | "redeemed" | "unknown";
  amount?: number;
  lastChecked: string;
  error?: string;
}

async function runTests() {
  console.log("Credit Checker Tests");
  console.log("====================\n");

  if (!process.env.CURSOR_CREDITS_URL) {
    console.warn("⚠️  CURSOR_CREDITS_URL is not defined in .env. The first test case will likely fail.\n");
  }

  await initBrowser(false);

  let passed = 0;
  let failed = 0;
  const results = new Map<string, CreditResult>();

  for (const { url, expected } of TEST_CASES) {
    const code = url.match(/code=([A-Z0-9]+)/i)?.[1] ?? url;
    process.stdout.write(`when checking ${code} should be ${expected}... `);

    const result = await checkCreditsAvailable(url);
    const actual = getStatus(result);

    // Store result
    results.set(url, {
      url,
      status: actual,
      amount: result.amount,
      lastChecked: result.lastChecked,
      error: result.error,
    });

    if (actual === expected) {
      console.log("PASS");
      passed++;
    } else {
      console.log(`FAIL (got ${actual})`);
      failed++;
    }

    // 1 second delay between checks
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  await closeBrowser();

  // Export available URLs to JSON
  const dateStr = new Date().toISOString().split("T")[0];
  const filename = `test/available-${dateStr}.json`;
  const availableUrls = await exportAvailableToJSON(results, filename);
  console.log(`\nAvailable links exported to: ${filename} (${availableUrls.length} links)`);
  console.log("Available URLs:", availableUrls);

  console.log("\n====================");
  console.log(`Results: ${passed} passed, ${failed} failed`);

  // Delete JSON after test
  await deleteJSON(filename);
  console.log(`Deleted: ${filename}`);
}

runTests();
