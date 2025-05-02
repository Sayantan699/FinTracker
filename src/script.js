document.getElementById('assetForm').addEventListener('submit', function(e) {
  e.preventDefault();

  const form = e.target;
  const crypto = form.crypto.value;
  const price = parseFloat(form.price.value);
  const amount = parseFloat(form.amount.value);
  const currentPrice = mockPrice(crypto);

  const cost = (price * amount).toFixed(2);
  const value = (currentPrice * amount).toFixed(2);
  const pl = (((value - cost) / cost) * 100).toFixed(1);

  // Create and append table row
  const row = document.createElement('tr');
  row.innerHTML = `
    <td>${crypto}</td>
    <td>${amount}</td>
    <td>$${cost}</td>
    <td>$${currentPrice}</td>
    <td>$${value}</td>
    <td class="${pl >= 0 ? 'positive' : 'negative'}">${pl}%</td>
  `;
  document.getElementById('assetTable').appendChild(row);

  // Save to localStorage for use in insights page
  const storedAssets = JSON.parse(localStorage.getItem('userAssets')) || [];
  const newAsset = {
    symbol: crypto,
    amount: amount,
    price: currentPrice,
    entry: price,
    change: getMockChange(), // Optional for insights recommendation
  };
  storedAssets.push(newAsset);
  localStorage.setItem('userAssets', JSON.stringify(storedAssets));

  // Reset form
  form.reset();
});

// Fake price generator
function mockPrice(symbol) {
  const basePrices = {
    BTC: 3235.87,
    ETH: 3506.18,
    ENB: 177.54,
    XRP: 1024.48,
    ADA: 3.2057
  };
  return basePrices[symbol] || 100;
}

// Optional: generate a mock 24h change value for insights
function getMockChange() {
  return (Math.random() * 10 - 5).toFixed(2); // random -5% to +5%
}
