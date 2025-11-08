let isDark = false;
const toggleBtn = document.getElementById("theme-toggle");
const themeIcon = document.getElementById("theme-icon");

// === Определяем путь для картинок ===
const prefix = window.location.pathname.includes("/MAP/") ? "../" : "";

// === Проверяем сохранённую тему ===
const savedTheme = localStorage.getItem("theme");
isDark = savedTheme === "dark";

// === Функция обновления изображений всех кнопок ===
function updateButtonImages() {
    const mapBtn = document.querySelector('a[href*="map"] img');
    const statBtn = document.querySelector('a[href*="stat"] img');
    const meBtn = document.querySelector('img[alt="Idea"], #idea-btn img');
    const teamBtn = document.querySelector('img[alt="Team"], a[href*="team"] img');

    if (mapBtn) mapBtn.src = isDark ? `${prefix}IMAGES/Dark_map_button.png` : `${prefix}IMAGES/Map_Button.png`;
    if (statBtn) statBtn.src = isDark ? `${prefix}IMAGES/Dark_stat_button.png` : `${prefix}IMAGES/Stat_button.png`;
    if (meBtn) meBtn.src = isDark ? `${prefix}IMAGES/Dark_me.png` : `${prefix}IMAGES/Me.png`;
    if (teamBtn) teamBtn.src = isDark ? `${prefix}IMAGES/Dark_team_button.png` : `${prefix}IMAGES/team.png`;
    if (themeIcon) themeIcon.src = isDark ? `${prefix}IMAGES/Dark_Theme.png` : `${prefix}IMAGES/Light_Theme.png`;
}

// === Применяем тему при загрузке ===
document.body.classList.toggle("dark-mode", isDark);
updateButtonImages();

// === Обработка клика по кнопке темы ===
if (toggleBtn) {
    toggleBtn.addEventListener("click", () => {
        isDark = !isDark;
        localStorage.setItem("theme", isDark ? "dark" : "light");
        document.body.classList.toggle("dark-mode", isDark);
        updateButtonImages();

        // === Обновление фона Vanta.js (если есть) ===
        if (window.vantaEffect) {
            window.vantaEffect.setOptions({
                backgroundColor: isDark ? 0x0D1B2A : 0xADD8E6,
                color: isDark ? 0x9E9E9E : 0xCD853F
            });
        }

        // === Обновление карты (если используется Leaflet) ===
        if (window.map && window.tileLayer) {
            map.removeLayer(tileLayer);
            window.tileLayer = L.tileLayer(
                isDark
                    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png"
                    : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
                {
                    attribution: "&copy; OpenStreetMap & Carto",
                    subdomains: "abcd",
                    maxZoom: 19
                }
            ).addTo(map);
        }
    });
}
