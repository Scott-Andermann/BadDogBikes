import { useRef, useEffect, useState } from "react";
import { Position } from "./data/draw";
import { DefaultValues } from "./InputForm";
import draw from "./data/draw";

interface CanvasProps {
  shockPosition: Position[];
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
  bellcrankOffset: Position;
  zeroOffset: Position;
  layoutValues: DefaultValues;
}

const Canvas = ({
  shockPosition,
  seatStayPosition,
  rearPivotPosition,
  axlePath,
  bellcrankOffset,
  zeroOffset,
  layoutValues,
}: CanvasProps) => {
  const [paused, setPaused] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      draw({
        ctx,
        shockPosition,
        seatStayPosition,
        rearPivotPosition,
        axlePath,
        bellcrankOffset,
        zeroOffset,
        layoutValues,
        paused,
      });
    }
  }, [layoutValues, paused]);

  return (
    <div className="flex flex-col">
      <canvas
        key={paused ? "1" : "0"}
        ref={ref}
        id="tutorial"
        width={800}
        height={800}
        className="bg-blue-50 aspect-square w-[400px] h-[400px] rounded-lg"
      >
        Bad Dog Bikes
      </canvas>
      <div className="flex flex-row gap-2">
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 w-36"
          onClick={() => setPaused(!paused)}
        >
          {!paused ? "Pause" : "Play"} Animation
        </button>
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 max-w-max"
          onClick={() => setZoomLevel((prev) => prev + 1)}
        >
          Zoom In
        </button>
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 max-w-max"
          onClick={() => setZoomLevel(1)}
        >
          Reset Zoom
        </button>
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 max-w-max"
          onClick={() => setZoomLevel((prev) => prev / 2)}
        >
          Zoom Out
        </button>
      </div>
    </div>
  );
};

export default Canvas;
