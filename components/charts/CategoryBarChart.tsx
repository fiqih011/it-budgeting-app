"use client";

import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function CategoryBarChart({ data }: any) {
  const labels = Object.keys(data);
  const values = Object.values(data);

  const chartData = {
    labels,
    datasets: [
      {
        label: "Budget per Category",
        data: values,
        backgroundColor: "#10b981",
      },
    ],
  };

  return <Bar data={chartData} />;
}
