import React from "react";
import { Bar, Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title,
} from "chart.js";

ChartJS.register(
  ArcElement,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
  Title
);

const InventoryAnalysis = ({ items }) => {
  const categoryCount = items.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + 1;
    return acc;
  }, {});

  const pieData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: "Number of Items by Category",
        data: Object.values(categoryCount),
        backgroundColor: [
          "rgba(255, 99, 132, 0.2)",
          "rgba(54, 162, 235, 0.2)",
          "rgba(255, 206, 86, 0.2)",
          "rgba(75, 192, 192, 0.2)",
          "rgba(153, 102, 255, 0.2)",
          "rgba(255, 159, 64, 0.2)",
        ],
        borderColor: [
          "rgba(255, 99, 132, 1)",
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(75, 192, 192, 1)",
          "rgba(153, 102, 255, 1)",
          "rgba(255, 159, 64, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const sortedItems = [...items].sort((a, b) => b.quantity - a.quantity);
  const topItems = sortedItems.slice(0, 5);

  const barData = {
    labels: topItems.map((item) => item.name),
    datasets: [
      {
        label: "Top 5 Items by Quantity",
        data: topItems.map((item) => item.quantity),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "rgba(75, 192, 192, 1)",
        borderWidth: 1,
      },
    ],
  };

  const leastStockedItems = [...items]
    .sort((a, b) => a.quantity - b.quantity)
    .slice(0, 5);

  const leastStockedData = {
    labels: leastStockedItems.map((item) => item.name),
    datasets: [
      {
        label: "Least Stocked Items",
        data: leastStockedItems.map((item) => item.quantity),
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        borderColor: "rgba(255, 99, 132, 1)",
        borderWidth: 1,
      },
    ],
  };

  const commonOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        callbacks: {
          label: function (tooltipItem) {
            return `Quantity: ${tooltipItem.raw}`;
          },
        },
      },
    },
  };

  return (
    <div className="inventory-analysis">
      <h2>Inventory Analysis</h2>
      <div className="summary">
        <p>
          <strong>Total Number of Items:</strong> {items.length}
        </p>
      </div>
      <div className="charts-container">
        <div id="pie-chart" className="chart-item">
          <h3>Inventory Overview by Category</h3>
          <Pie data={pieData} options={commonOptions} />
        </div>
        <div id="bar-chart" className="chart-item">
          <h3>Top 5 Items by Quantity</h3>
          <Bar data={barData} options={commonOptions} />
        </div>
        <div id="least-stocked-chart" className="chart-item">
          <h3>Least Stocked Items</h3>
          <Bar data={leastStockedData} options={commonOptions} />
        </div>
      </div>
    </div>
  );
};

export default InventoryAnalysis;
