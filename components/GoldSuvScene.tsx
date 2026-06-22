import React from 'react';

/**
 * Self-contained "luxury night drive" scene — pure CSS + SVG, no images.
 *
 * A gold Urus-style SUV cruises left → right across a city-at-night road:
 *  • wheels spin while the car moves
 *  • the body has a subtle bounce so it feels alive
 *  • headlight beam + ground shadow ground it in the scene
 *  • everything loops smoothly and scales down cleanly on mobile
 *
 * Easy to edit: tweak the CSS custom properties in `vars` (colours, speed,
 * size) or the keyframe timings in the <style> block below.
 */

// Deterministic skyline so server and client render identically (no hydration
// mismatch). Each building gets a grid of windows; a fixed parity rule lights
// some of them gold.
const BUILDINGS = [
  { x: 20, w: 70, h: 150 },
  { x: 96, w: 54, h: 210 },
  { x: 158, w: 84, h: 120 },
  { x: 250, w: 60, h: 180 },
  { x: 318, w: 48, h: 250 },
  { x: 374, w: 92, h: 140 },
  { x: 474, w: 58, h: 200 },
  { x: 540, w: 76, h: 110 },
  { x: 624, w: 50, h: 230 },
  { x: 682, w: 88, h: 160 },
  { x: 778, w: 56, h: 190 },
  { x: 842, w: 70, h: 130 },
  { x: 920, w: 48, h: 240 },
  { x: 976, w: 96, h: 150 },
  { x: 1080, w: 60, h: 200 },
  { x: 1148, w: 44, h: 170 },
];

const SKYLINE_BASE = 260; // y of pavement line in the skyline viewBox

function buildingWindows(b: { x: number; w: number; h: number }, bi: number) {
  const cells: React.ReactNode[] = [];
  const pad = 8;
  const cw = 9;
  const ch = 11;
  const gx = 7;
  const gy = 9;
  const cols = Math.max(1, Math.floor((b.w - pad * 2) / (cw + gx)));
  const rows = Math.max(1, Math.floor((b.h - pad * 2) / (ch + gy)));
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (bi * 7 + r * 3 + c * 5) % 4 === 0; // fixed → deterministic
      cells.push(
        <rect
          key={`${bi}-${r}-${c}`}
          x={b.x + pad + c * (cw + gx)}
          y={SKYLINE_BASE - b.h + pad + r * (ch + gy)}
          width={cw}
          height={ch}
          fill={lit ? '#f5d27e' : '#15151f'}
          opacity={lit ? 0.85 : 0.6}
        />,
      );
    }
  }
  return cells;
}

