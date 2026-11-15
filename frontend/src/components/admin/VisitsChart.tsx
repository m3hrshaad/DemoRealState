import { useId, useState } from 'react';
import { faNum } from '../../lib/format';
import type { ChartPoint } from '../../lib/types';

type VisitsChartProps = {
  data: ChartPoint[];
  kind?: 'line' | 'bar';
  formatLabel: (date: string) => string;
  caption: string;
};

const W = 620;
const H = 210;
const PAD_X = 38;
const PAD_TOP = 18;
const PAD_BOTTOM = 36;

export function VisitsChart({ data, kind = 'line', formatLabel, caption }: VisitsChartProps) {
  const gradientId = useId().replace(/:/g, '');
  const [hovered, setHovered] = useState<number | null>(null);
  const total = data.reduce((sum, point) => sum + point.value, 0);

  if (total === 0) {
    return (
      <div className="flex h-[190px] flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-navy-900/12 bg-navy-50/40 text-center">
        <p className="text-[12px] text-navy-500">در این بازه بازدیدی ثبت نشده است.</p>
        <p className="text-[10.5px] text-navy-400">نمودار پس از ثبت اولین بازدیدها نمایش داده می‌شود.</p>
      </div>
    );
  }

  const innerW = W - PAD_X * 2;
  const innerH = H - PAD_TOP - PAD_BOTTOM;
  const max = Math.max(...data.map((point) => point.value), 1);
  const stepX = data.length > 1 ? innerW / (data.length - 1) : innerW;
  const barSlot = innerW / data.length;
  const barWidth = Math.max(6, Math.min(30, barSlot * 0.52));
  const labelEvery = Math.ceil(data.length / 7);

  const xFor = (index: number) => PAD_X + index * stepX;
  const yFor = (value: number) => PAD_TOP + innerH - (value / max) * innerH;

  const points = data.map((point, index) => `${xFor(index)},${yFor(point.value)}`).join(' ');
  const areaPath = `M ${xFor(0)} ${PAD_TOP + innerH} L ${data
    .map((point, index) => `${xFor(index)} ${yFor(point.value)}`)
    .join(' L ')} L ${xFor(data.length - 1)} ${PAD_TOP + innerH} Z`;

  const active = hovered !== null ? data[hovered] : null;

  return (
    <figure>
      <div className="mb-3 flex items-center justify-between">
        <figcaption className="text-[10.5px] text-navy-400">{caption}</figcaption>
        <p className="text-[10.5px] text-navy-500">
          {active ? (
            <span>
              {formatLabel(active.date)}: <strong className="text-navy-900">{faNum(active.value)}</strong> بازدید
            </span>
          ) : (
            'برای مشاهده جزئیات، روی نمودار حرکت کنید'
          )}
        </p>
      </div>

      <div className="w-full" dir="ltr">
        <svg
          viewBox={`0 0 ${W} ${H}`}
          className="h-[190px] w-full"
          role="img"
          aria-label={caption}
          onMouseLeave={() => setHovered(null)}
        >
          {[0, 0.5, 1].map((ratio) => {
            const y = PAD_TOP + innerH * ratio;
            const value = Math.round(max * (1 - ratio));
            return (
              <g key={ratio}>
                <line
                  x1={PAD_X}
                  y1={y}
                  x2={W - PAD_X}
                  y2={y}
                  stroke="currentColor"
                  className="text-navy-900/8"
                  strokeDasharray="3 5"
                />
                <text x={PAD_X - 8} y={y + 3} textAnchor="end" className="fill-navy-300 text-[9px]">
                  {faNum(value)}
                </text>
              </g>
            );
          })}

          {kind === 'line' ? (
            <>
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#C2A173" stopOpacity="0.28" />
                  <stop offset="100%" stopColor="#C2A173" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d={areaPath} fill={`url(#${gradientId})`} />
              <polyline points={points} fill="none" stroke="#B08F5E" strokeWidth="2" strokeLinejoin="round" />
              {data.map((point, index) => (
                <g key={point.date}>
                  <circle
                    cx={xFor(index)}
                    cy={yFor(point.value)}
                    r={hovered === index ? 4.5 : 2.6}
                    fill="#0B1B2B"
                    stroke="#F7F4EE"
                    strokeWidth="1.4"
                  />
                  <rect
                    x={xFor(index) - stepX / 2}
                    y={PAD_TOP}
                    width={stepX}
                    height={innerH}
                    fill="transparent"
                    onMouseEnter={() => setHovered(index)}
                  />
                </g>
              ))}
            </>
          ) : (
            data.map((point, index) => {
              const height = Math.max(2, (point.value / max) * innerH);
              const x = PAD_X + index * barSlot + (barSlot - barWidth) / 2;
              return (
                <g key={point.date} onMouseEnter={() => setHovered(index)}>
                  <rect
                    x={x}
                    y={PAD_TOP + innerH - height}
                    width={barWidth}
                    height={height}
                    rx="3"
                    fill={hovered === index ? '#B08F5E' : '#12344E'}
                    className="transition"
                  />
                  <rect x={x} y={PAD_TOP} width={barWidth} height={innerH} fill="transparent" />
                </g>
              );
            })
          )}

          {data.map((point, index) =>
            index % labelEvery === 0 || index === data.length - 1 ? (
              <text
                key={`label-${point.date}`}
                x={kind === 'line' ? xFor(index) : PAD_X + index * barSlot + barSlot / 2}
                y={H - 12}
                textAnchor="middle"
                className="fill-navy-400 text-[9px]"
              >
                {formatLabel(point.date)}
              </text>
            ) : null,
          )}
        </svg>
      </div>
    </figure>
  );
}
