import { useState } from 'react';
import { HexColorPicker } from 'react-colorful';
import { LayoutArray } from './App';
import { DefaultValues } from './InputForm';
import { Button, Popover } from 'flowbite-react';

interface LayoutListProps {
  layoutArray: LayoutArray[];
  setLayoutArray: React.Dispatch<React.SetStateAction<LayoutArray[]>>;
  setLayoutValues: React.Dispatch<
    React.SetStateAction<DefaultValues>
  >;
  setUpdateFromList: React.Dispatch<React.SetStateAction<boolean>>;
}

const LayoutList = ({
  layoutArray,
  setLayoutArray,
  setLayoutValues,
  setUpdateFromList,
}: LayoutListProps) => {
  const [color, setColor] = useState('#aabbcc');
  const removeLayout = (id: number) => {
    setLayoutArray((prev) =>
      prev.filter((layout) => layout.id !== id)
    );
  };

  const resetLayouts = () => {
    setLayoutArray([]);
    localStorage.setItem('BDBLayouts', JSON.stringify([]));
  };

  const updateLayout = (layoutValues: DefaultValues) => {
    setLayoutValues(layoutValues);
    setUpdateFromList((prev) => !prev);
  };

  const bodyStyles = 'px-6 py-4';
  const headingStyles = 'px-6 py-4';

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg m-4">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
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
              Color
            </th>
            <th scope="col" className={headingStyles}></th>
            <th scope="col" className={headingStyles}></th>
          </tr>
        </thead>
        <tbody>
          {Array.isArray(layoutArray) && layoutArray.length > 0
            ? layoutArray.map((layout) => {
                const travel =
                  layout.axlePath.path[0].y -
                  layout.axlePath.path[
                    layout.axlePath.path.length - 1
                  ].y;
                const antiSquat = layout.antiSquat.path[43].y;
                const progressiveness =
                  layout.leverageRatio.path[
                    layout.leverageRatio.path.length - 1
                  ].y - layout.leverageRatio.path[0].y;
                return (
                  <tr
                    className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
                    key={layout.id}
                  >
                    <th
                      scope="row"
                      className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {layout.title}
                    </th>
                    <td className={bodyStyles}>
                      {Math.round(travel)}
                    </td>
                    <td className={bodyStyles}>
                      {Math.round(antiSquat * 1000) / 10}
                    </td>
                    <td className={bodyStyles}>
                      {Math.round(progressiveness * 1000) / 10}
                    </td>
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
                                Popover title
                              </h3>
                            </div>
                            <div className="px-3 py-2">
                              <p>
                                And here's some amazing content. It's
                                very engaging. Right?
                              </p>
                            </div>
                          </div>
                        }
                      >
                        <Button>Default popover</Button>
                      </Popover>
                    </td>
                    <td className={bodyStyles}>
                      <button
                        onClick={() =>
                          updateLayout(layout.layoutValues)
                        }
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
                  </tr>
                );
              })
            : null}
        </tbody>
      </table>

      <button
        onClick={resetLayouts}
        className="bg-green-400 p-2 rounded-sm"
      >
        Delete All Layouts
      </button>
    </div>
  );
};

export default LayoutList;
