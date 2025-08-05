import React, { useEffect, useState } from "react";
import { Doughnut } from "react-chartjs-2";
import axios from "axios";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

function DisposalChart() {
  const [data, setData] = useState({
    labels: [],
    datasets: [{
      data: [],
      backgroundColor: ["#dc3545", "#ffc107", "#20c997"]
    }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get(import.meta.env.VITE_API_URL + "/api/charts/disposal-chart");
        const labels = res.data.map(item => item.type || "Tidak Diketahui");
        const values = res.data.map(item => item.total);
        setData(prev => ({
          ...prev,
          labels,
          datasets: [{ ...prev.datasets[0], data: values }]
        }));
      } catch (err) {
        console.error("Gagal ambil data donut chart:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <Doughnut
      data={data}
      options={{
        responsive: true,
        plugins: {
          legend: { position: "top" }
        }
      }}
    />
  );
}

export default DisposalChart;