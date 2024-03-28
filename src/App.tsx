import { useEffect, useState } from "react";
import "./App.css";
import ConfirmModal from "./ConfirmModal";
import { Position } from "./data/draw";
import InputForm, { defaultValues, DefaultValues } from "./InputForm";
import LayoutList from "./LayoutList";
import ResultsWrapper from "./ResultsWrapper";
import { DarkThemeToggle, Flowbite } from "flowbite-react";

export interface Path {
  path: Position[];
  name: string;
}

export interface LayoutArray {
  title: string;
  layoutValues: DefaultValues;
  axlePath: Path;
  antiSquat: Path;
  leverageRatio: Path;
  instantCenter: Path;
  chainGrowth: Path;
  color: string;
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
  const [instantCenter, setInstantCenter] = useState<Position[]>([]);

  const [updateFromList, setUpdateFromList] = useState<boolean>(false);

  const updateLayout = (id: number) => {
    setLayoutArray((prev) =>
      prev.map((layout) =>
        layout.id === id
          ? {
              ...layout,
              layoutValues: layoutValues,
              axlePath: { path: axlePath, name: layout.title },
              antiSquat: { path: antiSquat, name: layout.title },
              leverageRatio: {
                path: leverageRatio,
                name: layout.title,
              },
              chainGrowth: { path: chainGrowth, name: layout.title },
              instantCenter: { path: instantCenter, name: layout.title },
            }
          : layout
      )
    );
  };

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
    <Flowbite>
      <DarkThemeToggle />
      <ConfirmModal
        isOpen={isOpen}
        setLayoutArray={setLayoutArray}
        layoutObject={{
          layoutValues,
          axlePath,
          antiSquat,
          leverageRatio,
          chainGrowth,
          instantCenter,
        }}
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
            instantCenter={instantCenter}
            setInstantCenter={setInstantCenter}
          />
          <LayoutList
            layoutArray={layoutArray}
            setLayoutArray={setLayoutArray}
            setLayoutValues={setLayoutValues}
            setUpdateFromList={setUpdateFromList}
            updateLayout={updateLayout}
          />
        </div>
        <div>
          <InputForm
            setNewValues={setLayoutValues}
            setIsOpen={setIsOpen}
            layoutValues={layoutValues}
            updateFromList={updateFromList}
          />
        </div>
      </div>
    </Flowbite>
  );
}

export default App;
