// DOM Elements
const balance = document.getElementById("balance");
const money_plus = document.getElementById("money-plus");
const money_minus = document.getElementById("money-minus");
const list = document.getElementById("list");
const form = document.getElementById("form");
const text = document.getElementById("text");
const amount = document.getElementById("amount");
const category = document.getElementById("category");
const pieChart = document.getElementById("pie-chart").getContext("2d");
const toggleTheme = document.getElementById("toggle-theme");

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];

// Add Transaction
form.addEventListener("submit", (e) => {
  e.preventDefault();

  if (text.value.trim() === "" || amount.value.trim() === "") {
    alert("Please add text and amount");
    return;
  }

  const transaction = {
    id: Date.now(),
    text: text.value,
    amount: +amount.value,
    category: category.value,
  };

  transactions.push(transaction);
  updateUI();
});

// Remove Transaction
function removeTransaction(id) {
  transactions = transactions.filter((t) => t.id !== id);
  updateUI();
}

// Update UI
function updateUI() {
  list.innerHTML = "";
  transactions.forEach((t) => {
    const sign = t.amount < 0 ? "-" : "+";
    const li = document.createElement("li");
    li.classList.add(t.amount < 0 ? "minus" : "plus");
    li.innerHTML = `${t.text} (${t.category}) <span>${sign}$${Math.abs(t.amount)}</span>
    <button class="delete-btn" onclick="removeTransaction(${t.id})">x</button>`;
    list.appendChild(li);
  });

  const total = transactions.reduce((acc, t) => acc + t.amount, 0);
  const income = transactions.filter(t => t.amount > 0).reduce((acc, t) => acc + t.amount, 0);
  const expense = transactions.filter(t => t.amount < 0).reduce((acc, t) => acc + t.amount, 0);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${Math.abs(expense)}`;

  localStorage.setItem("transactions", JSON.stringify(transactions));
  drawPieChart();
}

// Draw Pie Chart
function drawPieChart() {
  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + Math.abs(t.amount);
    return acc;
  }, {});

  const total = Object.values(categoryTotals).reduce((a, b) => a + b, 0);
  let startAngle = 0;

  pieChart.clearRect(0, 0, 400, 400);
  const colors = ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0"];

  Object.keys(categoryTotals).forEach((cat, i) => {
    const slice = (categoryTotals[cat] / total) * 2 * Math.PI;
    pieChart.beginPath();
    pieChart.moveTo(200, 200);
    pieChart.arc(200, 200, 150, startAngle, startAngle + slice);
    pieChart.closePath();
    pieChart.fillStyle = colors[i % colors.length];
    pieChart.fill();
    startAngle += slice;
  });
}

// Dark Mode
toggleTheme.addEventListener("click", () => {
  document.body.classList.toggle("dark-mode");
});

// Initialize
updateUI();
