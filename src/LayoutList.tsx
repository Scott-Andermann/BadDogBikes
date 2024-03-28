import { useEffect, useRef, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { LayoutArray } from "./App";
import { DefaultValues } from "./InputForm";
import { Button, Popover } from "flowbite-react";
import GeometryTable from "./GeometryTable";

interface LayoutListProps {
  layoutArray: LayoutArray[];
  setLayoutArray: React.Dispatch<React.SetStateAction<LayoutArray[]>>;
  setLayoutValues: React.Dispatch<React.SetStateAction<DefaultValues>>;
  setUpdateFromList: React.Dispatch<React.SetStateAction<boolean>>;
  updateLayout: (id: number) => void;
}

const LayoutList = ({
  layoutArray,
  setLayoutArray,
  setLayoutValues,
  setUpdateFromList,
  updateLayout,
}: LayoutListProps) => {
  const [showInput, setShowInput] = useState<number | null>(null);
  const [newName, setNewName] = useState<string>("");
  const refs = useRef<HTMLInputElement[]>([]);

  const setRef = (index: number) => (element: HTMLInputElement | null) => {
    if (element) {
      refs.current[index] = element;
    }
  };

  const removeLayout = (id: number) => {
    setLayoutArray((prev) => prev.filter((layout) => layout.id !== id));
  };

  const resetLayouts = () => {
    setLayoutArray([]);
    localStorage.setItem("BDBLayouts", JSON.stringify([]));
  };

  const updateActiveLayout = (layoutValues: DefaultValues) => {
    setLayoutValues(layoutValues);
    setUpdateFromList((prev) => !prev);
  };

  const updateColor = (e: string, id: number) => {
    setLayoutArray((prev) =>
      prev.map((layout) =>
        layout.id === id ? { ...layout, color: e } : layout
      )
    );
  };

  const rename = (id: number) => {
    setLayoutArray((prev) =>
      prev.map((layout) =>
        layout.id === id ? { ...layout, title: newName } : layout
      )
    );
    setNewName("");
    setShowInput(null);
  };

  const openAndFocus = (id: number, title: string) => {
    setShowInput(id);
    setNewName(title);
    console.log(refs.current[id]);
  };

  useEffect(() => {
    if (showInput === null) return;
    if (refs.current[showInput]) {
      refs.current[showInput].focus();
    }
  }, [showInput]);

  const wheelbase = (layout: DefaultValues) => {
    const headTubeAngle = (layout.headTubeAngle * Math.PI) / 180;
    return (
      layout.reach +
      layout.headTubeLength * Math.cos(headTubeAngle) +
      layout.forkLength * Math.cos(headTubeAngle) +
      Math.cos(Math.asin(layout.bbDrop / layout.chainStay)) * layout.chainStay
    );
  };

  const bodyStyles = "px-6 py-4";
  const headingStyles = "px-6 py-4";

  return (
    <div className="relative shadow-md rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400 sm:rounded-lg">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400 sm:rounded-lg overflow-hidden">
          <tr className="rounded-lg">
            <th scope="col" className={headingStyles}></th>
            <th scope="col" className={headingStyles}>
              Name
            </th>
            <th scope="col" className={headingStyles}>
              Travel
            </th>
            <th scope="col" className={headingStyles}>
              Anti Squat @ 28% Sag
            </th>
            <th scope="col" className={headingStyles}>
              Progressiveness
            </th>
            <th scope="col" className={headingStyles}>
              Wheelbase
            </th>
            <th scope="col" className={headingStyles}>
              Stack Height
            </th>
            <th scope="col" className={headingStyles}></th>
            <th scope="col" className={headingStyles}></th>
            <th scope="col" className={headingStyles}></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(layoutArray) && layoutArray.length > 0
            ? layoutArray.map((layout) => {
                const travel =
                  layout.axlePath.path[0].y -
                  layout.axlePath.path[layout.axlePath.path.length - 1].y;
                const antiSquat = layout.antiSquat.path[43].y;
                const progressiveness =
                  (layout.leverageRatio.path[
                    layout.leverageRatio.path.length - 1
                  ].y -
                    layout.leverageRatio.path[0].y) /
                  layout.leverageRatio.path[
                    layout.leverageRatio.path.length - 1
                  ].y;
                return (
                  <tr
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={layout.id}
                  >
                    <td className={`relative ${bodyStyles}`}>
                      <Popover
                        aria-labelledby="default-popover"
                        content={
                          <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                            <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                              <h3
                                id="default-popover"
                                className="font-semibold text-gray-900 dark:text-white"
                              >
                                Choose Color
                              </h3>
                            </div>
                            <div className="px-3 py-2">
                              <HexColorPicker
                                color={layout.color}
                                onChange={(e) => updateColor(e, layout.id)}
                              />
                            </div>
                          </div>
                        }
                      >
                        <Button pill style={{ backgroundColor: layout.color }}>
                          {""}
                        </Button>
                      </Popover>
                    </td>
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      <input
                        ref={setRef(layout.id)}
                        className={`text-black ${
                          showInput === layout.id ? "block" : "hidden"
                        }`}
                        onBlur={() => rename(layout.id)}
                        value={newName}
                        onChange={(e) => setNewName(e.target.value)}
                      />
                      <div
                        data-showInput={showInput === layout.id}
                        className={`${
                          showInput === layout.id ? "hidden" : "flex"
                        } flex-row justify-between gap-1`}
                      >
                        <p>{layout.title}</p>
                        <button
                          onClick={() => openAndFocus(layout.id, layout.title)}
                        >
                          <svg
                            className="w-3"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                          >
                            <path d="M6.41421 15.89L16.5563 5.74785L15.1421 4.33363L5 14.4758V15.89H6.41421ZM7.24264 17.89H3V13.6473L14.435 2.21231C14.8256 1.82179 15.4587 1.82179 15.8492 2.21231L18.6777 5.04074C19.0682 5.43126 19.0682 6.06443 18.6777 6.45495L7.24264 17.89ZM3 19.89H21V21.89H3V19.89Z"></path>
                          </svg>
                        </button>
                      </div>
                    </th>
                    <td className={bodyStyles}>{Math.round(travel)}</td>
                    <td className={bodyStyles}>
                      {Math.round(antiSquat * 1000) / 10}
                    </td>
                    <td className={bodyStyles}>
                      {Math.round(progressiveness * 1000) / 10}
                    </td>
                    <td className={bodyStyles}>
                      {Math.round(wheelbase(layout.layoutValues))}
                    </td>
                    <td>
                      <Popover
                        aria-labelledby="default-popover"
                        content={
                          <div className="w-64 text-sm text-gray-500 dark:text-gray-400">
                            <div className="border-b border-gray-200 bg-gray-100 px-3 py-2 dark:border-gray-600 dark:bg-gray-700">
                              <h3
                                id="default-popover"
                                className="font-semibold text-gray-900 dark:text-white"
                              >
                                Geometry
                              </h3>
                            </div>
                            <div className="px-3 py-2">
                              <GeometryTable
                                layoutValues={layout.layoutValues}
                                wheelbase={wheelbase(layout.layoutValues)}
                              />
                            </div>
                          </div>
                        }
                      >
                        <Button>Geometry</Button>
                      </Popover>
                    </td>
                    <td className={bodyStyles}>
                      <button
                        onClick={() => updateActiveLayout(layout.layoutValues)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        View
                      </button>
                    </td>
                    <td className={bodyStyles}>
                      <button
                        onClick={() => removeLayout(layout.id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Delete
                      </button>
                    </td>
                    <td className={bodyStyles}>
                      <button
                        onClick={() => updateLayout(layout.id)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                      >
                        Update
                      </button>
                    </td>
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>

      <button onClick={resetLayouts} className="bg-green-400 p-2 rounded-sm">
        Delete All Layouts
      </button>
    </div>
  );
};

export default LayoutList;
