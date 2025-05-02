const assets = JSON.parse(localStorage.getItem("userAssets")) || [];

function getRecommendation(change, pl) {
  if (change < -5 || pl < -50) return { text: "Sell", class: "sell" };
  if (pl > 50 && change > 0) return { text: "Buy", class: "buy" };
  return { text: "Hold", class: "hold" };
}

function renderInsights(data) {
  const container = document.getElementById("insights-container");

  const portfolioValue = data.reduce((sum, asset) => sum + asset.price * asset.amount, 0).toFixed(2);

  const best = data.reduce((a, b) => a.change > b.change ? a : b);
  const worst = data.reduce((a, b) => a.change < b.change ? a : b);

  container.innerHTML = `
    <section class="overview">
      <div class="overview-box"><h2>Total Portfolio Value</h2><p>$${portfolioValue}</p></div>
      <div class="overview-box"><h2>24h Change</h2><p class="positive">+3.12%</p></div>
      <div class="overview-box"><h2>Best Performer</h2><p>${best.symbol}</p></div>
      <div class="overview-box"><h2>Worst Performer</h2><p>${worst.symbol}</p></div>
      <div class="overview-box"><h2>Portfolio Allocation</h2><canvas id="portfolioChart"></canvas></div>
    </section>

    <section class="insights">
      <h2>Asset Insights</h2>
      <table class="insights-table">
        <thead>
          <tr>
            <th>Asset</th>
            <th>Current Price</th>
            <th>Amount</th>
            <th>Value</th>
            <th>24h</th>
            <th>Entry</th>
            <th>P/L</th>
            <th>Recommend</th>
          </tr>
        </thead>
        <tbody>
          ${data.map(asset => {
            const value = asset.price * asset.amount;
            const pl = (asset.price - asset.entry) * asset.amount;
            const rec = getRecommendation(asset.change, pl);
            return `
              <tr>
                <td>${asset.symbol}</td>
                <td>$${asset.price.toFixed(2)}</td>
                <td>${asset.amount}</td>
                <td>$${value.toFixed(2)}</td>
                <td class="${asset.change >= 0 ? 'positive' : 'negative'}">${asset.change}%</td>
                <td>$${asset.entry.toFixed(2)}</td>
                <td class="${pl >= 0 ? 'positive' : 'negative'}">$${pl.toFixed(2)}</td>
                <td class="${rec.class}">${rec.text}</td>
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </section>
  `;

  renderChart(data);
}

function renderChart(data) {
  const ctx = document.getElementById("portfolioChart").getContext("2d");
  const chart = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels: data.map(a => a.symbol),
      datasets: [{
        data: data.map(a => (a.amount * a.price)),
        backgroundColor: ['#00e676', '#ff5252', '#2979ff', '#ffea00'],
      }]
    },
    options: {
      plugins: {
        legend: {
          labels: {
            color: "#fff"
          }
        }
      }
    }
  });
}

if (assets.length === 0) {
    document.getElementById("insights-container").innerHTML = "No assets added.";
  } else {
    renderInsights(assets); // your existing render logic
  }
  
