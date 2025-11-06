const sidebar = document.querySelector('#sidebar');
const toggleButton = document.querySelector('#toggle-sidebar');
const inputForm = document.querySelector('#chat-input');
const chatBoxElement = document.querySelector('#chat-box');
const mainContainer = document.querySelector('.main');

toggleButton.addEventListener('click', () => {
    sidebar.classList.toggle('collapsed');
});

enableImagePreview();

// === Показ приветственного экрана ===
function showWelcomeScreen() {
    // Очищаем чат
    chatBoxElement.innerHTML = '';

    // Добавляем приветственный блок, если его ещё нет
    if (!document.querySelector('.welcome-message')) {
        const welcomeText = document.createElement('div');
        welcomeText.className = 'welcome-message';
        welcomeText.innerHTML = `
            <p>What's on your business today?</p>
        `;
        mainContainer.insertBefore(welcomeText, inputForm);
    }

    // Включаем режим центрирования
    mainContainer.classList.add('welcome');
}

// === Скрытие приветственного экрана ===
function hideWelcomeScreen() {
    const welcomeText = document.querySelector('.welcome-message');
    if (welcomeText) welcomeText.remove();
    mainContainer.classList.remove('welcome');
}

// === Отправка сообщений ===
inputForm.addEventListener('submit', event => {
    event.preventDefault();

    const inputValue = document.querySelector('#user-input').value.trim();
    if (!inputValue) return;

    hideWelcomeScreen(); // прячем приветствие при первом сообщении

    document.querySelector('#user-input').value = '';
    addMessage(inputValue, 'user');

    fetch('http://127.0.0.1:8080/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputValue })
    })
        .then(res => res.json())
        .then(data => {
            addMessage(data.answer, 'bot');
            if (data.image) {
                addImage('http://localhost:8000' + data.image, 'bot');
            }
        })
        .catch(err => console.error('Ошибка запроса:', err));
});

// === Добавление сообщений ===
function addMessage(text, sender) {
    const msg = document.createElement('div');
    msg.classList.add('message', sender);
    msg.textContent = text;
    chatBoxElement.appendChild(msg);
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
}

function addImage(image, sender) {
    const img = document.createElement('img');
    img.src = image;
    img.classList.add('message', sender, 'image');
    img.alt = 'Ответ от бота';
    chatBoxElement.appendChild(img);
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight;
}

// === Предпросмотр изображений ===
function enableImagePreview() {
    const modal = document.querySelector('#image-modal');
    const modalImg = document.querySelector('#modal-img');

    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('image')) {
            modal.style.display = 'flex';
            modalImg.src = e.target.src;
        }
    });

    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}

// === Загрузка истории ===
document.addEventListener('DOMContentLoaded', () => {
    console.log('🌐 Загружаем историю чата с Java...');
    fetch('http://127.0.0.1:8080/api/history')
        .then(res => res.json())
        .then(data => {
            if (data && data.length > 0) {
                console.log('История:', data);
                chatBoxElement.innerHTML = '';

                data.forEach(msg => {
                    if (msg.text) addMessage(msg.text, msg.sender);
                    if (msg.image) addImage('http://localhost:8000' + msg.image, msg.sender);
                });
                hideWelcomeScreen();
            } else {
                showWelcomeScreen();
                console.log('История пуста.');
            }
        })
        .catch(err => {
            console.error('Ошибка загрузки истории:', err);
            showWelcomeScreen();
        });
});

// === Новый чат ===
document.querySelector('.new-chat-btn')?.addEventListener('click', () => {
    showWelcomeScreen();
});