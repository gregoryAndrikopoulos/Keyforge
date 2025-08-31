import { execSync } from "node:child_process";

const DEV_URL = "http://localhost:5173";
const PREVIEW_URL = "http://localhost:4173";
const isCI = !!process.env.CI;

function isUp(url) {
  try {
    execSync(`curl -sf ${url}`, { stdio: "ignore" });
    return true;
  } catch {
    return false;
  }
}

const defaultBaseUrl =
  process.env.WDIO_BASEURL || (isUp(PREVIEW_URL) ? PREVIEW_URL : DEV_URL);

export const config = {
  runner: "local",
  specs: ["./specs/**/*.spec.js"],
  maxInstances: 1,

  services: ["devtools"],
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        args: [
          "--window-size=1920,1080",
          "--window-position=0,0",
          "--no-sandbox",
          "--disable-dev-shm-usage",
          "--no-default-browser-check",
          ...(isCI ? ["--headless=new", "--disable-gpu"] : []),
        ],
      },
    },
  ],

  baseUrl: defaultBaseUrl,
  logLevel: "error",
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 2,
  specFileRetries: isCI ? 1 : 0,
  specFileRetriesDelay: 0,
  specFileRetriesDeferred: false,

  framework: "mocha",
  reporters: ["spec"],

  mochaOpts: {
    ui: "bdd",
    timeout: isCI ? 120000 : 60000,
  },

  before: async function () {
    let cleaned = false;
    const closeSession = async (reason) => {
      if (cleaned) return;
      cleaned = true;
      try {
        if (browser?.sessionId) {
          // Avoid hanging if the Grid/Node is already gone
          const timeout = new Promise((res) => setTimeout(res, 3000));
          const attempt = browser.deleteSession().catch((e) => {
            const msg = String(e?.message || e);
            if (!/UND_ERR_CLOSED|ECONNREFUSED|socket hang up/i.test(msg)) {
              console.warn("deleteSession failed:", msg);
            }
          });
          await Promise.race([attempt, timeout]);
          console.log(`Session closed on ${reason}`);
        }
      } catch (err) {
        console.warn("Cleanup error:", err?.message || err);
      }
    };
    process.on("SIGINT", () => {
      void closeSession("SIGINT");
    });
    process.on("SIGTERM", () => {
      void closeSession("SIGTERM");
    });
  },
};
