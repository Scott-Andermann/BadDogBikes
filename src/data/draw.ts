import { HumanInputProps } from "../HumanInputs";
import { DefaultValues } from "../InputForm";

const seatTubeLength = 300;
export interface Position {
  x: number;
  y: number;
}

interface DrawFrameProps {
  ctx: CanvasRenderingContext2D;
  layoutValues: DefaultValues;
  zeroOffset: Position;
  humanInput: HumanInputProps | undefined;
}

interface DrawFrontTriangleProps extends DrawFrameProps {
  antiSquatHeight: number[];
  step: number;
  IFC: Position[];
  instantCenter: Position[];
}

interface DrawProps {
  ctx: CanvasRenderingContext2D;
  step?: number;
  direction?: number;
  bellcrankOffset: Position;
  zeroOffset: Position;
  layoutValues: DefaultValues;
  paused?: boolean;
  pausePosition?: string;
  humanInput?: HumanInputProps;
  antiSquatHeight?: number[];
  IFC?: Position[];
  instantCenter?: Position[];
  showConstruction?: boolean;
}

interface DrawShockProps extends DrawProps {
  shockPosition: Position[];
}

interface DrawBellcrankProps extends DrawProps {
  shockPosition: Position[];
  seatStayPosition: Position[];
}

interface DrawRearTriangleProps extends DrawProps {
  seatStayPosition: Position[];
  rearPivotPosition: Position[];
  axlePath: Position[];
}

type DrawMasterProps = DrawProps &
  DrawShockProps &
  DrawBellcrankProps &
  DrawRearTriangleProps;

export const draw = ({
  ctx,
  step = 0,
  direction = 1,
  shockPosition,
  seatStayPosition,
  rearPivotPosition,
  axlePath,
  bellcrankOffset,
  zeroOffset,
  layoutValues,
  paused = false,
  pausePosition = "",
  antiSquatHeight = [],
  IFC,
  instantCenter,
  showConstruction
}: // humanInput,
DrawMasterProps) => {
  if (paused) {
    step = shockPosition.length - 1;
    if (pausePosition === "top") {
      step = 0;
    }
  }
  if (step === shockPosition.length - 1) {
    direction = -1;
  }
  if (step === 0) {
    direction = 1;
  }

  ctx.clearRect(0, 0, 2400, 1200);


  drawFrontTriangle({
    ctx,
    layoutValues,
    zeroOffset,
    humanInput: undefined,
  });
  drawSeatTube({
    ctx,
    layoutValues,
    zeroOffset,
    humanInput: undefined,
  });
  // Bottom Bracket
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 1.5 * 25.4 / 2, 0, 2 * Math.PI);
  ctx.fill();
  ctx.fillStyle = "blue";

  if (showConstruction) {

  // Draw construction Lines
  // chainring
  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 136 / 2, 0, 2 * Math.PI);
  ctx.stroke();


  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, zeroOffset.y);
  ctx.lineTo(0, zeroOffset.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, zeroOffset.y - layoutValues.bbDrop);
  ctx.lineTo(0, zeroOffset.y - layoutValues.bbDrop);
  ctx.stroke();
  
  ctx.beginPath();
  ctx.arc(zeroOffset.x - axlePath[axlePath.length - 1].x, zeroOffset.y - axlePath[axlePath.length - 1].y, 208 / 2, 0, 2 * Math.PI);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    zeroOffset.x - layoutValues.bellcrankX,
    zeroOffset.y - layoutValues.bellcrankY,
    layoutValues.bellcrankB,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    zeroOffset.x - layoutValues.bellcrankX,
    zeroOffset.y - layoutValues.bellcrankY,
    layoutValues.bellcrankA,
    0,
    2 * Math.PI
  );
  ctx.stroke();
}


  ctx.lineWidth = 1;
  drawShock({
    ctx,
    shockPosition,
    layoutValues,
    bellcrankOffset,
    zeroOffset,
    step,
  });
  drawBellcrank({
    ctx,
    shockPosition,
    layoutValues,
    zeroOffset,
    bellcrankOffset,
    seatStayPosition,
    step,
  });
  drawRearTriangle({
    ctx,
    seatStayPosition,
    rearPivotPosition,
    axlePath,
    layoutValues,
    zeroOffset,
    bellcrankOffset,
    step,
  });


  
  if (IFC !== undefined && instantCenter !== undefined) {
    drawAntiSquat({
      ctx,
      layoutValues,
      zeroOffset,
      humanInput: undefined,
      antiSquatHeight,
      step,
      IFC,
      instantCenter,
    });
  }
  step += direction;
  if (!paused) {
    setTimeout(() => {
      draw({
        ctx,
        step,
        direction,
        layoutValues,
        zeroOffset,
        bellcrankOffset,
        shockPosition,
        seatStayPosition,
        rearPivotPosition,
        axlePath,
        antiSquatHeight,
        IFC,
        instantCenter,
        showConstruction,
        // humanInput,
      });
    }, 17);
  }
};

