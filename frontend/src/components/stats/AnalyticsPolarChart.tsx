import { PolarArea } from "react-chartjs-2";
import {
  Chart as ChartJS,
  RadialLinearScale,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Box } from "@mui/material";

ChartJS.register(RadialLinearScale, ArcElement, Tooltip, Legend);

const AnalyticsPolarChart = () => {
  const data = {
    labels: [
      "Resume Analyzer",
      "Interview Prep",
      "Document Chat",
      "AI Agent",
      "Code Generator",
      "Todo App",
      "Game",
    ],
    datasets: [
      {
        label: "Usage Analytics",
        data: [12, 19, 8, 15, 10, 6, 5], // dynamic values later
        backgroundColor: [
          "#ef5350", // red
          "#26a69a", // green
          "#ffca28", // yellow
          "#90a4ae", // grey
          "#42a5f5", // blue
          "#ab47bc", // purple
          "#ffa726", // orange
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "top" as const,
      },
    },
    scales: {
      r: {
        ticks: {
          display: false,
        },
      },
    },
  };

  return (
    <Box
      sx={{
        mt: 4,
        height: "600px",
        width: "100%",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <PolarArea data={data} options={options} />
    </Box>
  );
};

export default AnalyticsPolarChart;