export const GoldSuvScene: React.FC = () => {
  return (
    <div className="gss-scene" aria-hidden="true">
      <style>{`
        .gss-scene {
          --gold: #d4af37;
          --gold-hi: #f6dd8b;
          --gold-deep: #9c7415;
          --drive: 9s;        /* time for one full crossing */
          --spin: 0.55s;      /* wheel rotation period */
          position: relative;
          width: 100%;
          height: clamp(280px, 34vw, 400px);
          overflow: hidden;
          background:
            radial-gradient(120% 90% at 50% 100%, rgba(212,175,55,0.18) 0%, transparent 55%),
            linear-gradient(180deg, #05050a 0%, #0a0a14 45%, #0d0b12 70%, #08080c 100%);
        }
        /* faint stars */
        .gss-stars {
          position: absolute; inset: 0;
          background-image:
            radial-gradient(1px 1px at 12% 22%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 28% 14%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 46% 28%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 64% 12%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 82% 24%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 92% 16%, rgba(255,255,255,0.45), transparent);
          opacity: 0.8;
        }
        .gss-skyline {
          position: absolute; left: 0; right: 0; bottom: 30%;
          width: 100%; height: 46%;
          display: block;
        }
        /* road */
        .gss-road {
          position: absolute; left: 0; right: 0; bottom: 0;
          height: 32%;
          background: linear-gradient(180deg, #131017 0%, #0b0a0e 60%, #060608 100%);
          border-top: 1px solid rgba(212,175,55,0.45);
          box-shadow: 0 -10px 30px rgba(0,0,0,0.6) inset;
        }
        /* moving lane dashes for a sense of speed */
        .gss-lane {
          position: absolute; left: -10%; right: -10%;
          top: 46%;
          height: 3px;
          background: repeating-linear-gradient(90deg,
            rgba(246,221,139,0.65) 0, rgba(246,221,139,0.65) 34px,
            transparent 34px, transparent 92px);
          animation: gss-lane-move 0.6s linear infinite;
        }
        .gss-glow {
          position: absolute; left: 0; right: 0; bottom: 28%;
          height: 70px;
          background: radial-gradient(60% 100% at 50% 100%, rgba(212,175,55,0.22), transparent 70%);
          filter: blur(6px);
        }
        /* car positioning + drive across the screen */
        .gss-car {
          position: absolute;
          bottom: 26%;
          left: 0;
          width: clamp(168px, 24vw, 280px);
          will-change: transform;
          animation: gss-drive var(--drive) linear infinite;
        }
        .gss-car-bounce {
          position: relative;
          animation: gss-bounce calc(var(--spin) * 2) ease-in-out infinite;
        }
        .gss-car svg { display: block; width: 100%; height: auto; overflow: visible; }
        /* headlight beam, cast ahead (to the right) */
        .gss-beam {
          position: absolute;
          right: -42%;
          bottom: 14%;
          width: 60%;
          height: 38%;
          background: linear-gradient(90deg, rgba(246,221,139,0.5), rgba(246,221,139,0));
          clip-path: polygon(0 38%, 100% 0, 100% 100%, 0 62%);
          filter: blur(3px);
          opacity: 0.75;
        }
        .gss-wheel {
          transform-box: fill-box;
          transform-origin: center;
          animation: gss-spin var(--spin) linear infinite;
        }
        @keyframes gss-drive {
          0%   { transform: translateX(-22vw); }
          100% { transform: translateX(112vw); }
        }
        @keyframes gss-spin { to { transform: rotate(360deg); } }
        @keyframes gss-bounce {
          0%, 100% { transform: translateY(0) rotate(-0.3deg); }
          50%      { transform: translateY(-3px) rotate(0.3deg); }
        }
        @keyframes gss-lane-move {
          to { background-position: -92px 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          .gss-car, .gss-car-bounce, .gss-wheel, .gss-lane { animation: none; }
          .gss-car { transform: translateX(40vw); }
        }
      `}</style>

      <div className="gss-stars" />

      {/* City skyline */}
      <svg
        className="gss-skyline"
        viewBox="0 0 1200 260"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {BUILDINGS.map((b, bi) => (
          <g key={bi}>
            <rect
              x={b.x}
              y={SKYLINE_BASE - b.h}
              width={b.w}
              height={b.h}
              fill="#0a0a12"
              stroke="rgba(212,175,55,0.10)"
              strokeWidth={1}
            />
            {buildingWindows(b, bi)}
          </g>
        ))}
      </svg>

      <div className="gss-glow" />
      <div className="gss-road" />
      <div className="gss-lane" />

      {/* The gold SUV */}
      <div className="gss-car">
        <div className="gss-car-bounce">
          <div className="gss-beam" />
          <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gssBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f6dd8b" />
                <stop offset="42%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#9c7415" />
              </linearGradient>
              <linearGradient id="gssGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2b3543" />
                <stop offset="100%" stopColor="#0f141b" />
              </linearGradient>
              <radialGradient id="gssRim" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f6dd8b" />
                <stop offset="70%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#7c5d12" />
              </radialGradient>
            </defs>

            {/* ground shadow */}
            <ellipse cx="150" cy="140" rx="120" ry="9" fill="rgba(0,0,0,0.55)" />

            {/* one-piece SUV silhouette (front faces right) */}
            <path
              d="M 18,118 L 18,90 Q 20,80 34,78 L 70,75 L 96,52
                 Q 100,48 108,48 L 192,48 Q 202,48 208,54 L 232,76
                 L 262,80 Q 280,84 282,100 L 282,118 Z"
              fill="url(#gssBody)"
              stroke="#7c5d12"
              strokeWidth="1.5"
            />
            {/* beltline highlight */}
            <path
              d="M 22,86 L 70,80 L 232,80 L 274,86"
              fill="none"
              stroke="#f8e7a8"
              strokeWidth="1.6"
              opacity="0.7"
            />
            {/* glass: front + rear with a body-coloured B-pillar between */}
            <path d="M 104,74 L 120,55 L 150,55 L 150,74 Z" fill="url(#gssGlass)" />
            <path d="M 158,74 L 158,55 L 190,55 L 202,74 Z" fill="url(#gssGlass)" />
            {/* door seam */}
            <line x1="150" y1="78" x2="150" y2="112" stroke="#7c5d12" strokeWidth="1.2" opacity="0.6" />
            {/* headlight (front/right) + taillight (rear/left) */}
            <rect x="268" y="92" width="12" height="7" rx="2" fill="#fff6d8" />
            <rect x="20" y="92" width="9" height="7" rx="2" fill="#d23b34" />

            {/* wheels — spin in place */}
            <g className="gss-wheel">
              <circle cx="74" cy="118" r="22" fill="#0c0c0e" />
              <circle cx="74" cy="118" r="21" fill="none" stroke="#1c1c20" strokeWidth="2" />
              <circle cx="74" cy="118" r="12" fill="url(#gssRim)" />
              <circle cx="74" cy="118" r="3" fill="#5a4a1e" />
              {[0, 72, 144, 216, 288].map((a) => (
                <line
                  key={a}
                  x1="74"
                  y1="118"
                  x2={74 + 11 * Math.cos((a * Math.PI) / 180)}
                  y2={118 + 11 * Math.sin((a * Math.PI) / 180)}
                  stroke="#caa53f"
                  strokeWidth="2.4"
                />
              ))}
            </g>
            <g className="gss-wheel">
              <circle cx="212" cy="118" r="22" fill="#0c0c0e" />
              <circle cx="212" cy="118" r="21" fill="none" stroke="#1c1c20" strokeWidth="2" />
              <circle cx="212" cy="118" r="12" fill="url(#gssRim)" />
              <circle cx="212" cy="118" r="3" fill="#5a4a1e" />
              {[0, 72, 144, 216, 288].map((a) => (
                <line
                  key={a}
                  x1="212"
                  y1="118"
                  x2={212 + 11 * Math.cos((a * Math.PI) / 180)}
                  y2={118 + 11 * Math.sin((a * Math.PI) / 180)}
                  stroke="#caa53f"
                  strokeWidth="2.4"
                />
              ))}
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GoldSuvScene;
