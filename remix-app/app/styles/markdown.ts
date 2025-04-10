import { css } from "styled-system/css";

export const markdownStyles = css({
  "& h1": {
    textStyle: "heading1/markdown",
  },
  "& h2": {
    textStyle: "heading2/markdown",
  },
  "& h3": {
    textStyle: "heading3/markdown",
  },
  "& h4": {
    textStyle: "heading4/markdown",
  },
  "& h5": {
    textStyle: "heading5/markdown",
  },
  "& h6": {
    textStyle: "heading6/markdown",
  },
  "& p": {
    textStyle: "body/markdown",
  },
  "& h1, h2, h3, h4, h5, h6, p, table, ul, ol": {
    mb: "2",
  },
  "& ul": {
    textStyle: "body/markdown",
    listStyleType: "disc",
    listStylePosition: "inside",
    paddingLeft: "4",
  },
  "& ol": {
    textStyle: "body/markdown",
    listStyleType: "decimal",
    listStylePosition: "inside",
    paddingLeft: "4",
  },
  "& li": {
    textStyle: "body/markdown",
  },
  "& blockquote": {
    textStyle: "body/markdown",
    borderLeftWidth: "2px",
    borderLeftColor: "gray.200",
    borderLeftStyle: "solid",
    paddingLeft: "4",
    mx: "4",
    my: "4",
    backgroundColor: "gray.50",
    padding: "2",
    borderRadius: "4",
  },
  "& table": {
    textStyle: "body/markdown",
    rounded: "lg",
    overflow: "hidden",
    shadow: "lg",
    "& th": {
      fontWeight: "bold",
      backgroundColor: "zinc.200/60",
      borderBottom: "1px solid",
      borderColor: "violet.800/40",
    },
    "& td": {
      borderBottom: "1px solid",
      borderColor: "zinc.800/30",
      backgroundColor: "zinc.100/40",
    },
    "& th, td": {
      py: "2",
      px: "4",
    },
  },
});
