import React from "react";
import { AbsoluteFill, interpolate, random, useCurrentFrame } from "remotion";
import { COLORS } from "../constants";
import { Camel } from "./Camel";
import { Camera } from "./Camera";
import { Figure } from "./Figure";

const W = 1920;
const GY = 905; // خط الأرض للشخصيات

/** حافة جبلية دورية (تتكرر كل 1920px) تتحرك بإزاحة shift لإحساس التقدّم */
const ridge = (base: number, amps: number[], freqs: number[], ph: number[], shift: number) => {
  let d = "M-20 1080";
  for (let x = -20; x <= W + 20; x += 20) {
    let y = base;
    for (let i = 0; i < amps.length; i++) {
      y += amps[i] * Math.sin((2 * Math.PI * freqs[i] * (x - shift)) / W + ph[i]);
    }
    d += ` L${x} ${y.toFixed(1)}`;
  }
  return d + " L1940 1080 Z";
};

const LAYERS = [
  { base: 610, amps: [70, 40, 22, 12], freqs: [1, 2, 4, 7], ph: [0.5, 1.7, 3.1, 0.2], speed: 0.18, fill: "#18284d" },
  { base: 705, amps: [55, 30, 16], freqs: [1, 3, 6], ph: [2.2, 0.4, 1.1], speed: 0.55, fill: "#111e3d" },
  { base: 805, amps: [28, 16, 8], freqs: [2, 3, 9], ph: [1, 2, 0.3], speed: 1.4, fill: "#0b152d" },
];

type Props = { start: number; dur: number };

/** لقطة ليلية قريبة لقافلة بلا ملامح: طبقات متحركة (Parallax) + جمال + فانوس */
export const CaravanCloseUp: React.FC<Props> = ({ start, dur }) => {
  const frame = useCurrentFrame();
  const flicker = 0.85 + 0.15 * Math.sin(frame * 0.7) * Math.sin(frame * 0.23);

  return (
    <Camera dur={dur} from={start} zoom={[1, 1.07]} pan={[-30, 0]} origin="35% 75%">
      <AbsoluteFill style={{ background: "linear-gradient(180deg,#040918 0%,#0d1a3a 55%,#1c2f58 100%)" }} />

      {/* نجوم وقمر */}
      <svg width={W} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 90 }).map((_, i) => (
          <circle
            key={i}
            cx={random(`cx-${i}`) * W}
            cy={random(`cy-${i}`) * 560}
            r={0.8 + random(`cr-${i}`) * 2}
            fill="#fff"
            opacity={0.35 + 0.45 * Math.sin(frame * 0.07 + i * 1.7)}
          />
        ))}
        <circle cx={420} cy={200} r={170} fill="#f4ecd0" opacity={0.06} />
        <circle cx={420} cy={200} r={110} fill="#f4ecd0" opacity={0.1} />
        <circle cx={420} cy={200} r={70} fill="#f6eed4" />
        {/* وهج الأفق */}
        <rect x={0} y={520} width={W} height={160} fill="#3a5088" opacity={0.12} />

        {/* طبقات الجبال المتحركة */}
        {LAYERS.slice(0, 2).map((l, i) => (
          <path key={i} d={ridge(l.base, l.amps, l.freqs, l.ph, frame * l.speed)} fill={l.fill} />
        ))}
        <path
          d={ridge(LAYERS[2].base, LAYERS[2].amps, LAYERS[2].freqs, LAYERS[2].ph, frame * LAYERS[2].speed)}
          fill={LAYERS[2].fill}
        />

        {/* الأرض */}
        <rect x={0} y={860} width={W} height={220} fill="#09112a" />
        <rect x={0} y={860} width={W} height={3} fill="#2a3b66" opacity={0.7} />
      </svg>

      {/* القافلة */}
      <svg width={W} height={1080} style={{ position: "absolute" }}>
        {/* وهج الفانوس */}
        <defs>
          <radialGradient id="lantern">
            <stop offset="0" stopColor="#ffd98a" stopOpacity={0.9} />
            <stop offset="1" stopColor="#ffd98a" stopOpacity={0} />
          </radialGradient>
        </defs>
        <circle cx={398} cy={740} r={170 * flicker} fill="url(#lantern)" opacity={0.55} />

        <Figure x={360} y={GY - 144} frame={frame} scale={1.9} phase={0} color="#e3dcc8" />
        <rect x={392} y={730} width={13} height={18} rx={3} fill="#ffcf70" />
        <Camel x={700} y={GY} frame={frame} phase={0.4} />
        <Figure x={945} y={GY - 144} frame={frame} scale={1.8} phase={2.1} color="#cfc7b0" />
        <Camel x={1170} y={GY} frame={frame} phase={1.9} />
      </svg>

      {/* غبار رمل وشجيرات أمامية سريعة */}
      <svg width={W} height={1080} style={{ position: "absolute" }}>
        {Array.from({ length: 40 }).map((_, i) => {
          const x = (random(`dx-${i}`) * W + frame * (1.5 + random(`ds-${i}`) * 2.5)) % W;
          const y = 880 + random(`dy-${i}`) * 180;
          return <circle key={i} cx={x} cy={y} r={1 + random(`dr-${i}`) * 2} fill="#b7a98a" opacity={0.18} />;
        })}
        {Array.from({ length: 5 }).map((_, i) => {
          const x = ((random(`bx-${i}`) * (W + 400) + frame * 5) % (W + 400)) - 200;
          const s = 0.8 + random(`bs-${i}`) * 0.8;
          return (
            <path
              key={i}
              transform={`translate(${x} 1040) scale(${s})`}
              d="M-40 40 L-28 -10 L-18 30 L-6 -30 L4 28 L16 -18 L26 30 L40 40 Z"
              fill="#040913"
            />
          );
        })}
      </svg>

      {/* تعتيم أطراف الكادر */}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 55%, transparent 55%, #00000066 100%)" }} />
      <div
        style={{
          position: "absolute",
          bottom: 40,
          left: 60,
          fontSize: 26,
          color: COLORS.muted,
          opacity: 0.8,
        }}
      >
        ليلاً وبسرية تامة
      </div>
    </Camera>
  );
};