export const drawShock = ({
  ctx,
  shockPosition,
  layoutValues,
  bellcrankOffset,
  zeroOffset,
  step = 0,
}: DrawShockProps) => {
  // shock + bellcrank
  // draw shock shaft
  const shockMountPosition = {
    x: zeroOffset.x - layoutValues.shockMountX,
    y: zeroOffset.y - layoutValues.shockMountY,
  };
  const bellcrankPosition = {
    x: bellcrankOffset.x - shockPosition[step].x,
    y: bellcrankOffset.y - shockPosition[step].y,
  };

  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(shockMountPosition.x, shockMountPosition.y);
  ctx.lineTo(bellcrankPosition.x, bellcrankPosition.y);
  ctx.stroke();

  // draw shock body
  ctx.lineWidth = 30;
  ctx.lineCap = "square";
  const length = Math.sqrt(
    (bellcrankPosition.x - shockMountPosition.x) ** 2 +
      (bellcrankPosition.y - shockMountPosition.y) ** 2
  );
  const unitVector = {
    x: (bellcrankPosition.x - shockMountPosition.x) / length,
    y: (bellcrankPosition.y - shockMountPosition.y) / length,
  };
  ctx.beginPath();
  const shockOffset = 25;
  const shockDisplayLength = 75;
  ctx.moveTo(
    bellcrankPosition.x - unitVector.x * shockOffset,
    bellcrankPosition.y - unitVector.y * shockOffset
  );
  ctx.lineTo(
    bellcrankPosition.x - unitVector.x * shockDisplayLength,
    bellcrankPosition.y - unitVector.y * shockDisplayLength
  );
  ctx.stroke();

  ctx.lineCap = "round";
  ctx.lineWidth = 20;
  ctx.beginPath();
  ctx.moveTo(bellcrankPosition.x, bellcrankPosition.y);
  ctx.lineTo(
    bellcrankPosition.x - unitVector.x * shockDisplayLength,
    bellcrankPosition.y - unitVector.y * shockDisplayLength
  );
  ctx.stroke();

  ctx.lineWidth = 1;
};

export const drawBellcrank = ({
  ctx,
  shockPosition,
  layoutValues,
  bellcrankOffset,
  zeroOffset,
  seatStayPosition,
  step = 0,
}: DrawBellcrankProps) => {
  // bellcrank
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.beginPath();
  ctx.moveTo(
    zeroOffset.x - layoutValues.bellcrankX,
    zeroOffset.y - layoutValues.bellcrankY
  );
  ctx.lineTo(
    bellcrankOffset.x - shockPosition[step].x,
    bellcrankOffset.y - shockPosition[step].y
  );
  ctx.lineTo(
    zeroOffset.x - seatStayPosition[step].x,
    zeroOffset.y - seatStayPosition[step].y
  );
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  ctx.lineWidth = 1;
};

