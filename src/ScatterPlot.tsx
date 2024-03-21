import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors,
} from "chart.js";
import { Scatter } from "react-chartjs-2";
import { Position } from "./data/draw";
import { LayoutArray } from "./App";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Colors
);

interface ScatterChartProps {
  inputData: Position[];
  arrayInput: LayoutArray[];
  title: string;
  xLabel?: string;
  yLabel?: string;
}

const normalizeData = (dataArray: Position[]) => {
  const { x, y } = dataArray[dataArray.length - 1];
  return dataArray.map((point) => {
    return { x: point.x - x, y: point.y - y };
  });
};

const ScatterPlot = ({
  inputData,
  arrayInput,
  title,
}: ScatterChartProps) => {
  
  const data = {
    datasets: [
      {
        label: "Current Iteration",
        data: normalizeData(inputData),
        backgroundColor: "red",
      },
      ...arrayInput.map((input) => {
        return {
          label: input.title,
          data: normalizeData(input.axlePath.path),
          backgroundColor: input.axlePath.color,
        };
      }),
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: title,
      },
    },
  };

  return <Scatter options={options} data={data} />;
};

export default ScatterPlot;
