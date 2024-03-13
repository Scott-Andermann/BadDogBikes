import { DefaultValues } from "../InputForm";

export interface Position {
  x: number;
  y: number;
}

interface DrawProps {
  ctx: CanvasRenderingContext2D;
  step?: number;
  direction?: number;
  bellcrankOffset: Position;
  zeroOffset: Position;
  layoutValues: DefaultValues;
  paused?: boolean;
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
}: DrawMasterProps) => {
  if (paused) {
    step = shockPosition.length - 1;
  }
  if (step === shockPosition.length - 1) {
    direction = -1;
  }
  if (step === 0) {
    direction = 1;
  }
  ctx.clearRect(0, 0, 800, 800);
  ctx.fillStyle = "red";
  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 10, 0, 2 * Math.PI);
  ctx.fill();

  ctx.fillStyle = "blue";
  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 6, 0, 2 * Math.PI);
  ctx.fill();

  // Draw construction Lines
  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, zeroOffset.y);
  ctx.lineTo(0, zeroOffset.y);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(zeroOffset.x, zeroOffset.y - 20);
  ctx.lineTo(0, zeroOffset.y - 20);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(zeroOffset.x, zeroOffset.y, 450, 0, 2 * Math.PI)
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
  ctx.beginPath();
  ctx.moveTo(
    zeroOffset.x - layoutValues.swingarmPivotX,
    zeroOffset.y - layoutValues.swingarmPivotY
  );
  ctx.lineTo(
    zeroOffset.x - rearPivotPosition[step].x,
    zeroOffset.y - rearPivotPosition[step].y
  );
  ctx.lineTo(
    zeroOffset.x - axlePath[step].x,
    zeroOffset.y - axlePath[step].y
  )
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  
  ctx.moveTo(
    zeroOffset.x - rearPivotPosition[step].x,
    zeroOffset.y - rearPivotPosition[step].y
  );
  ctx.lineTo(
    zeroOffset.x - seatStayPosition[step].x,
    zeroOffset.y - seatStayPosition[step].y
  );
  ctx.strokeStyle = "green";
  ctx.stroke();
  ctx.strokeStyle = "black";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(
    zeroOffset.x - layoutValues.swingarmPivotX,
    zeroOffset.y - layoutValues.swingarmPivotY,
    450,
    0,
    2 * Math.PI
  );
  ctx.stroke();
  ctx.strokeStyle = "black";

  // max end of travel
  ctx.beginPath();
  ctx.arc(
    zeroOffset.x - rearPivotPosition[rearPivotPosition.length - 1].x,
    zeroOffset.y - rearPivotPosition[rearPivotPosition.length - 1].y,
    10,
    0,
    2 * Math.PI
  );
  ctx.fill();
  ctx.strokeStyle = "black";

  ctx.lineWidth = 1;
};

export default draw;
