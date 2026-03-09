// FRONTEND.JS - NutriSnap
// Todas as funções do app em um único arquivo

// LOGIN
async function loginUser() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  if (!email || !password) return alert("Preencha todos os campos!");
  const deviceKey = "device1";
  const currentIP = "192.168.0.1";
  const res = await fetch("/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ emailOrUsername: email, password, deviceKey, currentIP })
  });
  const data = await res.json();
  alert(data.message);
  if (data.message.includes("bem-sucedido")) window.location.href = "dashboard.html";
}

// REGISTRO
async function registerUser() {
  const username = document.getElementById("username")?.value;
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const gender = document.getElementById("gender")?.value;
  const height = document.getElementById("height")?.value;
  const weight = document.getElementById("weight")?.value;
  if (!username || !email || !password || !gender || !height || !weight) return alert("Preencha todos os campos!");
  const deviceKey = "device1";
  const currentIP = "192.168.0.1";
  const res = await fetch("/api/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password, gender, height_cm: height, weight_kg: weight, deviceKey, currentIP })
  });
  const data = await res.json();
  alert(data.message);
  if (data.message.includes("sucesso")) window.location.href = "login.html";
}

// DASHBOARD
const currentUser = { email: "teste@teste.com", username: "Usuário" };
function initDashboard() {
  if (document.getElementById("usernameDisplay")) {
    document.getElementById("usernameDisplay").innerText = `Bem-vindo, ${currentUser.username}`;
    animateStreak(5, currentUser.username);
    updateRanking();
    updateHistory();
  }
}

async function updateRanking() {
  const res = await fetch("/api/ranking");
  const data = await res.json();
  const list = document.getElementById("rankingList");
  if (!list) return;
  list.innerHTML = "";
  data.forEach(u => {
    const li = document.createElement("li");
    li.textContent = `#${u.rank} - ${u.username} | ${u.totalCalories} kcal | ${u.streak} dias`;
    list.appendChild(li);
  });
}

async function updateHistory() {
  const history = document.getElementById("mealHistory");
  if (!history) return;
  history.innerHTML = "";
  currentUser.history = currentUser.history || [];
  currentUser.history.forEach(h => {
    const li = document.createElement("li");
    li.textContent = `${new Date(h.date).toLocaleDateString()} - ${h.calories} kcal`;
    history.appendChild(li);
  });
}

function animateStreak(days, username) {
  const streakDiv = document.getElementById("streak");
  if (!streakDiv) return;
  streakDiv.innerText = `🔥 ${username} está em uma sequência de ${days} dias!`;
}

// PAGAMENTOS
async function requestPayment() {
  const plan = document.getElementById("planSelect")?.value;
  if (!plan) return alert("Selecione um plano!");
  const res = await fetch("/api/payment/request", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, plan })
  });
  const data = await res.json();
  const linkDiv = document.getElementById("paymentLink");
  if (linkDiv) linkDiv.innerHTML = `<a href="${data.link}" target="_blank">Clique aqui para pagar</a>`;
}

// ANÁLISE DE REFEIÇÃO
async function analyzeMeal() {
  const url = document.getElementById("mealImage")?.value;
  if (!url) return alert("Insira a URL da refeição!");
  const res = await fetch("/api/meal/analyze", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: currentUser.email, image_url: url })
  });
  const data = await res.json();
  const mealResult = document.getElementById("mealResult");
  if (mealResult) mealResult.innerHTML = `
    <p>Calorias: ${data.calories} kcal</p>
    <p>Proteínas: ${data.protein} g</p>
    <p>Carbs: ${data.carbs} g</p>
    <p>Gorduras: ${data.fat} g</p>
    <p>${data.streakMessage || ""}</p>
  `;
}

// Inicializa o dashboard se houver
initDashboard();
