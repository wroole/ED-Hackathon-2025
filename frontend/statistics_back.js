// === Генерация случайных данных ===
const labels = ['Янв','Фев','Мар','Апр','Май','Июн','Июл','Авг','Сен','Окт','Ноя','Дек'];
const rnd = (n=12, min=10, max=100) => Array.from({length:n}, () => Math.round(min + Math.random()*(max-min)));

// === Chart.js настройки ===
Chart.defaults.color = '#dbe1ff';
Chart.defaults.borderColor = 'rgba(255,255,255,.12)';
Chart.defaults.animation = { duration: 800, easing: 'easeOutQuart' };

const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { labels: { boxWidth: 12, boxHeight: 12 } },
    tooltip: { mode: 'index', intersect: false }
  },
  scales: {
    x: { grid: { display: false } },
    y: { grid: { color: 'rgba(255,255,255,.08)' }, ticks: { stepSize: 20 } }
  }
};

// === 1. Line ===
new Chart(document.getElementById('chart1'), {
  type: 'line',
  data: {
    labels,
    datasets: [
      { label: 'Продажи', data: rnd(), tension: .35 },
      { label: 'План', data: rnd(), tension: .35, borderDash: [6,4] }
    ]
  },
  options: baseOptions
});

// === 2. Bar ===
new Chart(document.getElementById('chart2'), {
  type: 'bar',
  data: {
    labels,
    datasets: [
      { label: 'Текущий год', data: rnd(), borderRadius: 6 },
      { label: 'Прошлый год', data: rnd(), borderRadius: 6 }
    ]
  },
  options: baseOptions
});

// === 3. Doughnut (адаптив исправлен) ===
new Chart(document.getElementById('chart3'), {
  type: 'doughnut',
  data: {
    labels: ['A','B','C','D'],
    datasets: [{ data: rnd(4, 10, 40) }]
  },
  options: {
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    cutout: '60%',
    scales: undefined
  }
});

// === 4. Pie (адаптив исправлен) ===
new Chart(document.getElementById('chart4'), {
  type: 'pie',
  data: {
    labels: ['Север','Юг','Запад','Восток'],
    datasets: [{ data: rnd(4, 15, 45) }]
  },
  options: {
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    scales: undefined
  }
});

// === 5. Radar ===
new Chart(document.getElementById('chart5'), {
  type: 'radar',
  data: {
    labels: ['Скорость','Качество','Стоимость','Надёжность','Удобство','Поддержка'],
    datasets: [
      { label: 'Продукт X', data: rnd(6, 30, 95) },
      { label: 'Продукт Y', data: rnd(6, 20, 90) }
    ]
  },
  options: {
    responsive: true,
    maintainAspectRatio: false,
    plugins: baseOptions.plugins,
    elements: { line: { borderWidth: 2 } },
    scales: {
      r: {
        angleLines: { color: 'rgba(255,255,255,.08)' },
        grid: { color: 'rgba(255,255,255,.10)' }
      }
    }
  }
});

// === 6. PolarArea (адаптив исправлен) ===
new Chart(document.getElementById('chart6'), {
  type: 'polarArea',
  data: {
    labels: ['One','Two','Three','Four','Five'],
    datasets: [{ data: rnd(5, 10, 70) }]
  },
  options: {
    ...baseOptions,
    responsive: true,
    maintainAspectRatio: false,
    scales: undefined
  }
});

// === VANTA интерактивный фон ===
let vantaEffect;
document.addEventListener("DOMContentLoaded", () => {
  vantaEffect = VANTA.NET({
    el: "#vanta-bg",
    mouseControls: true,
    touchControls: false,
    gyroControls: false,
    points: 12.0,
    maxDistance: 20.0,
    spacing: 18.0,
    color: 0xCD853F,          // светлая тема — оранжевая сеть
    backgroundColor: 0xADD8E6 // светлая тема — голубой фон
  });
});

// === Переключение темы ===
const themeBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");
let isDark = false;

themeBtn.addEventListener("click", () => {
  isDark = !isDark;
  document.body.classList.toggle("dark-mode", isDark);
  themeIcon.src = isDark ? "change theme2.png" : "change theme.png";

  if (vantaEffect) {
    vantaEffect.setOptions({
      backgroundColor: isDark ? 0x0D1B2A : 0xADD8E6,  // фон тёмный / светлый
      color: isDark ? 0x9E9E9E : 0xCD853F             // сеть серая / оранжевая
    });
  }
});



