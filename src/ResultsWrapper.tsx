import { useState, useEffect } from "react";
import { Position } from "./data/draw";
import calculatedPositions from "./data/calculatedPositions";
import { DefaultValues } from "./InputForm";
import {
  singlePivotAxlePath,
  singlePivotSwingarmLength,
} from "./data/singlePivotCalculations";
import Canvas from "./Canvas";
import LayoutDiagram from "./LayoutDiagram";
import ScatterPlot from "./ScatterPlot";
import { calculateRearPivot } from "./data/fourBarCalculations";
import { horstLinkAxlePath, horstLinkSeatStayLength } from "./data/horstLinkCalculations";

interface ResultsWrapperProps {
  layoutValues: DefaultValues;
}

const ResultsWrapper = ({ layoutValues }: ResultsWrapperProps) => {
  const [axlePath, setAxlePath] = useState<Position[]>();
  const [showLayout, setShowLayout] = useState(true);
  const [rearPivotPosition, setRearPivotPosition] = useState<Position[]>([]);

  const {
    shockSteps,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength,
  } = calculatedPositions(layoutValues);

  useEffect(() => {
    if (layoutValues.layoutType === "singlePivot") {
      const swingarmLength = singlePivotSwingarmLength(layoutValues);
      const rearPivotPosition = calculateRearPivot(
        layoutValues,
        shockSteps,
        swingarmLength,
        shockPosition,
        outputAngle,
        seatStayPosition,
        seatStayLength
      );
      setRearPivotPosition(rearPivotPosition);
      setAxlePath(
        singlePivotAxlePath(layoutValues, swingarmLength, rearPivotPosition)
      );
    }
    if (layoutValues.layoutType === "horst") {
      const { seatStayLength, swingarmLength } = horstLinkSeatStayLength(layoutValues, outputAngle);
      const rearPivotPosition = calculateRearPivot(
        layoutValues,
        shockSteps,
        swingarmLength,
        shockPosition,
        outputAngle,
        seatStayPosition,
        seatStayLength
      );
      setRearPivotPosition(rearPivotPosition);
      setAxlePath(
        horstLinkAxlePath(layoutValues, seatStayLength, seatStayPosition, rearPivotPosition)
      );      
    }
  }, [layoutValues.layoutType, layoutValues]);

  // console.log(axlePath);


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
