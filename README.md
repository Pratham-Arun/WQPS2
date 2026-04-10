# 🍷 Wine Quality Prediction System

[![GitHub Stars](https://img.shields.io/github/stars/Pratham-Arun/WQPS2?style=glass&color=f87171)](https://github.com/Pratham-Arun/WQPS2)
[![License: MIT](https://img.shields.io/badge/License-MIT-orange.svg?style=glass)](https://opensource.org/licenses/MIT)

A premium, research-driven data science platform designed to analyze the chemical signatures of wine and predict quality scores using machine learning insights.

---

## 📽️ Preview
The platform features a **Cinematic Glassmorphism UI** with custom CSS art, interactive radar charts, and a real-time simulation engine.

- **Dynamic Landing Page**: Featuring custom CSS-art wine glass animation.
- **11-Parameter Explorer**: Tune every chemical variable from the UCI dataset.
- **ML Notebook Integration**: Direct visibility into the XGBoost-powered analysis.

---

## 🚀 Key Features

### ⚗️ Smart Explorer
Adjust all **11 chemical parameters** derived from the original UCI research dataset:
- Fixed Acidity, Volatile Acidity, Citric Acid, Residual Sugar, Chlorides, Free SO₂, Total SO₂, Density, pH, Sulphates, and Alcohol.
- **Red/White Toggle**: Swaps prediction logic between wine varieties.
- **🏆 Reset to Good**: Instantly apply a high-quality chemical profile benchmark.

### 📊 Data Visualizations
- **Radar Charts**: Real-time representation of the wine's chemical "fingerprint".
- **Statistical Results**: Correlation heatmaps and feature importance bars based on XGBoost model training.

### 📓 Educational Notebook
Browse the complete Machine Learning workflow—from data cleaning and Exploratory Data Analysis (EDA) to model evaluation—directly in the browser without external dependencies.

---

## 🧪 Scientific Context
This platform is based on the **UCI Machine Learning Repository: Wine Quality Dataset**, which includes 6,497 samples. Key research findings incorporated into our logic:
- **Alcohol**: Positive correlation (+0.44) with quality.
- **Volatile Acidity**: Negative impact; high levels relate to vinegar-like off-flavors.
- **Density**: Lower density often indicates higher alcohol extraction and better quality.

---

## 🛠️ Technology Stack
- **Frontend**: Vanilla HTML5, CSS3 (Custom Design System with Glassmorphism).
- **Control Logic**: Vanilla JavaScript (Standardized 0–10 scoring engine).
- **Visuals**: [Chart.js](https://www.chartjs.org/) for interactive data representation.
- **Data Source**: UCI Machine Learning Repository (Red/White Wine).

---

## 🏁 Getting Started

### Local Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/Pratham-Arun/WQPS2.git
   ```
2. Open `index.html` in any modern browser.
3. For the best experience (including asset loading), serve using a local server:
   ```bash
   npx http-server .
   ```

---

## 📄 License
Distributed under the MIT License. See `LICENSE` for more information.
