import { useState, useEffect } from "react";
import { Position } from "./data/draw";
import calculatedPositions from "./data/calculatedPositions";
import { DefaultValues } from "./InputForm";
import {
  singlePivotAxlePath,
  singlePivotSwingarmLength,
} from "./data/singlePivotCalculations";
import LayoutDiagram from "./LayoutDiagram";
import ScatterPlot from "./ScatterPlot";
import { calculateRearPivot } from "./data/fourBarCalculations";
import {
  horstLinkAxlePath,
  horstLinkSeatStayLength,
} from "./data/horstLinkCalculations";
import * as React from "react";
import { LayoutArray } from "./App";
import { calculateAntiSquatLine, calculateIFC } from "./data/antiSquat";

interface ResultsWrapperProps {
  layoutValues: DefaultValues;
  layoutArray: LayoutArray[];
  axlePath: Position[];
  setAxlePath: React.Dispatch<React.SetStateAction<Position[]>>;
}

const ResultsWrapper = ({
  layoutValues,
  layoutArray,
  axlePath,
  setAxlePath,
}: ResultsWrapperProps) => {
  const [showLayout, setShowLayout] = useState(true);
  const [rearPivotPosition, setRearPivotPosition] = useState<Position[]>([]);
  const [IFC, setIFC] = useState<Position[]>([]);
  const [antiSquat, setAntiSquat] = useState<number[]>([]);

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
      const { seatStayLength, swingarmLength } = horstLinkSeatStayLength(
        layoutValues,
        outputAngle
      );
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
        horstLinkAxlePath(
          layoutValues,
          seatStayLength,
          seatStayPosition,
          rearPivotPosition
        )
      );
    }
  }, [layoutValues.layoutType, layoutValues]);

  useEffect(() => {
    setIFC(calculateIFC(layoutValues, axlePath));
    setAntiSquat(calculateAntiSquatLine(axlePath, layoutValues));
  }, [layoutValues, axlePath]);

  // console.log(axlePath);

  return (
    <div className="relative w-[160vh] h-[80vh]">
      {showLayout && axlePath !== undefined && IFC !== undefined ? (
        <LayoutDiagram
          layoutValues={layoutValues}
          layoutType="singlePivot"
          shockPosition={shockPosition}
          seatStayPosition={seatStayPosition}
          rearPivotPosition={rearPivotPosition}
          axlePath={axlePath}
          setShowLayout={setShowLayout}
          antiSquatHeight={antiSquat}
          IFC={IFC}
        />
      ) : (
        <div className="text-white">
          {Array.isArray(axlePath) && axlePath.length > 0 ? (
            <div className="h-60">
              <ScatterPlot
                inputData={axlePath}
                arrayInput={layoutArray}
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
