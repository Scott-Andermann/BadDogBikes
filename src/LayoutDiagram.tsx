import * as React from "react";
import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import { Position } from "./data/draw";
// import { calculateAxlePath } from "./data/singlePivotCalculations";
import { DefaultValues } from "./InputForm";

interface LayoutDiagramProps {
  layoutValues: DefaultValues;
  layoutType: string;
  shockPosition: Position[];
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
  setShowLayout: React.Dispatch<React.SetStateAction<boolean>>;
  antiSquatHeight: number[];
  IFC: Position[]
}

const LayoutDiagram = ({ layoutValues, layoutType, shockPosition, seatStayPosition, rearPivotPosition, axlePath, setShowLayout, antiSquatHeight, IFC }: LayoutDiagramProps) => {
  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [layoutType, layoutValues]);

  return (
    <>
      {Array.isArray(axlePath) && axlePath.length > 0 && IFC.length > 0 ? (
        <Canvas
          key={key}
          shockPosition={shockPosition}
          seatStayPosition={seatStayPosition}
          rearPivotPosition={rearPivotPosition}
          axlePath={axlePath}
          layoutValues={layoutValues}
          humanInput={undefined}
          setShowLayout={setShowLayout}
          antiSquatHeight={antiSquatHeight}
          IFC={IFC}
        />
      ) : null}
    </>
  );
};

export default LayoutDiagram;
