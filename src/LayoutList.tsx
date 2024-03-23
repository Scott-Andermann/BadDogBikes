import { LayoutArray } from "./App";
import { DefaultValues } from "./InputForm";

interface LayoutListProps {
  layoutArray: LayoutArray[];
  setLayoutArray: React.Dispatch<React.SetStateAction<LayoutArray[]>>
  setLayoutValues: React.Dispatch<React.SetStateAction<DefaultValues>>;
  setUpdateFromList: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutList = ({ layoutArray, setLayoutArray, setLayoutValues, setUpdateFromList }: LayoutListProps) => {

  const removeLayout = (id: number) => {
    console.log(id);
    
    setLayoutArray(prev => prev.filter(layout => layout.id !== id))
  }

  const resetLayouts = () => {
    setLayoutArray([]);
    localStorage.setItem("BDBLayouts", JSON.stringify([]));
  }

  const updateLayout = (layoutValues: DefaultValues) => {
    setLayoutValues(layoutValues);
    setUpdateFromList(prev => !prev);
  }
  
  return (
    <div className="flex flex-col gap-2 w-60 bg-gray-600">
      {Array.isArray(layoutArray) && layoutArray.length > 0
        ? layoutArray.map((layout) => {
            return (
              <div className="flex gap-4" key={layout.id}>
                <button
                  onClick={() => updateLayout(layout.layoutValues)}
                  className="p-2 bg-green-200 rounded-sm"
                >
                  <p className="text-xs">{layout.title}</p>
                </button>
                <button onClick={() => removeLayout(layout.id)}>
                <p className="text-xs">Delete</p>
                </button>
              </div>
            );
          })
        : null}
        <button onClick={resetLayouts} className="bg-green-400 p-2 rounded-sm">Delete All Layouts</button>
    </div>
  );
};

export default LayoutList;
