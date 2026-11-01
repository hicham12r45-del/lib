// كل التوقيتات بالإطارات (30fps). المجموع = 2550 إطاراً = 1:25
// مطابقة لنص التعليق الصوتي المؤقّت
export const FPS = 30;
export const TOTAL_FRAMES = 2550;

export const SCENES = {
  intro: { from: 0, dur: 660 }, // 0:00 – 0:22
  land: { from: 660, dur: 660 }, // 0:22 – 0:44
  sea: { from: 1320, dur: 690 }, // 0:44 – 1:07
  end: { from: 2010, dur: 540 }, // 1:07 – 1:25
} as const;

// مدة بطاقة عنوان الفصل في بداية كل مشهد (بالإطارات)
export const TITLES = {
  intro: 90, // 0:00 – 0:03
  land: 120, // 0:22 – 0:26
  sea: 90, // 0:44 – 0:47
  end: 120, // 1:07 – 1:11
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
