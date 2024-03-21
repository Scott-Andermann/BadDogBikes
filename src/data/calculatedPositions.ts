import { DefaultValues } from "../InputForm";
import {
  calculateOutputAngle,
  calculateSeatStayBellcrankPivot,
  calculateShockPosition,
  createShockSteps,
  calculateRearPivot,
  calculateSeatStayLength,
  calculateSwingarmLength,
} from "./fourBarCalculations";

const calculatedPositions = (layoutValues: DefaultValues) => {

  const shockSteps = createShockSteps(layoutValues, 60);

  const shockPosition = calculateShockPosition(layoutValues, shockSteps);
  const outputAngle = calculateOutputAngle(
    layoutValues,
    shockSteps,
    shockPosition
  );
  const seatStayPosition = calculateSeatStayBellcrankPivot(
    layoutValues,
    shockSteps,
    shockPosition,
    outputAngle
  );
  const seatStayLength = calculateSeatStayLength(
    layoutValues,
    shockSteps,
    shockPosition,
    outputAngle
  );
  const swingarmLength = calculateSwingarmLength(layoutValues);

  const rearPivotPosition = calculateRearPivot(
    layoutValues,
    shockSteps,
    swingarmLength,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength
  );

  return {
    shockSteps,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength,
    swingarmLength,
    rearPivotPosition,
  }

}

export default calculatedPositions;