import { useEffect, useRef } from "react";
import { usePuzzle } from "../hooks/usePuzzle";

export function Puzzle() {
  const ref = useRef<HTMLCanvasElement>(null);

  const { init } = usePuzzle();

  useEffect(() => {
    const gl = ref.current?.getContext("webgl");
    if (gl === null || gl === undefined) {
      alert("WebGL not supported");
      return;
    }
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    init(gl);
  }, [init]);

  return <canvas ref={ref} width={640} height={480} />;
}
