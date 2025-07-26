import React, { useEffect, useState } from "react";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from "chart.js";
import axios from "axios";

ChartJS.register(ArcElement, Tooltip, Legend);

function CategoryChart() {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [{
      label: "Jumlah Aset",
      data: [],
      backgroundColor: [
        "#0d6efd",
        "#198754",
        "#ffc107",
        "#dc3545",
        "#6f42c1",
        "#20c997"
      ],
      borderColor: "#ffffff",
      borderWidth: 2,
    }]
  });

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await axios.get("http://localhost:5000/api/charts/category-chart");
        const labels = res.data.map(item => item.category_name);
        const values = res.data.map(item => item.total);
        setChartData(prev => ({
          ...prev,
          labels,
          datasets: [{ ...prev.datasets[0], data: values }]
        }));
      } catch (err) {
        console.error("Gagal mengambil data kategori aset:", err);
      }
    }
    fetchData();
  }, []);

  return <Pie data={chartData} />;
}

export default CategoryChart;