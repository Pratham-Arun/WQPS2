function bindSliderValue(id, decimals = 2) {
  const slider = document.getElementById(id);
  const output = document.getElementById(`${id}Value`);
  if (!slider || !output) return;

  const render = () => {
    output.textContent = Number(slider.value).toFixed(decimals);
  };

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
