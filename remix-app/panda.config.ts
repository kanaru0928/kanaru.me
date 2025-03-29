import { defineConfig } from "@pandacss/dev";
import { textStyles } from "~/styles/textStyles";

export default defineConfig({
  // Whether to use css reset
  preflight: true,

  // Where to look for your css declarations
  include: ["./app/**/*.{js,jsx,ts,tsx}"],

  // Files to exclude
  exclude: [],

  // Useful for theme customization
  theme: {
    extend: {
      textStyles,
    },
  },

  jsxFramework: "react",

  // The output directory for your css system
  outdir: "styled-system",
});
