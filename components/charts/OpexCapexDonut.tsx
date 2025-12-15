"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

export default function OpexCapexDonut({
  opex,
  capex,
}: {
  opex: number;
  capex: number;
}) {
  const data = {
    labels: ["OPEX", "CAPEX"],
    datasets: [
      {
        data: [opex, capex],
      },
    ],
  };

  return <Doughnut data={data} />;
}
