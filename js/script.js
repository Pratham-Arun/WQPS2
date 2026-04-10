/* ═══════════════════════════════════════════════════════════════
   Wine Quality Prediction System — script.js
   ═══════════════════════════════════════════════════════════════ */

/* ─── Chart.js Global Config ─── */
if (typeof Chart !== 'undefined') {
  Chart.defaults.color = '#9ca3af';
  Chart.defaults.font.family = "'Poppins', sans-serif";
  Chart.defaults.plugins.legend.labels.usePointStyle = true;
}

/* ─── Slider → Value Binding ─── */
function bindSlider(id, spanId, decimals) {
  const slider = document.getElementById(id);
  const span = document.getElementById(spanId);
  if (!slider || !span) return;

  const update = () => {
    span.textContent = Number(slider.value).toFixed(decimals);
    updateExplorerChart();
  };

  slider.addEventListener('input', update);
  update();
}

/* ─── Wine Type Selection ─── */
function setWineType(type) {
  document.getElementById('wineType').value = type;
  
  // Toggle button classes
  document.getElementById('typeRed').classList.toggle('active', type === 'red');
  document.getElementById('typeWhite').classList.toggle('active', type === 'white');
  
  predictWine();
}

/* ─── Reset to Good Profile ─── */
function resetToGoodQuality() {
  const goodProfile = {
    alcohol: 12.5,
    va: 0.35,
    sulphates: 0.75,
    citric: 0.45,
    ph: 3.25,
    fixedAcidity: 8.5,
    sugar: 2.0,
    chlorides: 0.05,
    freeSO2: 30,
    totalSO2: 120,
    density: 0.994
  };

  for (const [id, val] of Object.entries(goodProfile)) {
    const slider = document.getElementById(id);
    if (slider) {
      slider.value = val;
      // Trigger update manually for each
      const spanId = id + 'Val';
      const span = document.getElementById(spanId);
      if (span) {
          // Some IDs have different span mapping in HTML (va -> vaVal, citric -> citricVal)
          // Actually I standardized them mostly. Let's check.
          span.textContent = val.toFixed(slider.step.includes('.') ? slider.step.split('.')[1].length : 0);
      }
    }
  }
  
  // Custom fix for span decimals based on standard usage
  document.getElementById('vaVal').textContent = "0.35";
  document.getElementById('phVal').textContent = "3.25";
  document.getElementById('chloridesVal').textContent = "0.050";
  document.getElementById('densityVal').textContent = "0.9940";
  
  predictWine();
}

/* ═══════════════════════════════════════
   EXPLORER — Radar Chart
   ═══════════════════════════════════════ */
let explorerChart = null;

