// بيانات جغرافية مبسّطة لساحل البحر الأحمر (إحداثيات تقريبية lon, lat)
// الهدف: خريطة أقرب للواقع من الرسم التخطيطي، وليست خريطة مساحية دقيقة.
export type LonLat = [number, number];
export type XY = [number, number];
export type View = { lon0: number; lon1: number; lat0: number; lat1: number };

// الساحل الشرقي للبحر الأحمر (الحجاز وتهامة واليمن) من الشمال إلى الجنوب
export const ARABIA_COAST: LonLat[] = [
  [35.0, 28.2], [35.7, 27.35], [36.45, 26.25], [37.27, 25.03], [38.06, 24.09],
  [39.03, 22.8], [39.15, 21.5], [39.48, 20.7], [40.27, 20.15], [41.08, 19.12],
  [41.55, 18.2], [42.55, 16.9], [42.8, 16.2], [42.95, 14.8], [43.25, 13.3],
  [43.45, 12.7], [45.0, 12.8],
];
export const ARABIA_CLOSE: LonLat[] = [[47, 12.8], [47, 29], [35.0, 29]];

// الساحل الغربي (مصر والسودان وإريتريا وجيبوتي) من الشمال إلى الجنوب
export const AFRICA_COAST: LonLat[] = [
  [33.4, 28.0], [33.8, 27.25], [34.28, 26.1], [34.9, 25.07], [35.5, 23.95],
  [35.8, 23.9], [35.65, 23.2], [36.2, 22.6], [36.9, 21.95], [37.1, 21.0],
  [37.2, 20.0], [37.22, 19.6], [37.33, 19.1], [37.9, 18.2], [38.6, 17.7],
  [39.1, 16.6], [39.47, 15.62], [39.7, 15.25], [40.2, 14.55], [41.0, 13.95],
  [42.73, 13.0], [43.3, 12.7], [43.2, 11.7],
];
export const AFRICA_CLOSE: LonLat[] = [[43.2, 9.5], [30, 9.5], [30, 29], [33.4, 29]];

export const MECCA: LonLat = [39.83, 21.42];
export const JEDDAH: LonLat = [39.17, 21.54];
export const SHUAIBA: LonLat = [39.48, 20.7];
export const ADULIS: LonLat = [39.66, 15.25];

// مسار القافلة البري (تخطيطي) ومسار السفينتين البحري
export const ROUTE_LAND: LonLat[] = [MECCA, [39.72, 21.25], [39.66, 21.05], [39.55, 20.88], SHUAIBA];
export const ROUTE_SEA: LonLat[] = [SHUAIBA, [39.52, 19.0], [39.58, 17.2], ADULIS];

/** إسقاط (lon, lat) إلى بكسلات داخل مستطيل w×h مع ملاءمة العرض المحدد */
export const makeProject = (view: View, w: number, h: number) => {
  const c = Math.cos((((view.lat0 + view.lat1) / 2) * Math.PI) / 180);
  const dLon = (view.lon1 - view.lon0) * c;
  const dLat = view.lat1 - view.lat0;
  const k = Math.min(w / dLon, h / dLat); // بكسل لكل درجة عرض
  const ox = (w - dLon * k) / 2;
  const oy = (h - dLat * k) / 2;
  const project = (p: LonLat): XY => [ox + (p[0] - view.lon0) * c * k, oy + (view.lat1 - p[1]) * k];
  return { project, k };
};

const f1 = (n: number) => n.toFixed(1);

/** منحنى ناعم (Catmull-Rom → Bézier) يمرّ بكل النقاط */
export const smoothPath = (pts: XY[]): string => {
  let d = `M${f1(pts[0][0])} ${f1(pts[0][1])}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] ?? pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] ?? p2;
    const c1: XY = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: XY = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${f1(c1[0])} ${f1(c1[1])} ${f1(c2[0])} ${f1(c2[1])} ${f1(p2[0])} ${f1(p2[1])}`;
  }
  return d;
};

/** مضلّع يابسة: ساحل ناعم + إغلاق مستقيم */
export const landPath = (coast: LonLat[], close: LonLat[], project: (p: LonLat) => XY): string => {
  const tail = close
    .map((p) => {
      const [x, y] = project(p);
      return `L${f1(x)} ${f1(y)}`;
    })
    .join(" ");
  return `${smoothPath(coast.map(project))} ${tail} Z`;
};
