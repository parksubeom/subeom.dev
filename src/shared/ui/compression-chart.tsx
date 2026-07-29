"use client";

import * as React from "react";

// MathCanvas 히스토리 압축 개발기 전용 차트 (dev 실측값)
type Pt = { n: number; before: number; after: number };

const A: Pt[] = [
  { n: 3, before: 1142.6, after: 4.8 },
  { n: 5, before: 1449.7, after: 5.5 },
  { n: 7, before: 1718.6, after: 6.1 },
  { n: 9, before: 1901.8, after: 6.4 },
  { n: 13, before: 2517.9, after: 7.5 },
  { n: 18, before: 3753.5, after: 9.1 },
  { n: 20, before: 3754.8, after: 9.3 },
];

const B: Pt[] = [
  { n: 1, before: 17.7, after: 3.9 },
  { n: 3, before: 22.6, after: 4.2 },
  { n: 6, before: 37.8, after: 5.0 },
  { n: 8, before: 50.8, after: 5.3 },
  { n: 12, before: 89.4, after: 7.4 },
  { n: 16, before: 160.8, after: 9.5 },
  { n: 20, before: 231.3, after: 11.3 },
  { n: 25, before: 329.5, after: 13.3 },
  { n: 33, before: 436.0, after: 16.4 },
];

const BEFORE = "#eb6834"; // 개선 전 (주황)
const AFTER = "#2a78d6"; // 개선 후 (파랑)

const fmt = (kb: number) =>
  kb >= 1000 ? `${(kb / 1024).toFixed(2)} MB` : `${Math.round(kb)} KB`;

