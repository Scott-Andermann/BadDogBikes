import { useEffect, useRef, useState } from "react";
import "./App.css";
import Canvas from "./Canvas";
import ConfirmModal from "./ConfirmModal";
import { Position } from "./data/draw";
import {
  calculateOutputAngle,
  calculateSeatStayBellcrankPivot,
  calculateShockPosition,
  createShockSteps,
  calculateRearPivot,
  calculateSeatStayLength,
  calculateSwingarmLength,
  calculateAxlePath,
} from "./data/fourBarCalculations";
import InputForm, { defaultValues, DefaultValues } from "./InputForm";
import ScatterPlot from "./ScatterPlot";

export interface AxlePaths {
  path: Position[];
  title: string;
  color: string;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [layoutValues, setLayoutValues] =
    useState<DefaultValues>(defaultValues);
  const [layoutArray, setLayoutArray] = useState<DefaultValues[]>([
    defaultValues,
  ]);
  const [axlePaths, setAxlePaths] = useState<AxlePaths[]>([]);
  const [key, setKey] = useState(0);
  const zeroOffset = { x: 500, y: 500 };

  const bellcrankOffset = {
    x: zeroOffset.x - layoutValues.bellcrankX,
    y: zeroOffset.y - layoutValues.bellcrankY,
  };

  // unmount and remount canvas component
  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [layoutValues]);

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
  console.log("swingarm length: ", swingarmLength);

  const rearPivotPosition = calculateRearPivot(
    layoutValues,
    shockSteps,
    swingarmLength,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength
  );

  const axlePath = calculateAxlePath(
    layoutValues,
    shockSteps,
    swingarmLength,
    shockPosition,
    outputAngle,
    seatStayPosition,
    seatStayLength
  );

  const handleSaveLayout = () => {
    // setLayoutArray((prev) => [...prev, layoutValues]);
    console.log(rearPivotPosition[0]);
    console.log(axlePaths[0]);

    // setAxlePaths((prev) => [...prev, rearPivotPosition]);
  };

  return (
    <div>
      <div className="flex flex-row">
        <InputForm setNewValues={setLayoutValues} setIsOpen={setIsOpen} />
        <ConfirmModal
          isOpen={isOpen}
          setAxlePaths={setAxlePaths}
          rearPivotPosition={rearPivotPosition}
          onClose={() => setIsOpen(false)}
        />
        <div>
          <Canvas
            key={key}
            shockPosition={shockPosition}
            seatStayPosition={seatStayPosition}
            rearPivotPosition={rearPivotPosition}
            axlePath={axlePath}
            bellcrankOffset={bellcrankOffset}
            zeroOffset={zeroOffset}
            layoutValues={layoutValues}
          />
          <ScatterPlot
            inputData={rearPivotPosition}
            arrayInput={axlePaths}
            title="Axle Path"
          />
        </div>
      </div>
    </div>
  );
}

export default App;
