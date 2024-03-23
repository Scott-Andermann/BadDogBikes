import { DefaultValues } from "../InputForm";
import { Position } from "./draw";
import { calculateLengthOfLine, lawOfCosinesThreeSides } from "./fourBarCalculations";

export const singlePivotSwingarmLength = (layoutValues: DefaultValues) => {
  const thetaAxleChainstay = Math.asin(
    layoutValues.bbDrop / layoutValues.chainStay
  );
  const rearPivotInitialPosition = {
    x:
      layoutValues.chainStay * Math.cos(thetaAxleChainstay) -
      layoutValues.axleOffsetX,
    y: layoutValues.bbDrop + layoutValues.axleOffsetY,
  };

  const swingarmLength = Math.sqrt(
    (layoutValues.swingarmPivotX - rearPivotInitialPosition.x) ** 2 +
      (layoutValues.swingarmPivotY - rearPivotInitialPosition.y) ** 2
  );

  return swingarmLength;
};

export const singlePivotAxlePath = (
  layoutValues: DefaultValues,
  swingarmLength: number,
  rearPivotPosition: Position[]
) => {

  const lengthToAxle = calculateLengthOfLine(
    { x: layoutValues.swingarmPivotX, y: layoutValues.swingarmPivotY },
    {
      x:
        rearPivotPosition[rearPivotPosition.length - 1].x +
        layoutValues.axleOffsetX,
      y: layoutValues.bbDrop,
    }
  );
  const thetaInSwingarm = lawOfCosinesThreeSides({
    a: swingarmLength,
    b: lengthToAxle,
    c: Math.sqrt(layoutValues.axleOffsetX ** 2 + layoutValues.axleOffsetY ** 2),
  });
  const axlePosition = rearPivotPosition.map((point) => {
    const alpha = Math.atan(
      (point.y - layoutValues.swingarmPivotY) /
        (point.x - layoutValues.swingarmPivotX)
    );
    const totalAngle = alpha - thetaInSwingarm;

    return {
      x: layoutValues.swingarmPivotX + lengthToAxle * Math.cos(totalAngle),
      y: layoutValues.swingarmPivotY + lengthToAxle * Math.sin(totalAngle),
    };
  });

  return axlePosition;
};
