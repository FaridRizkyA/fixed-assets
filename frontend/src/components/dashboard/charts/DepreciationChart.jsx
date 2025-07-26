import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  PointElement,
  LinearScale,
  CategoryScale,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";

ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend);

function DepreciationChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Penyusutan Bulanan",
      data: [],
      borderColor: "#d93041ff",
      backgroundColor: "#f2bfc4ff",
      fill: true
    }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/api/charts/depreciation-chart");

        const monthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agu", "Sep", "Okt", "Nov", "Des"];
        const labels = res.data.map(item => {
          const month = parseInt(item.month.split("-")[1], 10);
          return monthNames[month - 1];
        });

        const values = res.data.map(item => Math.round(item.total));

        setChartData(prev => ({
          ...prev,
          labels,
          datasets: [{ ...prev.datasets[0], data: values }]
        }));
      } catch (err) {
        console.error("Gagal mengambil data penyusutan:", err);
      }
    }
    fetchData();
  }, []);

  return <Line data={chartData} />;
}

export default DepreciationChart;