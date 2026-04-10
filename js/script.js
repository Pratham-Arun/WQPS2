let ctx = document.getElementById('chart');
let chart;

if (ctx) {
  chart = new Chart(ctx.getContext('2d'), {
      type: 'bar',
      data: {
          labels: ['Alcohol', 'Acidity', 'Sulphates'],
          datasets: [{
              label: 'Wine Profile',
              data: [10.5, 0.5, 0.6],
              backgroundColor: '#f87171'
          }]
      }
  });
}

function update() {
    let alcohol = parseFloat(document.getElementById("alcohol").value);
    let va = parseFloat(document.getElementById("va").value);
    let sulphates = parseFloat(document.getElementById("sulphates").value);
    let chlorides = parseFloat(document.getElementById("chlorides").value);
    let citric = parseFloat(document.getElementById("citric").value);
    let ph = parseFloat(document.getElementById("ph").value);

    if (chart) {
      chart.data.datasets[0].data = [alcohol, va, sulphates];
      chart.update();
    }

    let score = 0;

    score += (alcohol - 10) * 1.5;
    score -= (va * 2);
    score += (sulphates * 1.2);
    score -= (chlorides * 5);
    score += (citric * 0.5);

    let qualityScore = Math.max(3, Math.min(8, 5 + score / 3));

    let result = "";
    if (qualityScore >= 7) {
        result = "High Quality Wine 🍷";
    } else if (qualityScore >= 5) {
        result = "Medium Quality Wine 🍇";
    } else {
        result = "Low Quality Wine ⚠️";
    }

    let insights = "";
    if(alcohol > 11){
        insights += "✔ Alcohol strongly improves wine quality<br>";
    }
    if(va > 0.8){
        insights += "⚠ High volatile acidity damages wine quality<br>";
    }
    if(sulphates > 0.6){
        insights += "✔ Sulphates improve stability and quality<br>";
    }
    if(ph > 3.8 || ph < 3.1){
        insights += "⚠ pH and acidity balance can affect taste and stability<br>";
    }

    document.getElementById("result").innerHTML = `
      <h3>${result}</h3>
      <p>Estimated Score: ${qualityScore.toFixed(1)} / 10</p>
      <h4>Insights</h4>
      <p>${insights || 'Balanced profile with moderate predicted quality.'}</p>
    `;
}

if (document.getElementById("chart")) {
  update();
}