export const drawRearTriangle = ({
  ctx,
  seatStayPosition,
  rearPivotPosition,
  axlePath,
  layoutValues,
  zeroOffset,
  step = 0,
}: DrawRearTriangleProps) => {
  ctx.lineWidth = 10;
  ctx.strokeStyle = "purple";
  ctx.fillStyle = "purple";
  ctx.beginPath();
  ctx.moveTo(
    zeroOffset.x - layoutValues.swingarmPivotX,
    zeroOffset.y - layoutValues.swingarmPivotY
  );
  ctx.lineTo(
    zeroOffset.x - rearPivotPosition[step].x,
    zeroOffset.y - rearPivotPosition[step].y
  );
  if (layoutValues.layoutType === "singlePivot") {
    ctx.lineTo(
      zeroOffset.x - axlePath[step].x,
      zeroOffset.y - axlePath[step].y
    );
    ctx.closePath();
  }
  ctx.stroke();
  ctx.fill();
  ctx.fillStyle = "black";

  ctx.beginPath();
  ctx.moveTo(
    zeroOffset.x - rearPivotPosition[step].x,
    zeroOffset.y - rearPivotPosition[step].y
  );
  ctx.lineTo(
    zeroOffset.x - seatStayPosition[step].x,
    zeroOffset.y - seatStayPosition[step].y
  );
  if (layoutValues.layoutType === "horst") {
    ctx.lineTo(
      zeroOffset.x - axlePath[step].x,
      zeroOffset.y - axlePath[step].y
    );
    ctx.closePath();
  }
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 30;
  ctx.beginPath();
  // Rear Wheel
  const rearWheelSize = layoutValues.wheelLayout === "29er" ? 29 : 27.5
  if (layoutValues.layoutType === "singlePivot") {
    ctx.arc(
      zeroOffset.x - axlePath[step].x,
      zeroOffset.y - axlePath[step].y,
      (rearWheelSize / 2) * 25.4 - 15,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }
  if (layoutValues.layoutType === "horst") {
    ctx.arc(
      zeroOffset.x - axlePath[step].x,
      zeroOffset.y - axlePath[step].y,
      (rearWheelSize / 2) * 25.4 - 15,
      0,
      2 * Math.PI
    );
    ctx.stroke();
  }

  ctx.lineWidth = 1;
};

export const drawSeatTube = ({
  ctx,
  layoutValues,
  zeroOffset,
}: // humanInput,
DrawFrameProps) => {
  // if (humanInput !== undefined) {
  //   // draw CG
  //   const hipLengthFromBB = humanInput.humanInseam - humanInput.crankLength + 45; // const for ankle flexion and pedal stack height
  //   ctx.beginPath();
  //   ctx.arc(
  //     zeroOffset.x - hipLengthFromBB * Math.cos(layoutValues.seatTubeAngle * Math.PI / 180),
  //     zeroOffset.y - hipLengthFromBB * Math.sin(layoutValues.seatTubeAngle * Math.PI / 180), 40, 0, Math.PI * 2
  //   );
  //   ctx.fillStyle = "red"
  //   ctx.fill();
  //   ctx.fillStyle = "black";
  // }
  ctx.lineWidth = 30;
  ctx.lineCap = "round";
  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, zeroOffset.y);
  ctx.lineTo(
    zeroOffset.x - 450 * Math.cos((layoutValues.seatTubeAngle * Math.PI) / 180),
    zeroOffset.y - 450 * Math.sin((layoutValues.seatTubeAngle * Math.PI) / 180)
  );
  ctx.stroke();
  ctx.lineWidth = 1;
};