function LineChart({
  title,
  subtitle,
  data,
}: {
  title: string;
  subtitle: string;
  data: Pt[];
}) {
  const [hover, setHover] = React.useState<number | null>(null);

  const W = 860,
    H = 300;
  const m = { t: 18, r: 96, b: 40, l: 62 };
  const iw = W - m.l - m.r,
    ih = H - m.t - m.b;
  const maxY = Math.max(...data.map((d) => d.before)) * 1.08;
  const minX = data[0].n,
    maxX = data[data.length - 1].n;
  const x = (n: number) => m.l + ((n - minX) / (maxX - minX)) * iw;
  const y = (v: number) => m.t + ih - (v / maxY) * ih;

  const ticksY = 4;
  const gridY = Array.from({ length: ticksY + 1 }, (_, i) => (maxY / ticksY) * i);
  const linePath = (key: "before" | "after") =>
    data
      .map((d, i) => `${i ? "L" : "M"}${x(d.n).toFixed(1)},${y(d[key]).toFixed(1)}`)
      .join(" ");
  const last = data[data.length - 1];
  const h = hover != null ? data[hover] : null;

  function onMove(e: React.PointerEvent<SVGSVGElement>) {
    const r = e.currentTarget.getBoundingClientRect();
    const px = ((e.clientX - r.left) / r.width) * W;
    let best = 0;
    data.forEach((d, i) => {
      if (Math.abs(x(d.n) - px) < Math.abs(x(data[best].n) - px)) best = i;
    });
    setHover(best);
  }

  return (
    <div className="rounded-xl border border-border bg-card p-4 sm:p-5">
      <div className="mb-1 text-sm font-semibold text-foreground">{title}</div>
      <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
        <span>{subtitle}</span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-[3px] w-3.5 rounded"
            style={{ background: BEFORE }}
          />
          개선 전 (전체 복사)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span
            className="inline-block h-[3px] w-3.5 rounded"
            style={{ background: AFTER }}
          />
          개선 후 (델타+압축)
        </span>
      </div>
      <div className="relative text-muted-foreground">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="block h-auto w-full"
          onPointerMove={onMove}
          onPointerLeave={() => setHover(null)}
          role="img"
          aria-label={`${title} 개선 전후 저장 크기 비교`}
        >
          {gridY.map((v, i) => (
            <g key={i}>
              <line
                x1={m.l}
                y1={y(v)}
                x2={W - m.r}
                y2={y(v)}
                stroke="currentColor"
                strokeOpacity={0.12}
                strokeWidth={1}
              />
              <text
                x={m.l - 10}
                y={y(v) + 4}
                textAnchor="end"
                fontSize={11}
                fill="currentColor"
                style={{ fontVariantNumeric: "tabular-nums" }}
              >
                {v >= 1000 ? `${(v / 1024).toFixed(1)}MB` : `${Math.round(v)}KB`}
              </text>
            </g>
          ))}
          {data.map((d) => (
            <text
              key={d.n}
              x={x(d.n)}
              y={H - m.b + 20}
              textAnchor="middle"
              fontSize={11}
              fill="currentColor"
              style={{ fontVariantNumeric: "tabular-nums" }}
            >
              {d.n}
            </text>
          ))}
          <text
            x={m.l + iw / 2}
            y={H - 4}
            textAnchor="middle"
            fontSize={11}
            fill="currentColor"
          >
            조작 기록 수 (누적)
          </text>
          <line
            x1={m.l}
            y1={m.t + ih}
            x2={W - m.r}
            y2={m.t + ih}
            stroke="currentColor"
            strokeOpacity={0.25}
            strokeWidth={1}
          />
          <path d={linePath("before")} fill="none" stroke={BEFORE} strokeWidth={2} />
          <path d={linePath("after")} fill="none" stroke={AFTER} strokeWidth={2.5} />
          {data.map((d) => (
            <circle key={`b${d.n}`} cx={x(d.n)} cy={y(d.before)} r={3.5} fill={BEFORE} />
          ))}
          {data.map((d) => (
            <circle key={`a${d.n}`} cx={x(d.n)} cy={y(d.after)} r={3.5} fill={AFTER} />
          ))}
          <text
            x={x(last.n) + 10}
            y={y(last.before) - 8}
            fontSize={12}
            fontWeight={700}
            fill={BEFORE}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(last.before)}
          </text>
          <text
            x={x(last.n) + 10}
            y={y(last.after) + 14}
            fontSize={12}
            fontWeight={700}
            fill={AFTER}
            style={{ fontVariantNumeric: "tabular-nums" }}
          >
            {fmt(last.after)}
          </text>
          {h && (
            <line
              x1={x(h.n)}
              y1={m.t}
              x2={x(h.n)}
              y2={m.t + ih}
              stroke="currentColor"
              strokeOpacity={0.4}
              strokeWidth={1}
              strokeDasharray="3 3"
            />
          )}
        </svg>
        {h && (
          <div
            className="pointer-events-none absolute z-10 -translate-x-1/2 -translate-y-full whitespace-nowrap rounded-lg bg-foreground px-3 py-2 text-xs leading-relaxed text-background shadow-md"
            style={{
              left: `${(x(h.n) / W) * 100}%`,
              top: `${(y(h.after) / H) * 100 - 4}%`,
              fontVariantNumeric: "tabular-nums",
            }}
          >
            조작 {h.n}개 시점
            <br />
            개선 전 {fmt(h.before)} → 개선 후 <b>{fmt(h.after)}</b>
            <br />
            절감 <b>{(h.before / h.after).toFixed(1)}배</b>
          </div>
        )}
      </div>
    </div>
  );
}

export function CompressionChart() {
  return (
    <div className="not-prose my-8 space-y-4">
      <LineChart
        title="시나리오 A — 3D 교구 대량 슬라이드"
        subtitle="조작 20개 시점 3,755KB → 9.3KB (405배)"
        data={A}
      />
      <LineChart
        title="시나리오 B — 일반 슬라이드"
        subtitle="조작 33개 시점 436KB → 16.4KB (26.6배)"
        data={B}
      />
    </div>
  );
}
