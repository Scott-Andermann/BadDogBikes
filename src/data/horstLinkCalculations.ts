import { DefaultValues } from "../InputForm";
import { Position } from "./draw";
import {
  calculateLengthOfLine,
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
  const thetaInSeatStay = Math.atan((layoutValues.seatStayOffset) / (lAC - layoutValues.rearPivotToAxleLength));
  const seatStayLength = Math.sqrt(layoutValues.seatStayOffset ** 2 + (lAC - layoutValues.rearPivotToAxleLength) ** 2);
  const thetaAB =
    Math.asin((bellcrankInitialPosition.x - axleInitialPosition.x) / lAC) -
    thetaInSeatStay;

  const rearPivotInitialPosition = {
    x: bellcrankInitialPosition.x - seatStayLength * Math.sin(thetaAB),
    y: bellcrankInitialPosition.y - seatStayLength * Math.cos(thetaAB),
  };

  const swingarmLength = calculateLengthOfLine(rearPivotInitialPosition, {
    x: layoutValues.swingarmPivotX,
    y: layoutValues.swingarmPivotY,
  });
  
  return { seatStayLength, swingarmLength, thetaInSeatStay, lAC };
};

export const horstLinkAxlePath = (
  seatStayLength: number,
  seatStayPosition: Position[],
  rearPivotPosition: Position[],
  thetaInSeatStay: number,
  lAC: number,
) => {
  
  const thetaAB = seatStayPosition.map((position, index) => {
    return Math.asin(
      (position.x - rearPivotPosition[index].x) / seatStayLength
    );
  });

  const axlePosition = thetaAB.map((angle, index) => {
    const position: Position = {
      
      x: - lAC * Math.sin(angle + thetaInSeatStay) + seatStayPosition[index].x,
      y: - lAC * Math.cos(angle + thetaInSeatStay) + seatStayPosition[index].y,
    };
    return position;
  });

  
  return axlePosition;
};
