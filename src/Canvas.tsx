import { useRef, useEffect, useState } from "react";
import { Position } from "./data/draw";
import { DefaultValues } from "./InputForm";
import draw from "./data/draw";
import { HumanInputProps } from "./HumanInputs";

interface CanvasProps {
  shockPosition: Position[];
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
  bellcrankOffset: Position;
  zeroOffset: Position;
  layoutValues: DefaultValues;
  humanInput: HumanInputProps | undefined;
}

const Canvas = ({
  shockPosition,
  seatStayPosition,
  rearPivotPosition,
  axlePath,
  bellcrankOffset,
  zeroOffset,
  layoutValues,
  humanInput,
}: CanvasProps) => {
  const [paused, setPaused] = useState(true);
  const [pausePosition, setPausePosition] = useState("");
  // const [zoomLevel, setZoomLevel] = useState(1);
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
        pausePosition,
        humanInput,
      });
    }
  }, [layoutValues, paused, pausePosition]);

  const handleToggleAnimation = () => {
    setPaused(!paused);
    setPausePosition("");
  };

  const pauseAtTop = () => {
    setPaused(true);
    setPausePosition("top");
  }

  return (
    <div className="relative">
      <canvas
        key={paused ? "1" : "0"}
        ref={ref}
        id="tutorial"
        width={1600}
        height={800}
        className="bg-[#818d92] aspect-square w-[160vh] h-[80vh] rounded-lg"
      >
        Bad Dog Bikes
      </canvas>
      <div className="flex flex-row gap-2 absolute top-4 left-4">
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 w-36"
          onClick={handleToggleAnimation}
        >
          Toggle Animation
        </button>
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 w-36"
          onClick={pauseAtTop}
        >
          Pause At Top
        </button>
      </div>
    </div>
  );
};

export default Canvas;
