import React from 'react';

/**
 * "Luxury London night drive" — pure CSS + SVG, no external images.
 *
 * A gold Lamborghini Urus-style SUV cruises left → right past a recognisable
 * London skyline at night: the London Eye, Elizabeth Tower (Big Ben), The
 * Shard, the Gherkin, the Walkie-Talkie and Tower Bridge — all gold-lit
 * silhouettes against a black sky.
 *   • wheels spin while the car moves
 *   • the body has a subtle bounce so it feels alive
 *   • headlight beam + ground shadow ground it in the scene
 *   • loops smoothly, scales down on mobile, respects reduced-motion
 *
 * Easy to edit: colours/speed/size live in the CSS custom properties at the
 * top of the <style> block; the skyline is plain SVG you can reshape directly.
 */

// Deterministic lit-window helper so server + client render identically.
function windows(
  x: number,
  y: number,
  w: number,
  h: number,
  cols: number,
  rows: number,
  seed: number,
) {
  const cells: React.ReactNode[] = [];
  const cw = w / cols;
  const ch = h / rows;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const lit = (seed + r * 3 + c * 7) % 5 < 2;
      cells.push(
        <rect
          key={`${seed}-${r}-${c}`}
          x={x + c * cw + cw * 0.22}
          y={y + r * ch + ch * 0.22}
          width={cw * 0.56}
          height={ch * 0.5}
          fill={lit ? '#f6d27e' : '#16161f'}
          opacity={lit ? 0.85 : 0.55}
        />,
      );
    }
  }
  return cells;
}

