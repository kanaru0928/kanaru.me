import { styled } from "styled-system/jsx";

export const SkeltonLetter = styled("span", {
  base: {
    color: "transparent",
    background: "zinc.900/70",
    rounded: "md",
    filter: "auto",
    blur: "md",
    p: 0,
    m: 0,
    animation: "pulse 1.5s infinite",
  },
});
