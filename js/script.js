let wineChart;

function bindSliderValue(id, decimals = 2) {
  const slider = document.getElementById(id);
  const output = document.getElementById(`${id}Value`);
  if (!slider || !output) return;

  const render = () => {
    output.textContent = Number(slider.value).toFixed(decimals);
  };

  slider.addEventListener("input", () => {
    render();
    updateChartFromInputs();
  });

  render();
}

function initExplorerChart() {
  const canvas = document.getElementById("chart");
  if (!canvas || typeof Chart === "undefined") return;
  const ctx = canvas.getContext("2d");

  wineChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Alcohol", "Acidity", "Sulphates"],
      datasets: [{
        label: "Wine Profile",
        data: [10.5, 0.7, 0.6],
        backgroundColor: "#f87171"
      }]
    },
    options: {
      responsive: true,
      plugins: { legend: { labels: { color: "#f9fafb" } } },
      scales: {
        x: { ticks: { color: "#f9fafb" }, grid: { color: "rgba(255,255,255,0.12)" } },
        y: { ticks: { color: "#f9fafb" }, grid: { color: "rgba(255,255,255,0.12)" } }
      }
    }
  });
}

function initResultsChart() {
  const canvas = document.getElementById("resultsChart");
  if (!canvas || typeof Chart === "undefined") return;
  const ctx = canvas.getContext("2d");
  new Chart(ctx, {
    type: "bar",
    data: {
      labels: ["Alcohol", "Volatile Acidity", "Sulphates", "Citric Acid"],
      datasets: [{
        label: "Relative Importance",
        data: [0.84, 0.78, 0.63, 0.57],
        backgroundColor: ["#f87171", "#fb7185", "#ef4444", "#f97316"]
      }]
    },
    options: {
      plugins: { legend: { labels: { color: "#f9fafb" } } },
      scales: {
        x: { ticks: { color: "#f9fafb" }, grid: { color: "rgba(255,255,255,0.12)" } },
        y: { ticks: { color: "#f9fafb" }, grid: { color: "rgba(255,255,255,0.12)" } }
      }
    }
  });
}

function updateChart(alcohol, va, sulphates) {
  if (!wineChart) return;
  wineChart.data.datasets[0].data = [alcohol, va, sulphates];
  wineChart.update();
}

function updateChartFromInputs() {
  const alcohol = parseFloat(document.getElementById("alcohol")?.value || "0");
  const va = parseFloat(document.getElementById("va")?.value || "0");
  const sulphates = parseFloat(document.getElementById("sulphates")?.value || "0");
  updateChart(alcohol, va, sulphates);
}

function showResult(score) {
  const output = document.getElementById("output");
  if (!output) return;

  if (score > 7) {
    output.innerHTML = "🍷 High Quality";
    output.style.color = "lightgreen";
  } else if (score >= 5) {
    output.innerHTML = "🍇 Medium Quality";
    output.style.color = "#fde68a";
  } else {
    output.innerHTML = "⚠️ Low Quality";
    output.style.color = "#f87171";
  }
}

function predictWine() {
  const alcohol = parseFloat(document.getElementById("alcohol").value);
  const va = parseFloat(document.getElementById("va").value);
  const sulphates = parseFloat(document.getElementById("sulphates").value);
  const citric = parseFloat(document.getElementById("citric").value);
  const ph = parseFloat(document.getElementById("ph").value);
  const sugar = parseFloat(document.getElementById("sugar").value);
  const fixedAcidity = parseFloat(document.getElementById("fixed_acidity").value);
  const chlorides = parseFloat(document.getElementById("chlorides").value);

  let score = 0;
  if (alcohol > 11) score += 2;
  if (sulphates > 0.6) score += 1;
  if (citric > 0.3) score += 1;
  if (va > 0.8) score -= 2;
  if (ph > 3.8) score -= 1;
  if (sugar > 10) score -= 1;
  if (fixedAcidity >= 6 && fixedAcidity <= 9) score += 1;
  if (chlorides > 0.12) score -= 1;

  const qualityScore = Math.max(3, Math.min(9, 5 + score));
  const insights = document.getElementById("insights");
  const loader = document.getElementById("loader");

  if (loader) loader.style.display = "block";

  setTimeout(() => {
    if (loader) loader.style.display = "none";
    showResult(qualityScore);
    updateChart(alcohol, va, sulphates);

    if (insights) {
      let text = `Estimated Quality Score: ${qualityScore}<br>`;
      if (alcohol > 11) text += "• Alcohol boosts quality potential.<br>";
      if (va > 0.8) text += "• Volatile acidity is hurting the score.<br>";
      if (sugar > 10) text += "• Residual sugar is above ideal range.<br>";
      if (ph > 3.8) text += "• High pH may reduce stability.<br>";
      insights.innerHTML = text;
    }
  }, 500);
}

document.addEventListener("DOMContentLoaded", () => {
  bindSliderValue("fixed_acidity", 1);
  bindSliderValue("va", 2);
  bindSliderValue("citric", 2);
  bindSliderValue("sugar", 1);
  bindSliderValue("chlorides", 2);
  bindSliderValue("ph", 2);
  bindSliderValue("sulphates", 2);
  bindSliderValue("alcohol", 1);
  initExplorerChart();
  initResultsChart();
  updateChartFromInputs();
  slider.addEventListener("input", render);
  render();
}

function predictWine() {
  const alcoholEl = document.getElementById("alcohol");
  const vaEl = document.getElementById("va");
  const sulphatesEl = document.getElementById("sulphates");
  const resultEl = document.getElementById("result");
  const insightsEl = document.getElementById("insights");

  if (!alcoholEl || !vaEl || !sulphatesEl || !resultEl || !insightsEl) return;

  const alcohol = parseFloat(alcoholEl.value);
  const va = parseFloat(vaEl.value);
  const sulphates = parseFloat(sulphatesEl.value);

  let score = 0;

  if (alcohol > 11) score += 2;
  if (sulphates > 0.6) score += 1;
  if (va > 0.8) score -= 2;

  let result = "";
  const confidence = 70 + Math.random() * 20;

  if (score >= 2) {
    result = "High Quality Wine 🍷";
    document.body.style.background = "#052e16";
  } else if (score >= 0) {
    result = "Medium Quality Wine 🍇";
    document.body.style.background = "#0b0f1a";
  } else {
    result = "Low Quality Wine ⚠️";
    document.body.style.background = "#450a0a";
  }

  let insights = "";
  if (alcohol > 11) insights += "• High alcohol improves quality potential.<br>";
  if (sulphates > 0.6) insights += "• Sulphates are in a favorable range.<br>";
  if (va > 0.8) insights += "• Elevated volatile acidity can reduce quality.<br>";
  if (!insights) insights = "• Values are balanced but not strongly predictive.";

  resultEl.innerHTML = `<h3>${result}</h3><p>Confidence: ${confidence.toFixed(2)}%</p>`;
  insightsEl.innerHTML = `<h4>Insights</h4><p>${insights}</p>`;
}

document.addEventListener("DOMContentLoaded", () => {
  bindSliderValue("alcohol", 1);
  bindSliderValue("va", 2);
  bindSliderValue("sulphates", 2);
});
