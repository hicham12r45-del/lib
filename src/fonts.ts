import { loadFont } from "@remotion/google-fonts/Cairo";

// تحميل خط Cairo بدعم العربية
export const { fontFamily } = loadFont("normal", {
  weights: ["400", "700", "900"],
  subsets: ["arabic", "latin"],
});
