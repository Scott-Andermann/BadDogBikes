import { useState, useEffect } from "react";
import { Position } from "./data/draw";
import calculatedPositions from "./data/calculatedPositions";
import { DefaultValues } from "./InputForm";
import { calculateAxlePath } from "./data/singlePivotCalculations";
import Canvas from "./Canvas";
import LayoutDiagram from "./LayoutDiagram";
import ScatterPlot from "./ScatterPlot";

interface ResultsWrapperProps {
  layoutValues: DefaultValues;
  layoutType: string;
}

const ResultsWrapper = ({ layoutValues, layoutType }: ResultsWrapperProps) => {
  const [axlePath, setAxlePath] = useState<Position[]>();
  const [showLayout, setShowLayout] = useState(true);

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
    if (layoutType === "singlePivot") {
      setAxlePath(
        calculateAxlePath(layoutValues, swingarmLength, rearPivotPosition)
      );
    }
  }, [layoutType, layoutValues]);

  return (
    <div className="relative w-[160vh] h-[80vh]">
      {showLayout && axlePath !== undefined ? (
        <LayoutDiagram
          layoutValues={layoutValues}
          layoutType="singlePivot"
          shockPosition={shockPosition}
          seatStayPosition={seatStayPosition}
          rearPivotPosition={rearPivotPosition}
          axlePath={axlePath}
          setShowLayout={setShowLayout}
        />
      ) : (
        <div className="text-white">
          {Array.isArray(axlePath) && axlePath.length > 0 ? (
            <div className="h-60">
              <ScatterPlot
                inputData={axlePath}
                arrayInput={[]}
                title="Axle Path"
              />
            </div>
          ) : null}
          <button onClick={() => setShowLayout(true)}>show layout</button>
        </div>
      )}
    </div>
  );
};

export default ResultsWrapper;
