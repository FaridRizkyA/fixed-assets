import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function AssetsValueChart() {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      label: "Nilai Aset (juta)",
      data: [],
      backgroundColor: "#0d6efd"
    }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/charts/assets-value-chart");
        const labels = res.data.map(item => item.name);
        const values = res.data.map(item => parseFloat(item.value));
        setData(prev => ({
          ...prev,
          labels,
          datasets: [{ ...prev.datasets[0], data: values }]
        }));
      } catch (err) {
        console.error("Gagal ambil data bar chart:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <Bar
      data={data}
      options={{
        responsive: true,
        plugins: { legend: { display: true } },
        scales: {
          y: { beginAtZero: true }
        }
      }}
    />
  );
}

export default AssetsValueChart;