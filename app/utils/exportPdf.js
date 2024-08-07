// utils/exportPdf.js

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import html2canvas from "html2canvas";

export const exportToPDF = async (items) => {
  const doc = new jsPDF();

  // Create table headers and data
  const headers = ["Name", "Category", "Quantity"];
  const data = items.map((item) => [item.name, item.category, item.quantity]);

  // Add table to PDF
  autoTable(doc, {
    head: [headers],
    body: data,
    startY: 20,
  });

  // Capture and add charts to PDF
  const chartIds = ["pie-chart", "bar-chart", "least-stocked-chart"]; // IDs of chart elements
  for (const chartId of chartIds) {
    const chartElement = document.getElementById(chartId);
    if (chartElement) {
      const canvas = await html2canvas(chartElement);
      const imgData = canvas.toDataURL("image/png");
      doc.addPage();
      doc.addImage(imgData, "PNG", 10, 10, 180, 100);
    }
  }

  // Save the PDF
  doc.save("inventory_report.pdf");
};
