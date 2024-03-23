import { DefaultValues } from "../InputForm";
import { Position } from "./draw";

export const bellcrankPivot = { x: 12, y: 150 };
export const bellcrankLengths = { a: 80, b: 100, c: 150 };
export const shockLength = { max: 185, min: 130 };
export const shockMount = { x: -55, y: 25 };

export const createShockSteps = (
  layoutValues: DefaultValues,
  steps: number
) => {
  const shockStepSize = (layoutValues.shockMax - layoutValues.shockMin) / steps;
  const shockSteps = [];
  for (let i = 0; i <= steps; i++) {
    shockSteps.push(layoutValues.shockMin + shockStepSize * i);
  }

  return shockSteps;
};

export const lawOfCosinesThreeSides = ({
  a,
  b,
  c,
}: {
  a: number;
  b: number;
  c: number;
}) => {
  return Math.acos((a ** 2 + b ** 2 - c ** 2) / (2 * a * b));
};

export const lawOfCosinesTwoSides = ({
  a,
  b,
  gamma,
}: {
  a: number;
  b: number;
  gamma: number;
}) => {
  return Math.sqrt(a ** 2 + b ** 2 - 2 * a * b * Math.cos(gamma));
};

// calculate the position of the upper shock mount for each shock step
export const calculateShockPosition = (
  layoutValues: DefaultValues,
  shockSteps: number[]
) => {
  const shockPositionBC = {
    x: layoutValues.shockMountX - layoutValues.bellcrankX,
    y: layoutValues.shockMountY - layoutValues.bellcrankY,
  };
  const lengthM = Math.sqrt(shockPositionBC.x ** 2 + shockPositionBC.y ** 2);
  const thetaShock = Math.atan(shockPositionBC.y / shockPositionBC.x);
  const shockPosition = shockSteps.map((step) => {
    const alpha =
      lawOfCosinesThreeSides({
        a: lengthM,
        b: step,
        c: bellcrankLengths.a,
      }) + thetaShock;
    return {
      x: shockPositionBC.x + step * Math.cos(alpha),
      y: shockPositionBC.y + step * Math.sin(alpha),
    };
  });

  return shockPosition;
};

export const calculateOutputAngle = (
  layoutValues: DefaultValues,
  shockSteps: number[],
  shockPosition?: Position[]
) => {
  if (shockPosition === undefined) {
    shockPosition = calculateShockPosition(layoutValues, shockSteps);
  }
  const bellcrankFixedAngle = lawOfCosinesThreeSides({
    a: layoutValues.bellcrankA,
    b: layoutValues.bellcrankB,
    c: layoutValues.bellcrankC,
  });
  
  const outputAngle = shockPosition.map((step) => {
    if (step.y < 0) {
      return Math.PI - (-1 * Math.atan(Math.abs(step.y / step.x)) + bellcrankFixedAngle)
    }
    return (
      Math.PI - (Math.atan(Math.abs(step.y / step.x)) + bellcrankFixedAngle)
    );
  });
  return outputAngle;
};

export const calculateSeatStayLength = (
  layoutValues: DefaultValues,
  shockSteps: number[],
  shockPosition?: Position[],
  outputAngle?: number[]
) => {
  if (shockPosition === undefined) {
    shockPosition = calculateShockPosition(layoutValues, shockSteps);
  }
  if (outputAngle === undefined) {
    outputAngle = calculateOutputAngle(layoutValues, shockSteps, shockPosition);
  }
  const thetaAxleChainstay = Math.asin(
    layoutValues.bbDrop / layoutValues.chainStay
  );
  const rearPivotInitialPosition = {
    x:
      layoutValues.chainStay * Math.cos(thetaAxleChainstay) -
      layoutValues.axleOffsetX,
    y: layoutValues.bbDrop + layoutValues.axleOffsetY,
  };

  const bellcrankInitialPosition = {
    x:
      Math.cos(outputAngle[outputAngle.length - 1]) * layoutValues.bellcrankB +
      layoutValues.bellcrankX,
    y:
      Math.sin(outputAngle[outputAngle.length - 1]) * layoutValues.bellcrankB +
      layoutValues.bellcrankY,
  };

  const seatStayLength = Math.sqrt(
    (rearPivotInitialPosition.x - bellcrankInitialPosition.x) ** 2 +
      (rearPivotInitialPosition.y - bellcrankInitialPosition.y) ** 2
  );

  return seatStayLength;
};

