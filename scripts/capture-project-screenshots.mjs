import { spawn } from "node:child_process";
import { createRequire } from "node:module";
import { createServer } from "node:http";
import { createReadStream, existsSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("D:/development/league-auction/node_modules/playwright");

const outputDir = resolve("public/images");

const projects = [
  {
    name: "Synapso.dev",
    cwd: "D:\\development\\auto-blog",
    command: "npm run dev -- --port 4310",
    url: "http://127.0.0.1:4310",
    output: "project-synapso-main.png",
  },
  {
    name: "Minions Bid",
    cwd: "D:\\development\\league-auction",
    command: "npm run dev -- --port 4311",
    url: "http://127.0.0.1:4311",
    output: "project-minions-bid.png",
  },
  {
    name: "Persona Style AI",
    cwd: "D:\\development\\persona-style",
    command: "npm run dev -- --port 4312",
    url: "http://127.0.0.1:4312",
    output: "project-persona-style.png",
  },
  {
    name: "Spend Intervention",
    cwd: "D:\\development\\spend-intervention",
    command: "npm run dev -- --port 4313",
    url: "http://127.0.0.1:4313",
    output: "project-spend-intervention.png",
  },
  {
    name: "Cafe Book",
    cwd: "D:\\development\\cafe-book",
    command: "npm run dev -- --host 127.0.0.1 --port 4314",
    url: "http://127.0.0.1:4314",
    output: "project-cafe-book.png",
  },
  {
    name: "Threads Auto-Poster",
    cwd: "D:\\development\\threads-autoposter",
    command: "npm run dashboard",
    env: { DASHBOARD_PORT: "4315" },
    url: "http://127.0.0.1:4315",
    output: "project-threads-autoposter.png",
  },
  {
    name: "Sumpyo",
    cwd: "D:\\development\\sumpyo-flutter-app",
    staticDir: "D:\\development\\sumpyo-flutter-app\\build\\web",
    port: 4321,
    url: "http://127.0.0.1:4321",
    output: "project-sumpyo.png",
  },
  {
    name: "Self Growth Dashboard",
    cwd: "D:\\development\\self-growth-dashboard",
    command: "npm run dev -- --port 4316",
    url: "http://127.0.0.1:4316",
    output: "project-growth.png",
  },
  {
    name: "Invesight",
    cwd: "D:\\development\\investment-platform",
    command: "npm run dev -- --port 4317",
    url: "http://127.0.0.1:4317",
    output: "project-investment.png",
  },
  {
    name: "Quote Builder",
    cwd: "D:\\development\\quote-builder",
    command: "npm run dev -- --port 4318",
    url: "http://127.0.0.1:4318",
    output: "project-quote-builder.png",
  },
  {
    name: "AI Doc Agent",
    cwd: "D:\\development\\ai-doc-agent\\frontend",
    command: "npm run dev -- --port 4319",
    url: "http://127.0.0.1:4319",
    output: "project-ai-doc-agent.png",
  },
];

function serveStatic(root, port) {
  const mimeTypes = new Map([
    [".html", "text/html; charset=utf-8"],
    [".js", "text/javascript; charset=utf-8"],
    [".css", "text/css; charset=utf-8"],
    [".png", "image/png"],
    [".jpg", "image/jpeg"],
    [".jpeg", "image/jpeg"],
    [".svg", "image/svg+xml"],
    [".json", "application/json"],
    [".wasm", "application/wasm"],
  ]);

  const server = createServer((request, response) => {
    const pathname = new URL(request.url ?? "/", `http://127.0.0.1:${port}`).pathname;
    const relativePath = decodeURIComponent(pathname === "/" ? "/index.html" : pathname);
    const filePath = join(normalize(root), relativePath);
    const fallbackPath = join(normalize(root), "index.html");
    const target = existsSync(filePath) && statSync(filePath).isFile() ? filePath : fallbackPath;

    response.setHeader("Content-Type", mimeTypes.get(extname(target)) ?? "application/octet-stream");
    createReadStream(target).pipe(response);
  });

  return new Promise((resolveServer) => {
    server.listen(port, "127.0.0.1", () => resolveServer(server));
  });
}

function startProcess(project) {
  const child = spawn(project.command, {
    cwd: project.cwd,
    env: { ...process.env, ...project.env },
    shell: true,
    stdio: ["ignore", "pipe", "pipe"],
    windowsHide: true,
  });

  child.stdout.on("data", (chunk) => process.stdout.write(`[${project.name}] ${chunk}`));
  child.stderr.on("data", (chunk) => process.stderr.write(`[${project.name}] ${chunk}`));

  return child;
}

async function waitForUrl(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;

  while (Date.now() < deadline) {
    try {
      const response = await fetch(url, { redirect: "follow" });
      if (response.ok || response.status < 500) return;
      lastError = new Error(`HTTP ${response.status}`);
    } catch (error) {
      lastError = error;
    }
    await new Promise((resolveWait) => setTimeout(resolveWait, 1000));
  }

  throw lastError ?? new Error(`Timed out waiting for ${url}`);
}

async function stopProcess(child) {
  if (!child || child.killed) return;

  await new Promise((resolveStop) => {
    const killer = spawn("taskkill.exe", ["/pid", String(child.pid), "/T", "/F"], {
      stdio: "ignore",
      windowsHide: true,
    });
    killer.on("close", resolveStop);
    killer.on("error", resolveStop);
  });
}

async function capture(project, browser) {
  console.log(`\n== ${project.name}`);
  let child;
  let staticServer;

  try {
    if (project.staticDir) {
      if (!existsSync(join(project.staticDir, "index.html"))) {
        throw new Error(`Static build not found: ${project.staticDir}`);
      }
      staticServer = await serveStatic(project.staticDir, project.port);
    } else {
      child = startProcess(project);
    }

    await waitForUrl(project.url);

    const page = await browser.newPage({
      viewport: { width: 1200, height: 750 },
      deviceScaleFactor: 1,
    });
    await page.goto(project.url, { waitUntil: "networkidle", timeout: 45000 });
    await page.screenshot({
      path: join(outputDir, project.output),
      fullPage: false,
    });
    await page.close();

    console.log(`saved public/images/${project.output}`);
    return { name: project.name, ok: true };
  } catch (error) {
    console.error(`failed: ${error.message}`);
    return { name: project.name, ok: false, error: error.message };
  } finally {
    if (staticServer) {
      await new Promise((resolveClose) => staticServer.close(resolveClose));
    }
    await stopProcess(child);
  }
}

const browser = await chromium.launch();
const results = [];

try {
  for (const project of projects) {
    results.push(await capture(project, browser));
  }
} finally {
  await browser.close();
}

console.log("\nCapture summary");
for (const result of results) {
  console.log(`${result.ok ? "OK" : "FAIL"} ${result.name}${result.error ? ` - ${result.error}` : ""}`);
}

if (results.some((result) => !result.ok)) {
  process.exitCode = 1;
}
