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
import { calculateRearPivot, calculateLeverRatio, calculateChainGrowth } from "./data/fourBarCalculations";
import {
  horstLinkAxlePath,
  horstLinkSeatStayLength,
} from "./data/horstLinkCalculations";
import * as React from "react";
import { LayoutArray } from "./App";
import { calculateAntiSquatLine, calculateIFC } from "./data/antiSquat";
import { calculateAntiSquat } from "./data/antiSquat";

interface ResultsWrapperProps {
  layoutValues: DefaultValues;
  layoutArray: LayoutArray[];
  axlePath: Position[];
  setAxlePath: React.Dispatch<React.SetStateAction<Position[]>>;
  antiSquat: Position[];
  setAntiSquat: React.Dispatch<React.SetStateAction<Position[]>>;
  leverageRatio: Position[];
  setLeverageRatio: React.Dispatch<React.SetStateAction<Position[]>>;
  chainGrowth: Position[];
  setChainGrowth: React.Dispatch<React.SetStateAction<Position[]>>;
}

const centerOfGravity = {x: 0, y: 650}


const ResultsWrapper = ({
  layoutValues,
  layoutArray,
  axlePath,
  setAxlePath,
  antiSquat,
  setAntiSquat,
  leverageRatio,
  setLeverageRatio,
  chainGrowth,
  setChainGrowth
}: ResultsWrapperProps) => {
  const [showLayout, setShowLayout] = useState(true);
  const [rearPivotPosition, setRearPivotPosition] = useState<Position[]>([]);
  const [IFC, setIFC] = useState<Position[]>([]);
  const [antiSquatHeight, setAntiSquatHeight] = useState<number[]>([]);

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
    const antiSquatHeight = calculateAntiSquatLine(axlePath, layoutValues);
    setAntiSquatHeight(antiSquatHeight);
    const antiSquat = calculateAntiSquat(centerOfGravity, antiSquatHeight);
    const chartData = antiSquat.map((step, index) => {
      return { x: axlePath[index].y, y: step };
    });

    setAntiSquat(chartData);
    if (axlePath.length > 0) {
      const lever = calculateLeverRatio(
        axlePath,
        layoutValues,
      );
      const chain = calculateChainGrowth(axlePath);
      const leverChart = lever.map((ratio, index) => {
        return { x: axlePath[index].y, y: ratio };
      });
      const chainGrowthChart = chain.map((step, index) => {
        return { x: axlePath[index].y, y: step };
      })
      setLeverageRatio(leverChart as Position[]);
      setChainGrowth(chainGrowthChart);

    }
  }, [layoutValues, axlePath]);

  return (
  <div className="relative w-[120vh] h-[60vh]">
      {showLayout && axlePath !== undefined && IFC !== undefined ? (
        <LayoutDiagram
          layoutValues={layoutValues}
          layoutType="singlePivot"
          shockPosition={shockPosition}
          seatStayPosition={seatStayPosition}
          rearPivotPosition={rearPivotPosition}
          axlePath={axlePath}
          setShowLayout={setShowLayout}
          antiSquatHeight={antiSquatHeight}
          IFC={IFC}
        />
      ) : (
        <div className="text-white">
          <button onClick={() => setShowLayout(true)}>show layout</button>
          {Array.isArray(axlePath) && axlePath.length > 0 ? (
            <div className="h-60 flex flex-row flex-wrap">
              <ScatterPlot
                inputData={axlePath}
                arrayInput={layoutArray.map((layout) => ({ ...layout.axlePath, color: layout.color }))}
                title="Axle Path"
              />
              <ScatterPlot
                inputData={antiSquat}
                arrayInput={layoutArray.map((layout) => ({...layout.antiSquat, color: layout.color}))}
                title="Anti Squat"
                normalize={true}
                travelOnXaxis={true}
              />
              <ScatterPlot
                inputData={leverageRatio}
                arrayInput={layoutArray.map((layout) => ({...layout.leverageRatio, color: layout.color}))}
                title="Leverage Ratio"
                normalize={true}
                travelOnXaxis={true}
              />
              <ScatterPlot
                inputData={chainGrowth}
                arrayInput={layoutArray.map((layout) => ({...layout.chainGrowth, color: layout.color}))}
                title="Chain Growth"
                normalize={true}
                travelOnXaxis={true}
              />
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};

export default ResultsWrapper;