function initExplorerChart() {
  const canvas = document.getElementById('explorerChart');
  if (!canvas || typeof Chart === 'undefined') return;

  explorerChart = new Chart(canvas.getContext('2d'), {
    type: 'radar',
    data: {
      labels: [
        'Alcohol', 'Vol. Acidity', 'Sulphates', 'Citric Acid',
        'pH', 'Fixed Acid.', 'Sugar', 'Chlorides',
        'Free SO₂', 'Total SO₂', 'Density'
      ],
      datasets: [{
        label: 'Wine Profile',
        data: [10.5, 0.5, 0.65, 0.3, 3.3, 7.4, 2.5, 0.08, 15, 46, 0.996],
        backgroundColor: 'rgba(248, 113, 113, 0.12)',
        borderColor: '#f87171',
        borderWidth: 2,
        pointBackgroundColor: '#f87171',
        pointRadius: 4
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        r: {
          beginAtZero: true,
          grid: { color: 'rgba(255,255,255,0.06)' },
          angleLines: { color: 'rgba(255,255,255,0.06)' },
          pointLabels: { color: '#d1d5db', font: { size: 10 } },
          ticks: { display: false }
        }
      },
      plugins: { legend: { display: false } }
    }
  });
}

function updateExplorerChart() {
  if (!explorerChart) return;

  // Normalize all values to roughly 0-10 range for radar display
  const v = (id, fallback) => parseFloat(document.getElementById(id)?.value || fallback);

  explorerChart.data.datasets[0].data = [
    v('alcohol', 10.5),
    v('va', 0.5) * 10,           // scale 0-2 → 0-20
    v('sulphates', 0.65) * 10,   // scale 0-2 → 0-20
    v('citric', 0.3) * 10,       // scale 0-1 → 0-10
    v('ph', 3.3),
    v('fixedAcidity', 7.4),
    v('sugar', 2.5),
    v('chlorides', 0.08) * 100,  // scale 0-0.2 → 0-20
    v('freeSO2', 15) / 5,        // scale 1-72 → 0-14
    v('totalSO2', 46) / 20,      // scale 6-289 → 0-14
    v('density', 0.996) * 100 - 99 // scale 0.99-1.00 → 0-10
  ];
  explorerChart.update('none');
}

/* ═══════════════════════════════════════
   EXPLORER — Prediction Logic (11 params)
   ═══════════════════════════════════════ */
function predictWine() {
  const v = id => parseFloat(document.getElementById(id).value);

  const alcohol      = v('alcohol');
  const va           = v('va');
  const sulphates    = v('sulphates');
  const citric       = v('citric');
  const ph           = v('ph');
  const fixedAcidity = v('fixedAcidity');
  const sugar        = v('sugar');
  const chlorides    = v('chlorides');
  const freeSO2      = v('freeSO2');
  const totalSO2     = v('totalSO2');
  const density      = v('density');
  const wineType     = document.getElementById('wineType').value;

  // Research-based scoring using all features
  let score = 0;

  // Type-specific adjustments
  if (wineType === 'white') {
    // White wines often have higher SO2
    if (totalSO2 > 100 && totalSO2 < 200) score += 0.3;
    if (va < 0.3) score += 0.2;
  } else {
    // Red wines
    if (va < 0.5) score += 0.2;
    if (sulphates > 0.6) score += 0.2;
  }

  // Strong positive: alcohol
  score += (alcohol - 10) * 1.5;

  // Positive: sulphates, citric acid
  score += sulphates * 1.2;
  score += citric * 0.5;

  // Negative: volatile acidity (strongest negative)
  score -= va * 2;

  // Moderate negative: pH
  score -= (ph - 3.3) * 0.8;

  // Fixed acidity sweet spot (6-9)
  if (fixedAcidity >= 6 && fixedAcidity <= 9) score += 0.3;

  // High sugar penalty
  if (sugar > 8) score -= 0.5;

  // High chlorides penalty
  if (chlorides > 0.1) score -= 0.5;

  // Free SO2 — moderate levels are good
  if (freeSO2 >= 10 && freeSO2 <= 40) score += 0.3;

  // Very high total SO2 penalty
  if (totalSO2 > 150) score -= 0.5;

  // Density — lower = more alcohol = better
  score -= (density - 0.995) * 50;

  const quality = Math.max(0, Math.min(10, 5.5 + score / 3));

  // Tier
  let tier, emoji, color;
  if (quality >= 7) {
    tier = 'High Quality'; emoji = '🍷'; color = '#4ade80';
  } else if (quality >= 5) {
    tier = 'Medium Quality'; emoji = '🍇'; color = '#fde68a';
  } else {
    tier = 'Low Quality'; emoji = '⚠️'; color = '#f87171';
  }

  // Insights
  let insights = '';
  if (alcohol > 11)    insights += '✔ High alcohol strongly boosts quality potential.<br>';
  if (alcohol <= 9.5)  insights += '⚠ Low alcohol often correlates with lower scores.<br>';
  if (va > 0.8)        insights += '⚠ Elevated volatile acidity → vinegar-like off-flavors.<br>';
  if (va < 0.35)       insights += '✔ Low volatile acidity — clean, pleasant aroma.<br>';
  if (sulphates > 0.7) insights += '✔ Sulphates at favorable levels — good preservation.<br>';
  if (citric > 0.4)    insights += '✔ Good citric acid level — adds freshness.<br>';
  if (ph > 3.6)        insights += '⚠ High pH may reduce stability and shelf life.<br>';
  if (ph < 3.0)        insights += '⚠ Very low pH — may taste overly sharp.<br>';
  if (chlorides > 0.1) insights += '⚠ Elevated chlorides can add unwanted saltiness.<br>';
  if (sugar > 8)       insights += '⚠ High residual sugar — may indicate stuck fermentation.<br>';
  if (totalSO2 > 150)  insights += '⚠ Very high total SO₂ — can cause off-flavors.<br>';
  if (density < 0.993) insights += '✔ Low density indicates higher alcohol extraction.<br>';
  if (freeSO2 >= 10 && freeSO2 <= 40) insights += '✔ Free SO₂ in protective range.<br>';
  if (!insights)       insights = '• Chemical profile is balanced with moderate predicted quality.';

  // Render
  document.getElementById('result').innerHTML = `
    <h2 style="color:${color}; margin-bottom: 0.5rem;">${emoji} ${tier}</h2>
    <p style="color: #d1d5db; font-size: 1.1rem;">Estimated Score: <strong>${quality.toFixed(2)}</strong> / 10.0</p>
  `;

  document.getElementById('insights').innerHTML = `
    <h3 style="margin-top: 1rem;">Research Insights</h3>
    <p style="margin-top: 0.5rem; line-height: 2;">${insights}</p>
  `;

  updateExplorerChart();
}

/* ═══════════════════════════════════════
   RESULTS PAGE — Charts
   ═══════════════════════════════════════ */
function initResultsCharts() {
  const impCanvas = document.getElementById('importanceChart');
  if (impCanvas && typeof Chart !== 'undefined') {
    new Chart(impCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Alcohol', 'Density', 'Vol. Acidity', 'Chlorides', 'Citric Acid', 'Sulphates', 'pH', 'Fixed Acid.', 'Total SO₂', 'Free SO₂', 'Sugar'],
        datasets: [{
          label: 'Relative Importance',
          data: [0.84, 0.72, 0.68, 0.55, 0.52, 0.50, 0.42, 0.38, 0.35, 0.30, 0.22],
          backgroundColor: ['#f87171','#fb923c','#fbbf24','#a3e635','#4ade80','#2dd4bf','#38bdf8','#818cf8','#c084fc','#e879f9','#f472b6'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: 'y',
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { color: 'rgba(255,255,255,0.06)' }, max: 1.0 },
          y: { grid: { display: false } }
        }
      }
    });
  }

  const corrCanvas = document.getElementById('correlationChart');
  if (corrCanvas && typeof Chart !== 'undefined') {
    new Chart(corrCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['Alcohol', 'Sulphates', 'Citric Acid', 'Fixed Acid.', 'Free SO₂', 'Sugar', 'pH', 'Chlorides', 'Total SO₂', 'Vol. Acidity', 'Density'],
        datasets: [{
          label: 'Correlation (r)',
          data: [0.44, 0.04, 0.09, 0.07, 0.06, -0.04, -0.06, -0.20, -0.17, -0.27, -0.31],
          backgroundColor: function(ctx) {
            return ctx.raw >= 0 ? '#4ade80' : '#f87171';
          },
          borderRadius: 4
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, min: -0.4, max: 0.5 }
        }
      }
    });
  }

  const distCanvas = document.getElementById('distributionChart');
  if (distCanvas && typeof Chart !== 'undefined') {
    new Chart(distCanvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels: ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10'],
        datasets: [{
          label: 'Number of Wines',
          data: [0, 0, 0, 30, 216, 2138, 2836, 1079, 193, 5, 0],
          backgroundColor: ['#ef4444','#f97316','#eab308','#84cc16','#22c55e','#14b8a6','#06b6d4'],
          borderRadius: 6
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          x: { grid: { display: false }, title: { display: true, text: 'Quality Score', color: '#9ca3af' } },
          y: { grid: { color: 'rgba(255,255,255,0.06)' }, title: { display: true, text: 'Count', color: '#9ca3af' } }
        }
      }
    });
  }
}

/* ═══════════════════════════════════════
   INIT
   ═══════════════════════════════════════ */
document.addEventListener('DOMContentLoaded', () => {
  // Explorer sliders (all 11)
  bindSlider('fixedAcidity', 'fixedAcidityVal', 1);
  bindSlider('va', 'vaVal', 2);
  bindSlider('citric', 'citricVal', 2);
  bindSlider('sugar', 'sugarVal', 1);
  bindSlider('chlorides', 'chloridesVal', 3);
  bindSlider('freeSO2', 'freeSO2Val', 0);
  bindSlider('totalSO2', 'totalSO2Val', 0);
  bindSlider('density', 'densityVal', 4);
  bindSlider('ph', 'phVal', 2);
  bindSlider('sulphates', 'sulphatesVal', 2);
  bindSlider('alcohol', 'alcoholVal', 1);

  // Charts
  initExplorerChart();
  initResultsCharts();
});