export const GoldSuvScene: React.FC = () => {
  const stroke = 'rgba(212,175,55,0.35)';
  const fill = '#0a0a12';
  return (
    <div className="gss-scene" aria-hidden="true">
      <style>{`
        .gss-scene {
          --gold: #d4af37;
          --gold-hi: #f6dd8b;
          --drive: 11s;        /* time for one full crossing */
          --spin: 0.55s;       /* wheel rotation period */
          position: relative;
          width: 100%;
          height: clamp(300px, 38vw, 440px);
          overflow: hidden;
          background:
            radial-gradient(130% 90% at 50% 100%, rgba(212,175,55,0.20) 0%, transparent 55%),
            linear-gradient(180deg, #04040a 0%, #0a0a14 42%, #0d0b12 68%, #07070b 100%);
        }
        .gss-stars {
          position: absolute; inset: 0; opacity: 0.8;
          background-image:
            radial-gradient(1px 1px at 12% 18%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 28% 12%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 46% 22%, rgba(255,255,255,0.6), transparent),
            radial-gradient(1px 1px at 64% 10%, rgba(255,255,255,0.5), transparent),
            radial-gradient(1px 1px at 82% 20%, rgba(255,255,255,0.7), transparent),
            radial-gradient(1px 1px at 92% 14%, rgba(255,255,255,0.45), transparent);
        }
        .gss-skyline {
          position: absolute; left: 0; right: 0; bottom: 28%;
          width: 100%; height: 58%; display: block;
        }
        .gss-road {
          position: absolute; left: 0; right: 0; bottom: 0; height: 30%;
          background: linear-gradient(180deg, #131017 0%, #0b0a0e 60%, #050507 100%);
          border-top: 1px solid rgba(212,175,55,0.5);
          box-shadow: 0 -10px 30px rgba(0,0,0,0.6) inset;
        }
        .gss-lane {
          position: absolute; left: -10%; right: -10%; top: 44%; height: 3px;
          background: repeating-linear-gradient(90deg,
            rgba(246,221,139,0.6) 0, rgba(246,221,139,0.6) 34px,
            transparent 34px, transparent 92px);
          animation: gss-lane-move 0.6s linear infinite;
        }
        .gss-glow {
          position: absolute; left: 0; right: 0; bottom: 26%; height: 80px;
          background: radial-gradient(60% 100% at 50% 100%, rgba(212,175,55,0.22), transparent 70%);
          filter: blur(6px);
        }
        .gss-car {
          position: absolute; bottom: 24%; left: 0;
          width: clamp(180px, 26vw, 300px);
          will-change: transform;
          animation: gss-drive var(--drive) linear infinite;
        }
        .gss-car-bounce {
          position: relative;
          animation: gss-bounce calc(var(--spin) * 2) ease-in-out infinite;
        }
        .gss-car svg { display: block; width: 100%; height: auto; overflow: visible; }
        .gss-beam {
          position: absolute; right: -40%; bottom: 16%; width: 58%; height: 34%;
          background: linear-gradient(90deg, rgba(246,221,139,0.5), rgba(246,221,139,0));
          clip-path: polygon(0 38%, 100% 0, 100% 100%, 0 62%);
          filter: blur(3px); opacity: 0.75;
        }
        .gss-wheel {
          transform-box: fill-box; transform-origin: center;
          animation: gss-spin var(--spin) linear infinite;
        }
        @keyframes gss-drive { 0% { transform: translateX(-24vw); } 100% { transform: translateX(114vw); } }
        @keyframes gss-spin { to { transform: rotate(360deg); } }
        @keyframes gss-bounce {
          0%, 100% { transform: translateY(0) rotate(-0.3deg); }
          50%      { transform: translateY(-3px) rotate(0.3deg); }
        }
        @keyframes gss-lane-move { to { background-position: -92px 0; } }
        @media (prefers-reduced-motion: reduce) {
          .gss-car, .gss-car-bounce, .gss-wheel, .gss-lane { animation: none; }
          .gss-car { transform: translateX(42vw); }
        }
      `}</style>

      <div className="gss-stars" />

      {/* ── London skyline ── */}
      <svg
        className="gss-skyline"
        viewBox="0 0 1200 320"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* London Eye */}
        <g stroke={stroke} fill="none" strokeWidth={2}>
          <line x1="92" y1="232" x2="70" y2="300" />
          <line x1="100" y1="232" x2="130" y2="300" />
          <circle cx="100" cy="180" r="78" stroke="rgba(212,175,55,0.5)" />
          <circle cx="100" cy="180" r="64" stroke="rgba(212,175,55,0.25)" />
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return (
              <line
                key={i}
                x1="100"
                y1="180"
                x2={100 + 78 * Math.cos(a)}
                y2={180 + 78 * Math.sin(a)}
                strokeWidth={1}
                stroke="rgba(212,175,55,0.22)"
              />
            );
          })}
          {Array.from({ length: 18 }).map((_, i) => {
            const a = (i / 18) * Math.PI * 2;
            return (
              <circle
                key={`cap-${i}`}
                cx={100 + 71 * Math.cos(a)}
                cy={180 + 71 * Math.sin(a)}
                r={4}
                fill={i % 3 === 0 ? '#f6d27e' : '#1a1a24'}
                stroke="none"
              />
            );
          })}
        </g>

        {/* Elizabeth Tower (Big Ben) */}
        <g>
          <rect x="226" y="150" width="34" height="150" fill={fill} stroke={stroke} />
          <polygon points="226,150 243,108 260,150" fill={fill} stroke={stroke} />
          <line x1="243" y1="108" x2="243" y2="92" stroke={stroke} strokeWidth={2} />
          <circle cx="243" cy="166" r="9" fill="#f6d27e" opacity="0.85" />
          {windows(228, 186, 30, 110, 2, 6, 2)}
        </g>

        {/* The Shard */}
        <g>
          <polygon points="372,300 398,300 432,72 412,72" fill={fill} stroke={stroke} />
          <line x1="403" y1="120" x2="416" y2="120" stroke={stroke} strokeWidth={1} />
          {windows(378, 150, 44, 150, 3, 9, 4).slice(0, 22)}
        </g>

        {/* generic mid-rise filler */}
        <g>
          <rect x="470" y="196" width="40" height="104" fill={fill} stroke={stroke} />
          {windows(472, 200, 36, 96, 3, 6, 1)}
        </g>

        {/* The Gherkin (30 St Mary Axe) */}
        <g>
          <path
            d="M 560,300 Q 540,170 560,150 Q 580,170 560,300 Z"
            fill={fill}
            stroke={stroke}
          />
          <path d="M 560,150 Q 568,156 560,162" fill="none" stroke={stroke} strokeWidth={1} />
          {[0.25, 0.45, 0.65, 0.85].map((t, i) => (
            <line
              key={i}
              x1={544 + i}
              y1={150 + t * 150}
              x2={576 - i}
              y2={150 + t * 150 - 18}
              stroke="rgba(212,175,55,0.18)"
              strokeWidth={1}
            />
          ))}
        </g>

        {/* Walkie-Talkie (20 Fenchurch St) */}
        <g>
          <path
            d="M 624,300 L 628,196 Q 626,176 648,170 L 676,166 Q 700,168 700,190 L 702,300 Z"
            fill={fill}
            stroke={stroke}
          />
          {windows(636, 188, 56, 108, 4, 6, 3)}
        </g>

        {/* a couple more towers leading to the bridge */}
        <g>
          <rect x="724" y="210" width="34" height="90" fill={fill} stroke={stroke} />
          {windows(726, 214, 30, 82, 2, 5, 2)}
          <rect x="766" y="180" width="28" height="120" fill={fill} stroke={stroke} />
          {windows(768, 184, 24, 112, 2, 7, 5)}
        </g>

        {/* ── Tower Bridge ── */}
        <g stroke={stroke} fill={fill}>
          {/* deck / roadway */}
          <rect x="828" y="262" width="344" height="10" fill={fill} stroke={stroke} />
          {/* suspension chains to the banks */}
          <path d="M 828,262 Q 868,238 902,262" fill="none" stroke="rgba(212,175,55,0.4)" />
          <path d="M 1098,262 Q 1134,238 1172,262" fill="none" stroke="rgba(212,175,55,0.4)" />
          {/* two towers */}
          <rect x="892" y="150" width="44" height="118" />
          <rect x="1064" y="150" width="44" height="118" />
          {/* upper walkways between towers */}
          <rect x="936" y="158" width="128" height="12" />
          <rect x="936" y="186" width="128" height="8" fill="none" stroke="rgba(212,175,55,0.3)" />
          {/* pointed turret roofs */}
          <polygon points="892,150 914,118 936,150" />
          <polygon points="1064,150 1086,118 1108,150" />
          <line x1="914" y1="118" x2="914" y2="104" strokeWidth={2} />
          <line x1="1086" y1="118" x2="1086" y2="104" strokeWidth={2} />
          {/* lit windows on the towers */}
          {windows(896, 176, 36, 86, 2, 4, 1)}
          {windows(1068, 176, 36, 86, 2, 4, 4)}
        </g>
      </svg>

      <div className="gss-glow" />
      <div className="gss-road" />
      <div className="gss-lane" />

      {/* ── Gold Lamborghini Urus ── */}
      <div className="gss-car">
        <div className="gss-car-bounce">
          <div className="gss-beam" />
          <svg viewBox="0 0 300 150" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="gssBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#f8e39a" />
                <stop offset="40%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#946f12" />
              </linearGradient>
              <linearGradient id="gssGlass" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#33404f" />
                <stop offset="100%" stopColor="#0d121a" />
              </linearGradient>
              <radialGradient id="gssRim" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f8e39a" />
                <stop offset="65%" stopColor="#d4af37" />
                <stop offset="100%" stopColor="#6f5310" />
              </radialGradient>
            </defs>

            {/* ground shadow */}
            <ellipse cx="150" cy="138" rx="128" ry="9" fill="rgba(0,0,0,0.55)" />

            {/* lower cladding / sills (blacked-out, Urus style) */}
            <path
              d="M 22,104 L 278,104 L 282,116 Q 282,120 276,120 L 26,120 Q 20,120 20,114 Z"
              fill="#0e0e13"
              stroke="#000"
              strokeWidth="1"
            />

            {/* main body — long, low coupé-SUV wedge, nose to the right */}
            <path
              d="M 24,92
                 L 28,80
                 Q 70,55 150,58
                 L 196,57
                 Q 210,58 219,70
                 L 226,80
                 L 286,84
                 Q 295,86 295,98
                 L 295,106
                 L 24,106
                 Z"
              fill="url(#gssBody)"
              stroke="#7c5d12"
              strokeWidth="1.4"
            />

            {/* sharp character line */}
            <path d="M 30,92 L 150,86 L 230,88 L 288,92" fill="none" stroke="#fbeeb6" strokeWidth="1.6" opacity="0.75" />

            {/* greenhouse glass with fast-dropping rear roofline */}
            <path
              d="M 56,76 Q 78,60 150,62 L 192,61 Q 202,62 208,72 L 200,82 L 66,84 Z"
              fill="url(#gssGlass)"
            />
            {/* pillars */}
            <line x1="120" y1="64" x2="120" y2="83" stroke="#7c5d12" strokeWidth="2" opacity="0.7" />
            <line x1="170" y1="62" x2="170" y2="82" stroke="#7c5d12" strokeWidth="1.6" opacity="0.6" />

            {/* angular wheel arches (hexagonal Urus cue) */}
            <path d="M 52,106 L 60,90 L 98,90 L 106,106 Z" fill="none" stroke="#5a4410" strokeWidth="2" />
            <path d="M 190,106 L 198,90 L 236,90 L 244,106 Z" fill="none" stroke="#5a4410" strokeWidth="2" />

            {/* headlight (front/right) + tail light bar (rear/left) */}
            <path d="M 280,86 L 294,89 L 294,95 L 280,93 Z" fill="#fff6d8" />
            <rect x="22" y="86" width="10" height="6" rx="2" fill="#d23b34" />

            {/* wheels — Y-spoke, low-profile, spinning */}
            {[80, 216].map((cx) => (
              <g className="gss-wheel" key={cx}>
                <circle cx={cx} cy="118" r="22" fill="#0c0c0e" />
                <circle cx={cx} cy="118" r="21" fill="none" stroke="#1d1d22" strokeWidth="3" />
                <circle cx={cx} cy="118" r="15" fill="url(#gssRim)" />
                <circle cx={cx} cy="118" r="3.4" fill="#5a4a1e" />
                {[0, 72, 144, 216, 288].map((a) => {
                  const rad = (a * Math.PI) / 180;
                  const rad2 = ((a + 16) * Math.PI) / 180;
                  return (
                    <g key={a} stroke="#caa53f" strokeWidth="2.2">
                      <line
                        x1={cx + 3 * Math.cos(rad)}
                        y1={118 + 3 * Math.sin(rad)}
                        x2={cx + 14 * Math.cos(rad)}
                        y2={118 + 14 * Math.sin(rad)}
                      />
                      <line
                        x1={cx + 3 * Math.cos(rad2)}
                        y1={118 + 3 * Math.sin(rad2)}
                        x2={cx + 14 * Math.cos(rad2)}
                        y2={118 + 14 * Math.sin(rad2)}
                      />
                    </g>
                  );
                })}
              </g>
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
};

export default GoldSuvScene;
