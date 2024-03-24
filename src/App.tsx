import { useEffect, useState } from "react";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import { Position } from "./data/draw";
import InputForm, { defaultValues, DefaultValues } from "./InputForm";
import LayoutList from "./LayoutList";
import ResultsWrapper from "./ResultsWrapper";

export interface Path {
  path: Position[];
  color: string;
  name: string;
}

export interface LayoutArray {
  title: string;
  layoutValues: DefaultValues;
  axlePath: Path;
  antiSquat: Path;
  leverageRatio: Path;
  chainGrowth: Path;
  id: number;
}

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [layoutValues, setLayoutValues] =
    useState<DefaultValues>(defaultValues);
  const [layoutArray, setLayoutArray] = useState<LayoutArray[]>([]);

  // TODO: Convert these to useReducer
  const [axlePath, setAxlePath] = useState<Position[]>([]);
  const [antiSquat, setAntiSquat] = useState<Position[]>([]);
  const [leverageRatio, setLeverageRatio] = useState<Position[]>([]);
  const [chainGrowth, setChainGrowth] = useState<Position[]>([]);


  const [updateFromList, setUpdateFromList] = useState<boolean>(false);

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
        layoutObject={{ layoutValues, axlePath, antiSquat, leverageRatio, chainGrowth }}
        onClose={() => setIsOpen(false)}
      />
      <div className="flex flex-row">
        <div>
          <ResultsWrapper
            layoutValues={layoutValues}
            layoutArray={layoutArray}
            axlePath={axlePath}
            setAxlePath={setAxlePath}
            antiSquat={antiSquat}
            setAntiSquat={setAntiSquat}
            leverageRatio={leverageRatio}
            setLeverageRatio={setLeverageRatio}
            chainGrowth={chainGrowth}
            setChainGrowth={setChainGrowth}
          />
          <InputForm
            setNewValues={setLayoutValues}
            setIsOpen={setIsOpen}
            layoutValues={layoutValues}
            updateFromList={updateFromList}
          />
        </div>
        <div>
          <h2 className="text-gray-100">Iterations</h2>
          <LayoutList
            layoutArray={layoutArray}
            setLayoutArray={setLayoutArray}
            setLayoutValues={setLayoutValues}
            setUpdateFromList={setUpdateFromList}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
