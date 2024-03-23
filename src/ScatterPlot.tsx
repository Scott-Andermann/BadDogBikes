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
import { Path } from "./App";

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
  arrayInput: Path[];
  title: string;
  normalize?: boolean;
  travelOnXaxis?: boolean;
  xLabel?: string;
  yLabel?: string;
}

const normalizeData = (dataArray: Position[], travelOnXaxis: boolean, normalize: boolean) => {
  if (!normalize) {
    return dataArray;
  }
  if (travelOnXaxis) {
    const x = dataArray[dataArray.length - 1].x;
    return dataArray.map((point) => {
      return {x: point.x - x, y: point.y}
    })
  }
  const { x, y } = dataArray[dataArray.length - 1];
  return dataArray.map((point) => {
    return { x: point.x - x, y: point.y - y };
  });
};

const 
ScatterPlot = ({
  inputData,
  arrayInput,
  title,
  normalize = true,
  travelOnXaxis = false,
}: ScatterChartProps) => {

  
  const data = {
    datasets: [
      {
        label: "Current Iteration",
        data: normalizeData(inputData, travelOnXaxis, normalize),
        backgroundColor: "red",
      },
      ...arrayInput.map((input) => {
        return {
          label: input.name,
          data: normalizeData(input.path, travelOnXaxis, normalize),
          backgroundColor: input.color,
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
