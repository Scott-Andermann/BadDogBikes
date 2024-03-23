import { useEffect, useState } from "react";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import { Position } from "./data/draw";
import InputForm, { defaultValues, DefaultValues } from "./InputForm";
import LayoutList from "./LayoutList";
import ResultsWrapper from "./ResultsWrapper";

export interface AxlePaths {
  path: Position[];
  color: string;
}

export interface LayoutArray {
  title: string;
  layoutValues: DefaultValues;
  axlePath: AxlePaths;
  id: number;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [layoutValues, setLayoutValues] =
    useState<DefaultValues>(defaultValues);
  const [layoutArray, setLayoutArray] = useState<LayoutArray[]>([]);
  const [axlePath, setAxlePath] = useState<Position[]>([]);

  useEffect(() => {
    const storedLayouts = localStorage.getItem("BDBLayouts");

    if (storedLayouts !== null) {
      setLayoutArray(JSON.parse(storedLayouts));
    }
  }, []);

  useEffect(() => {
    if (layoutArray.length !== 0) {
      localStorage.setItem("BDBLayouts", JSON.stringify(layoutArray));
    }
  }, [layoutArray]);

  return (
    <div>
      <ConfirmModal
        isOpen={isOpen}
        setLayoutArray={setLayoutArray}
        layoutObject={{ layoutValues, axlePath }}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex flex-row">
        <div>
          <ResultsWrapper
            layoutValues={layoutValues}
            layoutArray={layoutArray}
            axlePath={axlePath}
            setAxlePath={setAxlePath}
          />
          <InputForm
            setNewValues={setLayoutValues}
            setIsOpen={setIsOpen}
            layoutValues={layoutValues}
          />
        </div>
        <div>
          <h2 className="text-gray-100">Iterations</h2>
          <LayoutList
            layoutArray={layoutArray}
            setLayoutArray={setLayoutArray}
            setLayoutValues={setLayoutValues}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
