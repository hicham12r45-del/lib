// كل التوقيتات بالإطارات (30fps). المجموع = 2550 إطاراً = 1:25
export const FPS = 30;
export const TOTAL_FRAMES = 2550;

export const SCENES = {
  intro: { from: 0, dur: 600 }, // 0:00 – 0:20
  land: { from: 600, dur: 1050 }, // 0:20 – 0:55
  sea: { from: 1650, dur: 660 }, // 0:55 – 1:17
  end: { from: 2310, dur: 240 }, // 1:17 – 1:25
} as const;

export const COLORS = {
  midnight: "#0a1230",
  charcoal: "#141821",
  deepBlue: "#0f2547",
  gold: "#e8c27a",
  text: "#f2efe6",
  muted: "#9aa6c0",
  sea: "#1b4f8a",
};
