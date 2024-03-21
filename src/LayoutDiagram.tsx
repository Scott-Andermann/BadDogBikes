import { useState, useEffect } from "react";
import Canvas from "./Canvas";
import calculatedPositions from "./data/calculatedPositions";
import { Position } from "./data/draw";
import { calculateAxlePath } from "./data/singlePivotCalculations";
import { DefaultValues } from "./InputForm";

interface LayoutDiagramProps {
  layoutValues: DefaultValues;
  layoutType: string;
}

const LayoutDiagram = ({layoutValues, layoutType}: LayoutDiagramProps) => {
  const [key, setKey] = useState(0);
  const [axlePath, setAxlePath] = useState<Position[]>();
  const zeroOffset = { x: 500, y: 750 };

  const bellcrankOffset = {
    x: zeroOffset.x - layoutValues.bellcrankX,
    y: zeroOffset.y - layoutValues.bellcrankY,
  };

  const {
    shockSteps,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength,
    swingarmLength,
    rearPivotPosition,
  } = calculatedPositions(layoutValues);


  useEffect(() => {
    if (
      layoutType === "singlePivot"
    ) {
      setAxlePath(calculateAxlePath(layoutValues, swingarmLength, rearPivotPosition))
    }
    setKey((prev) => prev + 1);
  }, [layoutType, layoutValues]);


  return (
    <>
    {Array.isArray(axlePath) && axlePath.length > 0  ? 
      <Canvas
      key={key}
      shockPosition={shockPosition}
      seatStayPosition={seatStayPosition}
      rearPivotPosition={rearPivotPosition}
      axlePath={axlePath}
      bellcrankOffset={bellcrankOffset}
      zeroOffset={zeroOffset}
      layoutValues={layoutValues}
      humanInput={undefined}
      />
    : null} 
    </>

   );
}
 
export default LayoutDiagram;