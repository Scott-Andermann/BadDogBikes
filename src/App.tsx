import { useEffect, useState } from "react";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import { Position } from "./data/draw";
import HumanInputs, { HumanInputProps } from "./HumanInputs";
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

const zeroOffset = { x: 500, y: 750 };

function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [layoutValues, setLayoutValues] =
    useState<DefaultValues>(defaultValues);
  const [layoutArray, setLayoutArray] = useState<LayoutArray[]>([]);
  const [humanInput, setHumanInput] = useState<HumanInputProps | undefined>(
    undefined
  );
  const [key, setKey] = useState(0);

  useEffect(() => {
    const storedLayouts = localStorage.getItem("BDBLayouts");

    if (storedLayouts !== null) {
      setLayoutArray(JSON.parse(storedLayouts));
    }
  }, []);

  // unmount and remount canvas component

  useEffect(() => {
    console.log("storing data");
    if (layoutArray.length !== 0) {
      localStorage.setItem("BDBLayouts", JSON.stringify(layoutArray));
    }
  }, [layoutArray]);

  console.log("humanInput: ", humanInput);

  return (
    <div>
      {/* <HumanInputs setHumanInput={setHumanInput}/> */}
      <div className="flex flex-row">
        {/* <ConfirmModal
          isOpen={isOpen}
          setLayoutArray={setLayoutArray}
          layoutObject={{
            layoutValues,
            axlePath,
          }}
          onClose={() => setIsOpen(false)}
        /> */}
        <div>
          <ResultsWrapper
            layoutValues={layoutValues}
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
