// FinTrackr JavaScript to simulate dynamic asset table data

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
  
    form.reset();
  });
  
  // Fake price generator to simulate price changes
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
  