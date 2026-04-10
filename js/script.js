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
  const ids = ["alcohol", "va", "sulphates", "citric", "ph", "sugar", "fixed_acidity", "chlorides"];
  const elements = ids.map((id) => document.getElementById(id));
  const resultEl = document.getElementById("result");
  const insightsEl = document.getElementById("insights");

  if (elements.some((el) => !el) || !resultEl || !insightsEl) return;

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
  let result = "";

  if (qualityScore >= 7) {
    result = "High Quality 🍷";
    document.body.style.background = "#052e16";
  } else if (qualityScore >= 5) {
    result = "Medium Quality 🍇";
    document.body.style.background = "#0b0f1a";
  } else {
    result = "Low Quality ⚠️";
    document.body.style.background = "#450a0a";
  }

  const confidence = (68 + Math.min(qualityScore * 3, 25)).toFixed(1);

  let insights = "";
  if (alcohol > 11) insights += "• Alcohol contributes positively.<br>";
  if (va > 0.8) insights += "• Volatile acidity is reducing score.<br>";
  if (sulphates > 0.6) insights += "• Sulphates support preservation profile.<br>";
  if (sugar > 10) insights += "• High residual sugar lowered score.<br>";
  if (ph > 3.8) insights += "• High pH may hurt stability.<br>";
  if (chlorides > 0.12) insights += "• Chlorides are elevated.<br>";
  if (!insights) insights = "• Parameters are currently balanced.";

  resultEl.innerHTML = `<h3>${result}</h3><p>Estimated Quality Score: ${qualityScore}</p><p>Confidence: ${confidence}%</p>`;
  insightsEl.innerHTML = `<h4>Insights</h4><p>${insights}</p>`;
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
});
