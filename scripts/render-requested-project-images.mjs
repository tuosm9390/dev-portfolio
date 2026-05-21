import { createRequire } from "node:module";
import { writeFileSync, unlinkSync } from "node:fs";
import { join, resolve } from "node:path";

const require = createRequire(import.meta.url);
const { chromium } = require("D:/development/league-auction/node_modules/playwright");

const outputDir = resolve("public/images");

function threadsOverviewHtml() {
  const posts = [
    ["Anthropic Claude CLI and OpenClaw Usage Policies", "4월 22일", "914", "1"],
    ["Vercel OAuth Breach and Environment Variable Security", "4월 22일", "445", "1"],
    ["AI Agent Governance and Security Infrastructure", "4월 22일", "257", "2"],
    ["Claude Code Ecosystem & Policy Shifts", "4월 22일", "546", "2"],
    ["GitHub's Reputation Economy Under Scrutiny", "4월 21일", "1,039", "5"],
  ];

  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 2048px;
      height: 1254px;
      overflow: hidden;
      background: #030406;
      color: #e7e7ea;
      font-family: Inter, Arial, sans-serif;
      letter-spacing: -0.01em;
    }
    .sidebar {
      position: absolute;
      inset: 0 auto 0 0;
      width: 218px;
      border-right: 1px solid #1a1d24;
      background: #050608;
    }
    .brand {
      height: 45px;
      padding: 10px 12px;
      border-bottom: 1px solid #1a1d24;
      font-size: 16px;
      font-weight: 800;
      color: #f5f5f6;
    }
    .nav { padding: 18px 14px; display: grid; gap: 24px; color: #989da8; font-size: 15px; font-weight: 700; }
    .nav-row { display: flex; gap: 14px; align-items: center; }
    .nav-icon { width: 16px; text-align: center; color: #8f949f; }
    .bottom-nav { position: absolute; left: 0; right: 0; bottom: 0; border-top: 1px solid #1a1d24; padding: 20px 24px; display: grid; gap: 28px; color: #9aa0aa; font-weight: 700; }
    .content {
      margin-left: 218px;
      padding: 26px 116px;
    }
    .top {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin: 0 0 26px;
    }
    h1 { margin: 0 0 8px; font-size: 26px; line-height: 1.1; }
    .sub { color: #888e99; font-size: 14px; font-weight: 700; }
    button {
      margin-top: 7px;
      border: 0;
      border-radius: 8px;
      background: #f5f5f4;
      color: #232326;
      padding: 12px 18px;
      font-size: 13px;
      font-weight: 800;
    }
    .metrics {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 14px;
      margin-bottom: 23px;
    }
    .metric {
      height: 119px;
      border: 1px solid #1d2027;
      border-radius: 8px;
      padding: 22px 20px;
      background: #050608;
    }
    .metric-label { color: #8d929d; font-size: 13px; font-weight: 800; margin-bottom: 6px; }
    .metric-value { font-size: 30px; font-weight: 900; line-height: 1.1; }
    .metric-note { margin-top: 6px; color: #8d929d; font-size: 13px; font-weight: 800; }
    .danger { display: inline-block; margin-top: 9px; padding: 3px 8px; border-radius: 3px; background: #621617; color: #e55d5d; font-size: 12px; font-weight: 900; }
    .panel {
      border: 1px solid #1d2027;
      border-radius: 8px;
      background: #050608;
    }
    .chart {
      height: 302px;
      padding: 24px 24px 18px;
      margin-bottom: 22px;
    }
    .panel-title { font-size: 17px; font-weight: 900; margin: 0 0 30px; }
    .chartbox { position: relative; height: 214px; }
    .gridline { position: absolute; left: 34px; right: 26px; height: 1px; border-top: 2px dotted #151922; }
    .axis { position: absolute; left: 30px; color: #979da8; font-size: 13px; font-weight: 700; transform: translateY(-8px); }
    .dates { position: absolute; left: 76px; right: 18px; bottom: 0; display: flex; justify-content: space-between; color: #858b96; font-size: 13px; font-weight: 800; }
    .legend { position: absolute; top: 0; left: 500px; display: flex; gap: 14px; font-size: 14px; font-weight: 900; }
    .blue { color: #2f80ff; }
    .red { color: #ef4444; }
    .green { color: #10b981; }
    .yellow { color: #d99000; }
    .posts { height: 265px; overflow: hidden; }
    .posts h2 { margin: 0; padding: 16px 20px; font-size: 17px; border-bottom: 1px solid #1d2027; }
    .post-row { height: 42px; display: grid; grid-template-columns: 1fr 86px 60px 36px; align-items: center; border-bottom: 1px solid #1d2027; padding: 0 20px; font-size: 14px; font-weight: 800; }
    .post-title { color: #e2e2e5; }
    .meta { color: #9da3ae; text-align: right; }
  </style>
</head>
<body>
  <aside class="sidebar">
    <div class="brand">Threads Poster</div>
    <nav class="nav">
      <div class="nav-row"><span class="nav-icon">⌂</span>Overview</div>
      <div class="nav-row"><span class="nav-icon">▤</span>스레드 목록</div>
      <div class="nav-row"><span class="nav-icon">▥</span>인사이트</div>
    </nav>
    <div class="bottom-nav">
      <div>☼ &nbsp;&nbsp; 테마</div>
      <div>↪ &nbsp;&nbsp; 로그아웃</div>
    </div>
  </aside>
  <main class="content">
    <div class="top">
      <div>
        <h1>Overview</h1>
        <div class="sub">Threads 포스팅 성과 요약</div>
      </div>
      <button>Refresh All Insights</button>
    </div>
    <section class="metrics">
      <div class="metric"><div class="metric-label">총 게시물</div><div class="metric-value">105</div></div>
      <div class="metric"><div class="metric-label">총 조회수</div><div class="metric-value">265,693</div><div class="danger">▼ 52% 이번 주</div></div>
      <div class="metric"><div class="metric-label">평균 좋아요</div><div class="metric-value">13</div><div class="danger">▼ 69% 이번 주</div></div>
      <div class="metric"><div class="metric-label">수집률</div><div class="metric-value">99%</div><div class="metric-note">104 / 105개</div></div>
    </section>
    <section class="panel chart">
      <div class="panel-title">Engagement Trends</div>
      <div class="chartbox">
        <div class="legend"><span class="red">⌁ Likes</span><span class="green">⌁ Replies</span><span class="yellow">⌁ Reposts</span><span class="blue">⌁ Views</span></div>
        <div class="axis" style="top:51px;">16,000</div><div class="gridline" style="top:51px;"></div>
        <div class="axis" style="top:87px;">12,000</div><div class="gridline" style="top:87px;"></div>
        <div class="axis" style="top:124px;">8,000</div><div class="gridline" style="top:124px;"></div>
        <div class="axis" style="top:160px;">4,000</div><div class="gridline" style="top:160px;"></div>
        <div class="axis" style="top:196px;">0</div>
        <svg viewBox="0 0 1110 210" style="position:absolute;left:72px;right:20px;bottom:10px;width:calc(100% - 92px);height:190px;overflow:visible">
          <path d="M0 177 C80 130 130 124 170 128 C245 137 280 180 340 172 C448 166 560 156 640 145 C710 132 760 40 810 38 C900 39 1000 90 1110 160" fill="none" stroke="#2f80ff" stroke-width="3"/>
          <path d="M0 180 L1110 180" stroke="#d99000" stroke-width="3"/>
          ${[0,170,340,510,640,810,980,1110].map((x, i) => `<circle cx="${x}" cy="${[177,128,172,164,145,38,94,160][i]}" r="5" fill="#dbeafe" stroke="#2f80ff" stroke-width="3"/><circle cx="${x}" cy="180" r="5" fill="#fbbf24" />`).join("")}
        </svg>
        <div class="dates"><span>2026-04-15</span><span>2026-04-16</span><span>2026-04-17</span><span>2026-04-18</span><span>2026-04-19</span><span>2026-04-20</span><span>2026-04-21</span><span>2026-04-22</span></div>
      </div>
    </section>
    <section class="panel posts">
      <h2>최근 포스트</h2>
      ${posts.map(([title, date, views, likes]) => `<div class="post-row"><div class="post-title">${title}</div><div class="meta">${date}</div><div class="meta">◉ ${views}</div><div class="meta">♥ ${likes}</div></div>`).join("")}
    </section>
  </main>
</body>
</html>`;
}

function sumpyoTempHtml() {
  return `<!doctype html>
<html lang="ko">
<head>
  <meta charset="utf-8" />
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      width: 1200px;
      height: 750px;
      overflow: hidden;
      background: #0f172a;
      color: #312e81;
      font-family: Inter, Arial, sans-serif;
    }
    .canvas {
      margin: 66px 82px;
      width: 1036px;
      height: 618px;
      border-radius: 36px;
      background: #eef2ff;
      position: relative;
      overflow: hidden;
    }
    h1 { margin: 0; position: absolute; left: 50px; top: 66px; font-size: 34px; color: #312e81; }
    .sub { position: absolute; left: 50px; top: 112px; color: #64748b; font-size: 19px; }
    .phone {
      position: absolute;
      left: 102px;
      top: 172px;
      width: 270px;
      height: 374px;
      border-radius: 38px;
      background: #fff;
      box-shadow: 0 28px 80px rgba(49,46,129,.16);
    }
    .orb { position: absolute; left: 135px; top: 86px; width: 172px; height: 172px; border-radius: 50%; background: #c7d2fe; }
    .inner { position: absolute; left: 196px; top: 147px; width: 50px; height: 50px; border-radius: 50%; background: #818cf8; box-shadow: 0 0 0 34px #818cf8; opacity: .94; }
    .label { position: absolute; left: 82px; bottom: 74px; font-size: 22px; font-weight: 800; }
    .panel { position: absolute; left: 466px; width: 392px; border-radius: 26px; background: #fff; }
    .panel.one { top: 172px; height: 144px; }
    .panel.two { top: 358px; height: 188px; background: #dbeafe; }
    .panel-title { margin: 36px 40px 24px; font-size: 25px; font-weight: 800; }
    .bar { margin-left: 40px; width: 242px; height: 18px; border-radius: 9px; background: #a5b4fc; }
    .dot { display: inline-block; width: 36px; height: 36px; margin: 15px 8px 0 0; border-radius: 50%; background: #6366f1; }
    .dot.off { background: #c7d2fe; }
    .caption { position: absolute; left: 50px; bottom: 40px; color: #4338ca; font-size: 18px; }
  </style>
</head>
<body>
  <div class="canvas">
    <h1>Sumpyo</h1>
    <div class="sub">small pauses, tracked as a daily rhythm</div>
    <div class="phone"><div class="orb"></div><div class="inner"></div><div class="label">Breathe</div></div>
    <div class="panel one"><div class="panel-title">Today</div><div class="bar"></div></div>
    <div class="panel two"><div class="panel-title">Habit streak</div><div style="margin-left:40px"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="dot off"></span></div></div>
    <div class="caption">Temporary preview for a mobile-first Flutter product</div>
  </div>
</body>
</html>`;
}

async function renderHtmlToPng(html, output, viewport) {
  const tempPath = join(outputDir, `.tmp-${output}.html`);
  writeFileSync(tempPath, html, "utf8");

  const browser = await chromium.launch();
  try {
    const page = await browser.newPage({ viewport, deviceScaleFactor: 1 });
    await page.goto(`file:///${tempPath.replaceAll("\\", "/")}`, {
      waitUntil: "networkidle",
    });
    await page.screenshot({ path: join(outputDir, output), fullPage: false });
    await page.close();
  } finally {
    await browser.close();
    unlinkSync(tempPath);
  }
}

await renderHtmlToPng(threadsOverviewHtml(), "project-threads-autoposter-overview.png", {
  width: 2048,
  height: 1254,
});

await renderHtmlToPng(sumpyoTempHtml(), "project-sumpyo.png", {
  width: 1200,
  height: 750,
});

console.log("rendered project-threads-autoposter-overview.png");
console.log("rendered project-sumpyo.png");
