import React from "react";
import { COLORS } from "../constants";
import {
  AFRICA_CLOSE,
  AFRICA_COAST,
  ARABIA_CLOSE,
  ARABIA_COAST,
  landPath,
  LonLat,
  makeProject,
  View,
  XY,
} from "../geo";

type Ctx = { project: (p: LonLat) => XY; k: number };

type Props = {
  w: number;
  h: number;
  view: View;
  seaLabel?: LonLat;
  landLabels?: { at: LonLat; text: string }[];
  labelSize?: number;
  children?: (ctx: Ctx) => React.ReactNode;
};

/** خريطة البحر الأحمر: بحر + يابسة (الجزيرة العربية وأفريقيا) + شبكة خفيفة */
export const RedSeaMap: React.FC<Props> = ({ w, h, view, seaLabel, landLabels = [], labelSize = 26, children }) => {
  const { project, k } = makeProject(view, w, h);
  const arabia = landPath(ARABIA_COAST, ARABIA_CLOSE, project);
  const africa = landPath(AFRICA_COAST, AFRICA_CLOSE, project);
  const gid = `sea-${w}-${h}`;

  const lons: number[] = [];
  for (let l = Math.ceil(view.lon0); l <= view.lon1; l++) lons.push(l);
  const lats: number[] = [];
  for (let l = Math.ceil(view.lat0); l <= view.lat1; l++) lats.push(l);

  return (
    <svg width={w} height={h} style={{ display: "block" }}>
      <defs>
        <linearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#10264a" />
          <stop offset="1" stopColor="#0a1832" />
        </linearGradient>
      </defs>
      <rect width={w} height={h} fill={`url(#${gid})`} />

      {lons.map((l) => {
        const x = project([l, view.lat0])[0];
        return <line key={`lo${l}`} x1={x} y1={0} x2={x} y2={h} stroke="#ffffff10" strokeWidth={1} />;
      })}
      {lats.map((l) => {
        const y = project([view.lon0, l])[1];
        return <line key={`la${l}`} x1={0} y1={y} x2={w} y2={y} stroke="#ffffff10" strokeWidth={1} />;
      })}

      {[arabia, africa].map((d, i) => (
        <g key={i}>
          <path d={d} fill="none" stroke="#6f8cc8" strokeWidth={9} opacity={0.12} strokeLinejoin="round" />
          <path d={d} fill="#222f4d" stroke="#4b6090" strokeWidth={2} strokeLinejoin="round" />
        </g>
      ))}

      {seaLabel && (
        <text
          x={project(seaLabel)[0]}
          y={project(seaLabel)[1]}
          fontSize={labelSize}
          fill={COLORS.muted}
          opacity={0.8}
          textAnchor="middle"
          fontStyle="italic"
        >
          البحر الأحمر
        </text>
      )}
      {landLabels.map((l) => (
        <text
          key={l.text}
          x={project(l.at)[0]}
          y={project(l.at)[1]}
          fontSize={labelSize}
          fill="#7184ad"
          opacity={0.75}
          textAnchor="middle"
        >
          {l.text}
        </text>
      ))}

      {children?.({ project, k })}
    </svg>
  );
};
