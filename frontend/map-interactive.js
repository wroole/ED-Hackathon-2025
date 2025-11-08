// === ИНИЦИАЛИЗАЦИЯ КАРТЫ ===
window.map = L.map("map").setView([48.1486, 17.1077], 11); // Bratislava
window.tileLayer = L.tileLayer(
    "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
    {
        attribution: "&copy; OpenStreetMap & Carto",
        subdomains: "abcd",
        maxZoom: 19
    }
).addTo(map);

// === ЗАГРУЗКА ДАННЫХ ===
fetch("geo_sales.json")
    .then(res => res.json())
    .then(data => {
        data.forEach(point => {
            if (!point.latitude || !point.longitude) return;

            const radius = Math.min(Math.max(Math.sqrt(point.receipt_price) / 2, 4), 20);
            const circle = L.circleMarker([point.latitude, point.longitude], {
                radius: radius,
                color: "#4F85E2",
                fillColor: "#4F85E2",
                fillOpacity: 0.6
            }).addTo(map);

            circle.bindPopup(`
        <b>${point.org_name}</b><br>
        ${point.city}, ${point.street}<br>
        💶 €${point.receipt_price.toFixed(2)}
      `);
        });

        // Автоматическое центрирование по всем точкам
        const bounds = L.latLngBounds(data.map(p => [p.latitude, p.longitude]));
        map.fitBounds(bounds);
    })
    .catch(err => console.error("Error loading geo_sales.json:", err));

// === РЕАКЦИЯ НА ИЗМЕНЕНИЕ ОКНА ===
window.addEventListener("resize", () => map.invalidateSize());

// === ФОН (VANTA) ===
vantaEffect = VANTA.NET({
    el: "#banner",
    mouseControls: true,
    touchControls: false,
    gyroControls: false,
    points: 12.0,
    maxDistance: 20.0,
    spacing: 18.0,
    color: 0xCD853F,
    backgroundColor: 0xADD8E6
});



