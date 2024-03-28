import { useRef, useEffect, useState } from 'react';
import { Position } from './data/draw';
import { DefaultValues } from './InputForm';
import draw from './data/draw';
import { HumanInputProps } from './HumanInputs';
import * as React from 'react';

interface CanvasProps {
  shockPosition: Position[];
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
  layoutValues: DefaultValues;
  humanInput: HumanInputProps | undefined;
  setShowLayout: React.Dispatch<React.SetStateAction<boolean>>;
  antiSquatHeight: number[];
  IFC: Position[];
  paused: boolean;
  setPaused: React.Dispatch<React.SetStateAction<boolean>>;
  pausePosition: string;
  setPausePosition: React.Dispatch<React.SetStateAction<string>>;
  instantCenter: Position[];
}

const Canvas = ({
  shockPosition,
  seatStayPosition,
  rearPivotPosition,
  axlePath,
  layoutValues,
  humanInput,
  setShowLayout,
  antiSquatHeight,
  IFC,
  paused,
  setPaused,
  pausePosition,
  setPausePosition,
  instantCenter,
}: CanvasProps) => {
  const [showConstruction, setShowConstruction] = useState(true);
  const ref = useRef<HTMLCanvasElement>(null);
  const zeroOffset = { x: 500, y: 750 };  

  const bellcrankOffset = {
    x: zeroOffset.x - layoutValues.bellcrankX,
    y: zeroOffset.y - layoutValues.bellcrankY,
  };
  useEffect(() => {
    const canvas = ref.current;

    if (canvas) {
      const ctx = canvas.getContext('2d');
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
        antiSquatHeight,
        IFC,
        instantCenter,
        showConstruction,
      });
    }
  }, [layoutValues, paused, pausePosition, antiSquatHeight, showConstruction]);

  const handleToggleAnimation = () => {
    setPaused(!paused);
    setPausePosition('');
  };

  const pauseAtTop = () => {
    setPaused(true);
    setPausePosition('top');
  };

  return (
    <>
      <canvas
        key={paused ? '1' : '0'}
        ref={ref}
        id="tutorial"
        width={1600}
        height={800}
        className="bg-[#818d92] aspect-square w-[120vh] h-[60vh] rounded-lg"
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
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 w-40 whitespace-nowrap"
          onClick={() => setShowConstruction(!showConstruction)}
        >
          Show Construction
        </button>
        <button
          className="bg-blue-400 border-blue-600 border border-solid rounded-sm p-2 w-36"
          onClick={() => setShowLayout(false)}
        >
          Show Charts
        </button>
        <p>
          Travel: {Math.round(axlePath[0].y - layoutValues.bbDrop)}
        </p>
      </div>
    </>
  );
};

export default Canvas;
