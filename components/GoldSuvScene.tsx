import React from 'react';

const URUS = '/urus-hertfordshire-night.webp';

export const GoldSuvScene: React.FC = () => (
  <>
    <style>{`
      @keyframes gss-kenburns {
        0%   { transform: scale(1.08) translateX(0px); }
        50%  { transform: scale(1.13) translateX(-18px); }
        100% { transform: scale(1.08) translateX(0px); }
      }
      @keyframes gss-shimmer {
        0%, 100% { opacity: 0.18; }
        50%       { opacity: 0.28; }
      }
      @media (prefers-reduced-motion: reduce) {
        .gss-photo { animation: none !important; transform: none !important; }
      }
    `}</style>

    <div
      style={{
        position: 'relative',
        width: '100%',
        height: 'clamp(420px, 68vh, 780px)',
        overflow: 'hidden',
        background: '#06060a',
      }}
    >
      {/* Real photo — Ken Burns pan gives it motion without any SVG */}
      <div
        className="gss-photo"
        style={{
          position: 'absolute',
          inset: '-6% -3%',
          backgroundImage: `url("${URUS}")`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 55%',
          backgroundRepeat: 'no-repeat',
          animation: 'gss-kenburns 14s ease-in-out infinite',
        }}
      />

      {/* Subtle gold shimmer highlight — reinforces the headlight glow in the photo */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 55% 40% at 52% 62%, rgba(212,175,55,0.12) 0%, transparent 70%)',
          animation: 'gss-shimmer 5s ease-in-out infinite',
          pointerEvents: 'none',
        }}
      />

      {/* Top fade — blends into the section above */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '22%',
          background: 'linear-gradient(to bottom, #121316 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Bottom fade — blends into the footer */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '28%',
          background: 'linear-gradient(to top, #121316 0%, transparent 100%)',
          pointerEvents: 'none',
        }}
      />

      {/* Left vignette */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to right, rgba(6,6,10,0.55) 0%, transparent 35%, transparent 65%, rgba(6,6,10,0.3) 100%)',
          pointerEvents: 'none',
        }}
      />
    </div>
  </>
);

export default GoldSuvScene;
