/**
 * WIP
 * 
 * TO DO: evoluir modelo da engine para usar react.
 * ref: https://github.com/replit/kaboom/issues/74
 */

import { useEffect, useRef } from "react";
import kaboom, { KaboomCtx, KaboomOpt } from "kaboom";

const Engine = ({ run, options }: { run: (kaboom: KaboomCtx) => void, options?: KaboomOpt }) => {
  const isRunning = useRef(false);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (isRunning.current || !canvasRef || !canvasRef.current) {
      return;
    }
    isRunning.current = true;
    run(kaboom({
      ...options,
      global: false,
      canvas: canvasRef.current as HTMLCanvasElement,
    }))
  }, [options, run])

  return <canvas ref={canvasRef} className="" />;
}

export default Engine