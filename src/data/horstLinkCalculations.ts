import { DefaultValues } from "../InputForm";
import { Position } from "./draw";
import {
  calculateLengthOfLine,
  lawOfCosinesThreeSides,
} from "./fourBarCalculations";

export const horstLinkSeatStayLength = (
  layoutValues: DefaultValues,
  outputAngle: number[]
) => {
  const bellcrankInitialPosition = {
    x:
      Math.cos(outputAngle[outputAngle.length - 1]) * layoutValues.bellcrankB +
      layoutValues.bellcrankX,
    y:
      Math.sin(outputAngle[outputAngle.length - 1]) * layoutValues.bellcrankB +
      layoutValues.bellcrankY,
  };

  const axleInitialPosition = {
    x:
      layoutValues.chainStay *
      Math.cos(Math.asin(layoutValues.bbDrop / layoutValues.chainStay)),
    y: layoutValues.bbDrop,
  };

  const lAC = calculateLengthOfLine(
    bellcrankInitialPosition,
    axleInitialPosition
  );
  const thetaInSeatStay = Math.asin(layoutValues.seatStayOffset / lAC);

  const seatStayLength =
    lAC * Math.cos(thetaInSeatStay) - layoutValues.rearPivotToAxleLength;

  const thetaAB =
    Math.asin((bellcrankInitialPosition.x - axleInitialPosition.x) / lAC) -
    thetaInSeatStay;

  const rearPivotInitialPosition = {
    x: bellcrankInitialPosition.x - seatStayLength * Math.sin(thetaAB),
    y: bellcrankInitialPosition.y - seatStayLength * Math.cos(thetaAB),
  };
  console.log(rearPivotInitialPosition);

  const swingarmLength = calculateLengthOfLine(rearPivotInitialPosition, {
    x: layoutValues.swingarmPivotX,
    y: layoutValues.swingarmPivotY,
  });

  return { seatStayLength, swingarmLength };
};

export const horstLinkAxlePath = (
  layoutValues: DefaultValues,
  seatStayLength: number,
  seatStayPosition: Position[],
  rearPivotPosition: Position[]
) => {
  const thetaAB = seatStayPosition.map((position, index) => {
    return Math.asin((position.x - rearPivotPosition[index].x) / seatStayLength)
  })

  const axlePosition = thetaAB.map((angle, index) => {
    // console.log("bellcrank", seatStayPosition[index].x);
    // console.log("thru rear pivot", (seatStayLength + layoutValues.rearPivotToAxleLength) * Math.sin(angle));
    // console.log("add offset", layoutValues.seatStayOffset * Math.cos(angle));
    
    const position = {
      x: - (seatStayLength + layoutValues.rearPivotToAxleLength) * Math.sin(angle) - layoutValues.seatStayOffset * Math.cos(angle) + seatStayPosition[index].x,
      y: - (seatStayLength + layoutValues.rearPivotToAxleLength) * Math.cos(angle) + layoutValues.seatStayOffset * Math.sin(angle) + seatStayPosition[index].y,
    }
    return position;
  })
  // console.log(axlePosition[axlePosition.length - 1]);
  

  return axlePosition;
};
