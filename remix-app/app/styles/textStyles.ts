import { defineTextStyles } from "@pandacss/dev";

export const textStyles = defineTextStyles({
  heading1: {
    description: "Heading 1",
    value: {
      fontSize: "3xl",
      fontWeight: "bold",
    },
  },
  heading2: {
    description: "Heading 2",
    value: {
      fontSize: "xl",
      fontWeight: "bold",
    },
  },
  heading3: {
    description: "Heading 3",
    value: {
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
  "heading1/markdown": {
    description: "Heading 1 for markdown",
    value: {
      fontSize: "3xl",
      fontWeight: "bold",
    },
  },
  "heading2/markdown": {
    description: "Heading 2 for markdown",
    value: {
      fontSize: "2xl",
      fontWeight: "bold",
    },
  },
  "heading3/markdown": {
    description: "Heading 3 for markdown",
    value: {
      fontSize: "xl",
      fontWeight: "bold",
    },
  },
  "heading4/markdown": {
    description: "Heading 4 for markdown",
    value: {
      fontSize: "lg",
      fontWeight: "bold",
    },
  },
  "heading5/markdown": {
    description: "Heading 5 for markdown",
    value: {
      fontWeight: "bold",
    },
  },
  "heading6/markdown": {
    description: "Heading 6 for markdown",
    value: {
      fontWeight: "bold",
    },
  },
  "body/markdown": {
    description: "Body for markdown",
    value: {
      fontSize: "md",
      fontWeight: "normal",
    },
  },
});
