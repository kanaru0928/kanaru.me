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
});
