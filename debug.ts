import { debugPage, initBrowser, closeBrowser } from "./src/utils/creditChecker";

// Get URL from command line arg or default to a known one
const url = process.argv[2];

if (!url) {
  console.error("Please provide a URL as a command line argument");
  process.exit(1);
}

console.log(`Debug script starting for: ${url}`);

async function run() {
  try {
    // Initialize browser (headless: false to see what's happening)
    await initBrowser(false);
    
    // Run debug
    await debugPage(url!);
  } catch (error) {
    console.error("Debug failed:", error);
  } finally {
    // Keep open for a moment if needed, or close immediately
    await closeBrowser();
    console.log("Done.");
  }
}

run();