const drawFrontTriangle = ({
  ctx,
  layoutValues,
  zeroOffset,
}: DrawFrameProps) => {
  ctx.lineWidth = 10;
  ctx.lineCap = "round";
  ctx.beginPath();
  const seatTubeAngle = (layoutValues.seatTubeAngle * Math.PI) / 180;
  const headTubeAngle = (layoutValues.headTubeAngle * Math.PI) / 180;
  const frontEndOffset = layoutValues.wheelLayout === "mullet" ? 0.75 * 25.4 : 0;

  const bottomOfHeadTube = {
    x:
      zeroOffset.x +
      layoutValues.reach +
      layoutValues.headTubeLength * Math.cos(headTubeAngle),
    y:
      zeroOffset.y -
      layoutValues.bbDrop -
      layoutValues.forkLength * Math.sin(headTubeAngle) +
      layoutValues.forkOffset * Math.cos(headTubeAngle) - frontEndOffset,
  };
  ctx.moveTo(
    zeroOffset.x - layoutValues.topTubeHeight * Math.cos(seatTubeAngle),
    zeroOffset.y - layoutValues.topTubeHeight * Math.sin(seatTubeAngle)
  );

  ctx.lineTo(
    zeroOffset.x + layoutValues.reach,
    bottomOfHeadTube.y - layoutValues.headTubeLength * Math.sin(headTubeAngle) - frontEndOffset
  );
  ctx.lineTo(bottomOfHeadTube.x, bottomOfHeadTube.y - frontEndOffset);
  ctx.lineTo(zeroOffset.x, zeroOffset.y);
  ctx.lineWidth = 50;
  ctx.strokeStyle = "#061826";
  ctx.stroke();

  // Draw Fork
  ctx.lineWidth = 20;
  ctx.strokeStyle = "orange";
  ctx.beginPath();
  ctx.moveTo(bottomOfHeadTube.x, bottomOfHeadTube.y - frontEndOffset);
  ctx.lineTo(
    bottomOfHeadTube.x + layoutValues.forkLength * Math.cos(headTubeAngle),
    bottomOfHeadTube.y + layoutValues.forkLength * Math.sin(headTubeAngle) - frontEndOffset
  );
  const frontWheelSize = layoutValues.wheelLayout === "27" ? 27.5 : 29;

  const frontAxlePosition = {
    x:
      bottomOfHeadTube.x +
      layoutValues.forkLength * Math.cos(headTubeAngle) +
      layoutValues.forkOffset * Math.sin(headTubeAngle),
    y:
      bottomOfHeadTube.y +
      layoutValues.forkLength * Math.sin(headTubeAngle) -
      layoutValues.forkOffset * Math.cos(headTubeAngle) - frontEndOffset,
  };
  ctx.lineTo(frontAxlePosition.x, frontAxlePosition.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(
    frontAxlePosition.x,
    frontAxlePosition.y,
    (frontWheelSize / 2) * 25.4 - 15,
    0,
    2 * Math.PI
  );
  ctx.lineWidth = 30;
  ctx.strokeStyle = "black";
  ctx.stroke();

  ctx.lineWidth = 1;
};

const drawAntiSquat = ({
  ctx,
  layoutValues,
  zeroOffset,
  antiSquatHeight,
  step,
  IFC,
  instantCenter,
}: DrawFrontTriangleProps) => {
  const headTubeAngle = (layoutValues.headTubeAngle * Math.PI) / 180;
  const bottomOfHeadTube = {
    x:
      zeroOffset.x +
      layoutValues.reach +
      layoutValues.headTubeLength * Math.cos(headTubeAngle),
    y:
      zeroOffset.y -
      layoutValues.bbDrop -
      layoutValues.forkLength * Math.sin(headTubeAngle) +
      layoutValues.forkOffset * Math.cos(headTubeAngle),
  };

  const frontAxlePosition = {
    x:
      bottomOfHeadTube.x +
      layoutValues.forkLength * Math.cos(headTubeAngle) +
      layoutValues.forkOffset * Math.sin(headTubeAngle),
    y:
      bottomOfHeadTube.y +
      layoutValues.forkLength * Math.sin(headTubeAngle) -
      layoutValues.forkOffset * Math.cos(headTubeAngle),
  };

  ctx.beginPath();
  ctx.moveTo(zeroOffset.x - IFC[step].x, zeroOffset.y - IFC[step].y);
  ctx.lineTo(frontAxlePosition.x, frontAxlePosition.y - antiSquatHeight[step]);
  ctx.stroke();

  // draw CG height
  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, 80);
  ctx.lineTo(1600, 80);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(
    frontAxlePosition.x,
    frontAxlePosition.y - antiSquatHeight[step],
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();

  ctx.beginPath();
  ctx.arc(
    zeroOffset.x - instantCenter[step].x,
    zeroOffset.y - instantCenter[step].y,
    5,
    0,
    Math.PI * 2
  );
  ctx.fill();
};

export default draw;
