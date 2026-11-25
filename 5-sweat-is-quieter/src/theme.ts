import { loadFont as loadAnton } from "@remotion/google-fonts/Anton";
import { loadFont as loadOswald } from "@remotion/google-fonts/Oswald";

/** Judul & caption besar */
export const { fontFamily: display } = loadAnton("normal", { weights: ["400"], subsets: ["latin"] });
/** Label kecil */
export const { fontFamily: body } = loadOswald("normal", { weights: ["500", "700"], subsets: ["latin"] });

export const C = {
  bg: "#0B0B0D",
  bg2: "#18171B",
  steel: "#2B2B31",
  ash: "#5E5C61",
  dim: "#9A968E",
  ink: "#F3EFE6",
  bone: "#D8D2C4",
  boneDark: "#A9A396",
  gold: "#E8B04B",
  goldDark: "#B07F28",
  red: "#D8402E",
  dawn: "#F08A3C",
  black: "#000000",
};
