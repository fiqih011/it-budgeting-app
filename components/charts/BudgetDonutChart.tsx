"use client";
import { Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function BudgetDonutChart({ opex, capex }: any) {
  const data = {
    labels: ["OPEX", "CAPEX"],
    datasets: [
      {
        data: [opex, capex],
        backgroundColor: ["#2563eb", "#f59e0b"],
      },
    ],
  };

  return <Pie data={data} />;
}