export const calculateSwingarmLength = (layoutValues: DefaultValues) => {
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

export const calculateSeatStayBellcrankPivot = (
  layoutValues: DefaultValues,
  shockSteps: number[],
  shockPosition?: Position[],
  outputAngle?: number[]
) => {
  if (shockPosition === undefined) {
    shockPosition = calculateShockPosition(layoutValues, shockSteps);
  }
  if (outputAngle === undefined) {
    outputAngle = calculateOutputAngle(layoutValues, shockSteps, shockPosition);
  }

  const seatStayBellcrankPosition = outputAngle.map((step) => {
    return {
      x: Math.cos(step) * layoutValues.bellcrankB + layoutValues.bellcrankX,
      y: Math.sin(step) * layoutValues.bellcrankB + layoutValues.bellcrankY,
    };
  });
  return seatStayBellcrankPosition;
};

export const calculateRearPivot = (
  layoutValues: DefaultValues,
  shockSteps: number[],
  swingarmLength: number,
  shockPosition?: Position[],
  outputAngle?: number[],
  seatStayBellcrankPosition?: Position[],
  seatStayLength?: number
) => {
  if (shockPosition === undefined) {
    shockPosition = calculateShockPosition(layoutValues, shockSteps);
  }
  if (outputAngle === undefined) {
    outputAngle = calculateOutputAngle(layoutValues, shockSteps, shockPosition);
  }
  if (seatStayBellcrankPosition === undefined) {
    seatStayBellcrankPosition = calculateSeatStayBellcrankPivot(
      layoutValues,
      shockSteps,
      shockPosition,
      outputAngle
    );
  }
  if (seatStayLength === undefined) {
    seatStayLength = calculateSeatStayLength(
      layoutValues,
      shockSteps,
      shockPosition,
      outputAngle
    );
  }

  const thetaFrame =
    Math.PI / 2 +
    Math.atan(
      (layoutValues.swingarmPivotX - layoutValues.bellcrankX) /
        (layoutValues.swingarmPivotY - layoutValues.bellcrankY)
    );

  const lengthFrame = calculateLengthOfLine(
    { x: layoutValues.bellcrankX, y: layoutValues.bellcrankY },
    { x: layoutValues.swingarmPivotX, y: layoutValues.swingarmPivotY }
  );

  const lCB = outputAngle.map((step) => {
    return lawOfCosinesTwoSides({
      a: layoutValues.bellcrankB,
      b: lengthFrame,
      gamma: step + thetaFrame,
    });
  });

  const angles = lCB.map((step, index) => {
    let betaFactor = 1;
    if (outputAngle !== undefined) {
      if (outputAngle[index] - (Math.PI / 2 - thetaFrame) > Math.PI / 2) {
        betaFactor = -1;
      }
    }

    return {
      alpha: lawOfCosinesThreeSides({
        a: swingarmLength,
        b: step,
        c: seatStayLength as number,
      }),
      beta:
        betaFactor *
        lawOfCosinesThreeSides({
          a: lengthFrame,
          b: step,
          c: layoutValues.bellcrankB,
        }),
    };
  });
  
  const rearPivotPosition = angles.map((angle) => {
    const sumAngles = thetaFrame + angle.alpha + angle.beta;

    return {
      x:
        layoutValues.swingarmPivotX +
        swingarmLength * Math.cos(Math.PI - sumAngles),
      y:
        layoutValues.swingarmPivotY +
        swingarmLength * Math.sin(Math.PI - sumAngles),
    };
  });
  return rearPivotPosition;
};

export const calculateLengthOfLine = (a: Position, b: Position) => {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
};

// export const calculateAxlePath = (
//   layoutValues: DefaultValues,
//   shockSteps: number[],
//   swingarmLength: number,
//   shockPosition?: Position[],
//   outputAngle?: number[],
//   seatStayBellcrankPosition?: Position[],
//   seatStayLength?: number,
//   rearPivotPosition?: Position[]
// ) => {
//   if (shockPosition === undefined) {
//     shockPosition = calculateShockPosition(layoutValues, shockSteps);
//   }
//   if (outputAngle === undefined) {
//     outputAngle = calculateOutputAngle(layoutValues, shockSteps, shockPosition);
//   }
//   if (seatStayBellcrankPosition === undefined) {
//     seatStayBellcrankPosition = calculateSeatStayBellcrankPivot(
//       layoutValues,
//       shockSteps,
//       shockPosition,
//       outputAngle
//     );
//   }
//   if (seatStayLength === undefined) {
//     seatStayLength = calculateSeatStayLength(
//       layoutValues,
//       shockSteps,
//       shockPosition,
//       outputAngle
//     );
//   }
//   if (rearPivotPosition === undefined) {
//     rearPivotPosition = calculateRearPivot(
//       layoutValues,
//       shockSteps,
//       swingarmLength,
//       shockPosition,
//       outputAngle,
//       seatStayBellcrankPosition,
//       seatStayLength
//     );
//   }

//   const lengthToAxle = calculateLengthOfLine(
//     { x: layoutValues.swingarmPivotX, y: layoutValues.swingarmPivotY },
//     {
//       x:
//         rearPivotPosition[rearPivotPosition.length - 1].x +
//         layoutValues.axleOffsetX,
//       y: layoutValues.bbDrop,
//     }
//   );
//   const thetaInSwingarm = lawOfCosinesThreeSides({
//     a: swingarmLength,
//     b: lengthToAxle,
//     c: Math.sqrt(layoutValues.axleOffsetX ** 2 + layoutValues.axleOffsetY ** 2),
//   });
//   const axlePosition = rearPivotPosition.map((point) => {
//     const alpha = Math.atan(
//       (point.y - layoutValues.swingarmPivotY) /
//         (point.x - layoutValues.swingarmPivotX)
//     );
//     const totalAngle = alpha - thetaInSwingarm;

//     return {
//       x: layoutValues.swingarmPivotX + lengthToAxle * Math.cos(totalAngle),
//       y: layoutValues.swingarmPivotY + lengthToAxle * Math.sin(totalAngle),
//     };
//   });

//   return axlePosition;
// };
