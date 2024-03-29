import { DefaultValues } from "../InputForm";
import { Position } from "./draw";
import {
  calculateInstantCenter,
  intersectionOfTwoLines,
} from "./fourBarCalculations";

const rChainRing = 128 / 2;
const rCassette = 208 / 2; // 50T

export const calculateIFC = (
  layoutValues: DefaultValues,
  axlePath: Position[]
) => {
  const IFC = axlePath.map((point) => {
    const alpha = Math.atan(point.y / point.x);
    // these are not the tangent points but they should be close enough without more complicated calculations
    const chainRingContact = {
      x: rChainRing * Math.sin(alpha),
      y: rChainRing * Math.cos(alpha),
    };
    const cassetteContact = {
      x: point.x - rCassette * Math.sin(alpha),
      y: point.y + rCassette * Math.cos(alpha),
    };
    const instantForceCenter = intersectionOfTwoLines({
      pointA: chainRingContact,
      pointB: cassetteContact,
      pointC: point,
      pointD: {
        x: layoutValues.swingarmPivotX,
        y: layoutValues.swingarmPivotY,
      },
    });

    return instantForceCenter;
  });
  return IFC;
};

export const calculateAntiSquatLine = (
  // centerOfGravity: Position,
  axlePath: Position[],
  layoutValues: DefaultValues
) => {
  const instantForceCenter = calculateIFC(layoutValues, axlePath);
  const headTubeAngle = (layoutValues.headTubeAngle * Math.PI) / 180;
  const wheelbase =
    layoutValues.reach +
    layoutValues.headTubeLength * Math.cos(headTubeAngle) +
    layoutValues.forkLength * Math.cos(headTubeAngle) +
    Math.cos(Math.asin(layoutValues.bbDrop / layoutValues.chainStay)) *
      layoutValues.chainStay;
  const rTire =
    layoutValues.wheelLayout === "29er" ? (29 * 25.4) / 2 : (27.5 * 25.4) / 2;

  const antiSquatHeight = axlePath.map((point, index) => {
    const rearContactPatch = { x: point.x, y: point.y - rTire };
    const frontAxlePositionX = wheelbase - point.x; // without fork travel

    const slope =
      (-instantForceCenter[index].y + rearContactPatch.y) /
      (instantForceCenter[index].x - rearContactPatch.x);
    const intercept = rearContactPatch.y + slope * rearContactPatch.x;

    const height = slope * frontAxlePositionX + intercept;
    return height;
  });

  return antiSquatHeight;
};

export const calculateAntiSquat = (
  centerOfGravity: Position,
  antiSquatHeight: number[]
) => {
  const antiSquat = antiSquatHeight.map((height) => {
    return height / centerOfGravity.y;
  });

  return antiSquat;
};

export const calculateAntiRiseLine = (
  axlePath: Position[],
  layoutValues: DefaultValues,
  rearPivotPosition: Position[],
  seatStayPosition: Position[]
) => {
  const instantCenter = calculateInstantCenter(
    layoutValues,
    rearPivotPosition,
    seatStayPosition
  );
  const headTubeAngle = (layoutValues.headTubeAngle * Math.PI) / 180;
  const wheelbase =
    layoutValues.reach +
    layoutValues.headTubeLength * Math.cos(headTubeAngle) +
    layoutValues.forkLength * Math.cos(headTubeAngle) +
    Math.cos(Math.asin(layoutValues.bbDrop / layoutValues.chainStay)) *
      layoutValues.chainStay;
  const rTire =
    layoutValues.wheelLayout === "29er" ? (29 * 25.4) / 2 : (27.5 * 25.4) / 2;
  const antiRiseHeight = axlePath.map((point, index) => {
    const rearContactPatch = { x: point.x, y: point.y - rTire };
    const frontAxlePositionX = wheelbase - point.x; // without fork travel
    const slope =
      (-instantCenter[index].y + rearContactPatch.y) /
      (instantCenter[index].x - rearContactPatch.x);
    const intercept = rearContactPatch.y + slope * rearContactPatch.x;
    const height = slope * frontAxlePositionX + intercept;
    return height;
  });
  return antiRiseHeight;
};
