let ctx = document.getElementById('chart').getContext('2d');

let chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ['Alcohol', 'Acidity', 'Sulphates'],
        datasets: [{
            label: 'Wine Profile',
            data: [10, 0.5, 0.6],
            backgroundColor: '#f87171'
        }]
    }
});

function update() {

    let alcohol = parseFloat(document.getElementById("alcohol").value);
    let va = parseFloat(document.getElementById("va").value);
    let sulphates = parseFloat(document.getElementById("sulphates").value);

    chart.data.datasets[0].data = [alcohol, va, sulphates];
    chart.update();

    let score = 0;

    if (alcohol > 11) score += 2;
    if (sulphates > 0.6) score += 1;
    if (va > 0.8) score -= 2;

    let result = "";

    if (score >= 2) {
        result = "🍷 High Quality";
    } else if (score >= 0) {
        result = "🍇 Medium Quality";
    } else {
        result = "⚠️ Low Quality";
    }

    document.getElementById("result").innerHTML = result;
}

update();
