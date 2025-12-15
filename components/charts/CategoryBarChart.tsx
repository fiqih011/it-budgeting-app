"use client";

import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function CategoryBarChart({
  data,
}: {
  data: { name: string; amount: number }[];
}) {
  return (
    <Bar
      data={{
        labels: data.map((d) => d.name),
        datasets: [
          {
            label: "Budget Amount",
            data: data.map((d) => d.amount),
          },
        ],
      }}
    />
  );
}
