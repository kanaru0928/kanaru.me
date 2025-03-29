import { ComponentProps } from "react";

interface Props extends ComponentProps<"div"> {
  color?: string;
  size?: number;
}

export function IconBrandWantedly({ color, size, ...props }: Props) {
  return (
    <div {...props}>
      <svg
        id="a"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 250 250"
        width={size ?? 24}
        height={size ?? 24}
        stroke={color ?? "currentColor"}
        strokeWidth="20"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="206.29" cy="75.06" r="25.32" />
        <path
          d="M103.75,147.7c-1.52-1-5.88-6.78-17.81-35.36-.75-1.8-1.45-3.34-2.11-4.67l-2.44-5.9-21-50.64H18.39l21,50.64,21,50.64,19.4,46.79c.37.89,1.39,1.3,2.28.93.42-.18.76-.51.93-.93l21.08-50.46c.14-.38,0-.81-.33-1.04Z"
          fill-rule="evenodd"
        />
        <path
          d="M182.35,147.7c-1.52-1-5.88-6.79-17.81-35.37-.75-1.79-1.45-3.33-2.11-4.66l-2.44-5.9-21-50.64h-41.93l21,50.64,21,50.64,19.33,46.79c.37.89,1.39,1.3,2.28.93.42-.18.76-.51.93-.93l21.09-50.46c.14-.38,0-.81-.34-1.04Z"
          fill-rule="evenodd"
        />
      </svg>
    </div>
  );
}
