// About 페이지 우측에 표시되는 인생 성장 만족도 SVG 라인 그래프 (hover 연동 코멘트 포함)
"use client";

import { useState } from "react";

const LIFE_DATA = [
  { year: 2019, value: 0,  comment: "개발 인생의 시작점" },
  { year: 2020, value: 50, comment: "첫 취업 및 설레임" },
  { year: 2022, value: 70, comment: "프론트엔드로 이직" },
  { year: 2023, value: 40, comment: "기대했던 이상과의 괴리" },
  { year: 2024, value: 60, comment: "직장 만족도가 상승하다가 하락하는 기점" },
  { year: 2025, value: 20, comment: "최악의 환경 경험" },
  { year: 2026, value: 70, comment: "트렌드의 변화로 많은 것을 경험하고 배우는 중" },
];

const W = 228;
const H = 110;
const PAD_T = 14;
const PAD_R = 10;
const PAD_B = 22;
const PAD_L = 26;
const INNER_W = W - PAD_L - PAD_R;
const INNER_H = H - PAD_T - PAD_B;
const MIN_YEAR = 2019;
const MAX_YEAR = 2026;

function xPos(year: number) {
  return PAD_L + ((year - MIN_YEAR) / (MAX_YEAR - MIN_YEAR)) * INNER_W;
}

function yPos(value: number) {
  return PAD_T + INNER_H - (value / 100) * INNER_H;
}

function smoothPath(pts: { x: number; y: number }[]) {
  if (pts.length === 0) return "";
  let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`;
  for (let i = 1; i < pts.length; i++) {
    const prev = pts[i - 1];
    const curr = pts[i];
    const cpx = ((prev.x + curr.x) / 2).toFixed(1);
    d += ` C ${cpx} ${prev.y.toFixed(1)} ${cpx} ${curr.y.toFixed(1)} ${curr.x.toFixed(1)} ${curr.y.toFixed(1)}`;
  }
  return d;
}

export default function LifeGraph() {
  const [hoveredYear, setHoveredYear] = useState<number | null>(null);

  const pts = LIFE_DATA.map((d) => ({
    x: xPos(d.year),
    y: yPos(d.value),
    year: d.year,
    value: d.value,
    comment: d.comment,
  }));

  const linePath = smoothPath(pts);
  const bottomY = (PAD_T + INNER_H).toFixed(1);
  const areaPath = `${linePath} L ${pts[pts.length - 1].x.toFixed(1)} ${bottomY} L ${pts[0].x.toFixed(1)} ${bottomY} Z`;
  const last = pts[pts.length - 1];

  const anyHovered = hoveredYear !== null;

  return (
    <div className="pt-6 border-t border-black/5 space-y-3">
      <p className="text-[10px] uppercase tracking-widest opacity-40">Life Graph</p>
      <p className="text-[9px] opacity-40 tracking-wide">성장 만족도 / 2019 — 현재</p>

      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full"
        aria-label="인생 성장 만족도 그래프"
      >
        {/* Grid lines */}
        {[0, 50, 100].map((v) => (
          <line
            key={v}
            x1={PAD_L} y1={yPos(v)} x2={W - PAD_R} y2={yPos(v)}
            stroke="black" strokeOpacity={0.12} strokeWidth={0.6}
            strokeDasharray={v === 0 ? "0" : "2 2"}
          />
        ))}

        {/* Y axis labels */}
        {[0, 50, 100].map((v) => (
          <text key={v} x={PAD_L - 4} y={yPos(v) + 3.5}
            textAnchor="end" fontSize={5} fill="black" fillOpacity={0.4}>
            {v}
          </text>
        ))}

        {/* Area fill */}
        <path d={areaPath} fill="black" fillOpacity={0.07} />

        {/* Line */}
        <path d={linePath} fill="none" stroke="black"
          strokeWidth={1.2} strokeOpacity={0.7} strokeLinecap="round" />

        {/* Data points with hover targets */}
        {pts.map((p) => {
          const isCurrent = p.year === 2026;
          const isHovered = hoveredYear === p.year;
          const radius = isHovered ? 3.5 : isCurrent ? 2.5 : 1.5;
          return (
            <g
              key={p.year}
              onMouseEnter={() => setHoveredYear(p.year)}
              onMouseLeave={() => setHoveredYear(null)}
              style={{ cursor: "default" }}
            >
              {/* Invisible hit area */}
              <circle cx={p.x} cy={p.y} r={8} fill="transparent" />
              {/* Visible dot */}
              <circle
                cx={p.x} cy={p.y} r={radius}
                fill={isCurrent || isHovered ? "black" : "white"}
                fillOpacity={isCurrent || isHovered ? 0.85 : 1}
                stroke="black"
                strokeWidth={isCurrent || isHovered ? 0 : 0.8}
                strokeOpacity={0.65}
                style={{ transition: "r 0.12s ease" }}
              />
            </g>
          );
        })}

        {/* 현재 label */}
        <text x={last.x} y={last.y - 5} textAnchor="middle"
          fontSize={5} fill="black" fillOpacity={0.75} fontWeight="600">
          현재 ↑
        </text>

        {/* X axis year labels */}
        {([2019, 2022, 2025, 2026] as const).map((yr) => {
          const p = pts.find((pt) => pt.year === yr)!;
          return (
            <text key={yr} x={p.x} y={H - 5}
              textAnchor={yr === 2026 ? "end" : "middle"}
              fontSize={5} fill="black"
              fillOpacity={yr === 2026 ? 0.65 : 0.4}
              fontWeight={yr === 2026 ? "600" : "400"}>
              {yr}
            </text>
          );
        })}
      </svg>

      {/* Comments list */}
      <div className="space-y-1.5 pt-1">
        {LIFE_DATA.map((d) => {
          const isHovered = hoveredYear === d.year;
          return (
            <div
              key={d.year}
              className="flex gap-2 items-baseline cursor-default select-none transition-opacity duration-150"
              style={{ opacity: anyHovered ? (isHovered ? 1 : 0.2) : 0.65 }}
              onMouseEnter={() => setHoveredYear(d.year)}
              onMouseLeave={() => setHoveredYear(null)}
            >
              <span className="text-[9px] tabular-nums shrink-0 opacity-60">
                &apos;{String(d.year).slice(2)}
              </span>
              <span
                className="text-[10px] leading-[1.5] transition-all duration-150"
                style={{ fontWeight: isHovered ? 600 : 400 }}
              >
                {d.comment}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
