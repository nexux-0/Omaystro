import { qs } from "./utils.js";

export const initReviewsChart = ({ reviews }) => {
  const canvas = qs("#rating_chart");
  if (!canvas || !window.Chart || !reviews?.distribution) return;

  const dist = reviews.distribution;
  const labels = ["5★", "4★", "3★", "2★", "1★"];
  const values = [dist["5"] || 0, dist["4"] || 0, dist["3"] || 0, dist["2"] || 0, dist["1"] || 0];

  const ctx = canvas.getContext("2d");

  const gold = "rgba(201,162,39,0.9)";
  const glass = "rgba(255,255,255,0.12)";

  new window.Chart(ctx, {
    type: "bar",
    data: {
      labels,
      datasets: [
        {
          label: "Reviews",
          data: values,
          backgroundColor: [gold, gold, glass, glass, glass],
          borderColor: ["rgba(201,162,39,0.6)", "rgba(201,162,39,0.5)", "rgba(255,255,255,0.14)", "rgba(255,255,255,0.14)", "rgba(255,255,255,0.14)"],
          borderWidth: 1,
          borderRadius: 10
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { display: false },
        tooltip: {
          enabled: true,
          backgroundColor: "rgba(15,17,23,0.95)",
          titleColor: "rgba(232,221,196,0.95)",
          bodyColor: "rgba(255,255,255,0.85)",
          borderColor: "rgba(255,255,255,0.12)",
          borderWidth: 1
        }
      },
      scales: {
        x: {
          grid: { display: false },
          ticks: { color: "rgba(255,255,255,0.55)", font: { size: 11 } }
        },
        y: {
          grid: { color: "rgba(255,255,255,0.08)" },
          ticks: { color: "rgba(255,255,255,0.5)", font: { size: 11 } }
        }
      }
    }
  });
};
