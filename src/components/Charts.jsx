import { useEffect, useId, useRef, useState } from "react";


export function Sparkline({ data = [], positive = true, className = "h-10 w-24" }) {
  if (data.length < 2) return null;
  const width = 120;
  const height = 40;
  const pad = 2;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const span = max - min || 1;
  const d = data.map((value, index) => {
    const x = pad + (index / (data.length - 1)) * (width - pad * 2);
    const y = height - pad - ((value - min) / span) * (height - pad * 2);
    return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
  }).join(" ");
  const color = positive ? "#3ddc97" : "#ff5c7a";
  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} aria-hidden="true">
      <path d={d} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
    </svg>
  );
}

export function CandleChart({ series = [], className = "h-44 w-full" }) {
  if (series.length < 2) return null;
  const width = 560;
  const height = 210;
  const pad = 10;
  const max = Math.max(...series);
  const min = Math.min(...series);
  const span = max - min || 1;
  const slot = (width - pad * 2) / series.length;
  const y = (value) => pad + (1 - (value - min) / span) * (height - pad * 2);
  const candles = series.map((close, index) => {
    const open = index === 0 ? close * 0.998 : series[index - 1];
    return { o: open, c: close, h: Math.max(open, close) * 1.002, l: Math.min(open, close) * 0.998 };
  });

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className={className} role="img" aria-label="Price chart">
      {[0, 1, 2, 3].map((line) => {
        const yLine = pad + ((height - pad * 2) / 3) * line;
        return <line key={line} x1={pad} x2={width - pad} y1={yLine} y2={yLine} stroke="rgba(255,255,255,0.06)" />;
      })}
      {candles.map((candle, index) => {
        const x = pad + index * slot + slot / 2;
        const up = candle.c >= candle.o;
        const color = up ? "#3ddc97" : "#ff5c7a";
        const top = y(Math.max(candle.o, candle.c));
        const bottom = y(Math.min(candle.o, candle.c));
        return (
          <g key={index}>
            <line x1={x} x2={x} y1={y(candle.h)} y2={y(candle.l)} stroke={color} strokeWidth="1.4" />
            <rect x={x - slot * 0.28} y={top} width={Math.max(2, slot * 0.56)} height={Math.max(1.6, bottom - top)} rx="1" fill={color} />
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({ points = [], compare = [], labels = [], positive = true, animateKey = "chart" }) {
  const box = useRef(null);
  const lineRef = useRef(null);
  const [hover, setHover] = useState(null);
  const gradientId = useId().replace(/:/g, "");

  useEffect(() => {
    const path = lineRef.current;
    if (!path) return undefined;
    const length = path.getTotalLength();
    path.style.transition = "none";
    path.style.strokeDasharray = `${length}`;
    path.style.strokeDashoffset = `${length}`;
    const frame = requestAnimationFrame(() => {
      path.style.transition = "stroke-dashoffset 1.2s ease";
      path.style.strokeDashoffset = "0";
    });
    return () => cancelAnimationFrame(frame);
  }, [animateKey]);

  if (points.length < 2) return null;
  const width = 760;
  const height = 280;
  const padX = 12;
  const padY = 18;
  const all = compare.length ? [...points, ...compare] : points;
  const min = Math.min(...all);
  const max = Math.max(...all);
  const span = max - min || 1;
  const coords = (series) => series.map((value, index) => {
    const x = padX + (index / (series.length - 1)) * (width - padX * 2);
    const y = padY + (1 - (value - min) / span) * (height - padY * 2);
    return [x, y];
  });
  const line = coords(points);
  const path = line.map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ");
  const area = `${path} L${line[line.length - 1][0].toFixed(1)},${height - 8} L${line[0][0].toFixed(1)},${height - 8} Z`;
  const bench = compare.length ? coords(compare).map((point, index) => `${index ? "L" : "M"}${point[0].toFixed(1)},${point[1].toFixed(1)}`).join(" ") : "";
  const stroke = positive ? "#3ddc97" : "#ff5c7a";
  const active = hover == null ? null : line[hover];

  const move = (event) => {
    const rect = box.current?.getBoundingClientRect();
    if (!rect) return;
    const ratio = (event.clientX - rect.left) / rect.width;
    const index = Math.round(ratio * (points.length - 1));
    setHover(Math.max(0, Math.min(points.length - 1, index)));
  };

  return (
    <div ref={box} className="relative" onPointerMove={move} onPointerLeave={() => setHover(null)}>
      <svg viewBox={`0 0 ${width} ${height}`} className="h-56 w-full sm:h-72">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity="0.35" />
            <stop offset="100%" stopColor={stroke} stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 1, 2, 3].map((lineIndex) => {
          const y = padY + ((height - padY * 2) / 3) * lineIndex;
          return <line key={lineIndex} x1={padX} x2={width - padX} y1={y} y2={y} stroke="rgba(255,255,255,0.06)" />;
        })}
        <path d={area} fill={`url(#${gradientId})`} />
        {bench && <path d={bench} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" strokeDasharray="5 6" />}
        <path ref={lineRef} d={path} fill="none" stroke={stroke} strokeWidth="2.6" strokeLinejoin="round" strokeLinecap="round" />
        {active && (
          <>
            <line x1={active[0]} x2={active[0]} y1={padY} y2={height - 8} stroke="rgba(255,255,255,0.35)" />
            <circle cx={active[0]} cy={active[1]} r="4.5" fill={stroke} />
          </>
        )}
      </svg>
      {hover != null && (
        <div
          className="pointer-events-none absolute top-2 rounded-xl border border-white/10 bg-[#0c1424]/95 px-3 py-2 text-xs shadow-xl"
          style={{ left: `clamp(8px, ${(hover / (points.length - 1)) * 100}%, calc(100% - 140px))` }}
        >
          <p className="text-slate-400">{labels[hover] || `Point ${hover + 1}`}</p>
          <p className="font-semibold text-white">{points[hover].toLocaleString("en-US", { style: "currency", currency: "USD" })}</p>
        </div>
      )}
    </div>
  );
}

export function Donut({ slices = [] }) {
  const total = slices.reduce((sum, slice) => sum + slice.value, 0);
  if (!total) {
    return <p className="text-sm text-slate-400">Allocation appears after the first position.</p>;
  }
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const arcs = slices.reduce((list, slice) => {
    const consumed = list.reduce((sum, arc) => sum + arc.length, 0);
    const length = (slice.value / total) * circumference;
    return [...list, { ...slice, length, offset: -consumed }];
  }, []);
  return (
    <svg viewBox="0 0 120 120" className="h-40 w-40" role="img" aria-label="Portfolio allocation">
      <circle cx="60" cy="60" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="12" />
      {arcs.map((slice) => (
        <circle
          key={slice.label}
          cx="60"
          cy="60"
          r={radius}
          fill="none"
          stroke={slice.color}
          strokeWidth="12"
          strokeDasharray={`${slice.length} ${circumference - slice.length}`}
          strokeDashoffset={slice.offset}
          strokeLinecap="butt"
          transform="rotate(-90 60 60)"
        />
      ))}
      <text x="60" y="58" textAnchor="middle" fill="white" fontSize="11" fontFamily="Syne, sans-serif">Mix</text>
      <text x="60" y="72" textAnchor="middle" fill="#93a0b8" fontSize="8">{slices.length} sleeves</text>
    </svg>
  );
}
