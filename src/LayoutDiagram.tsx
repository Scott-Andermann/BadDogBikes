import * as React from "react";
import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import calculatedPositions from "./data/calculatedPositions";
import { Position } from "./data/draw";
import { calculateAxlePath } from "./data/singlePivotCalculations";
import { DefaultValues } from "./InputForm";

interface LayoutDiagramProps {
  layoutValues: DefaultValues;
  layoutType: string;
  shockPosition: Position[];
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
  setShowLayout: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutDiagram = ({ layoutValues, layoutType, shockPosition, seatStayPosition, rearPivotPosition, axlePath, setShowLayout }: LayoutDiagramProps) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [layoutType, layoutValues]);

  return (
    <>
      {Array.isArray(axlePath) && axlePath.length > 0 ? (
        <Canvas
          key={key}
          shockPosition={shockPosition}
          seatStayPosition={seatStayPosition}
          rearPivotPosition={rearPivotPosition}
          axlePath={axlePath}
          layoutValues={layoutValues}
          humanInput={undefined}
          setShowLayout={setShowLayout}
        />
      ) : null}
    </>
  );
};

export default LayoutDiagram;
