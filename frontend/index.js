const inputForm = document.querySelector('#chat-input')
const addChatElement = document.querySelector('#new-chat-btn')
const chatListElement = document.querySelector('#chat-history')
const chatBoxElement = document.querySelector('#chat-box')


let chats = [];
let currentChatId = null;


enableImagePreview();
inputForm.addEventListener('submit', event => {
    event.preventDefault()

    const inputElement = document.querySelector('#user-input').value
    document.querySelector('#user-input').value = ''
    console.log(inputElement)
    addMessage(inputElement, 'user')
    fetch('http://127.0.0.1:8000/ask', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: inputElement })
    })
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(data => {
            console.log(data)
            addMessage(data.answer, 'bot')
            if(data.image) {
                addImage('http://localhost:8000' + data.image, 'bot')
            }
        })
        .catch(err => console.error('Ошибка:', err));
})


addChatElement.addEventListener('submit', event => {
    event.preventDefault()

    const newChat = {
        id: Date.now(),
        title: 'New chat',
        messages: []
    };
    chats.push(newChat);
    currentChatId = newChat.id;

    const chatButton = document.createElement('div');
    chatButton.classList.add('chat-item inactive');
    chatButton.textContent = newChat.title;

    // при клике на чат — переключаемся
    chatButton.addEventListener('click', () => loadChat(newChat.id));
    chatListElement.appendChild(chatButton);

    // 4. очищаем окно чата
    chatBoxElement.innerHTML = '';

})

fetch('http://127.0.0.1:8080/api/test')
    .then(res => res.json())
    .then(data => {
        console.log('Ответ от Java:', data);
        addMessage(data.message, 'bot');
    })
    .catch(err => console.error('Ошибка запроса:', err));

function loadChat(chatID){
    const chat = chats.find(element => element.id === chatID)
    currentChatId = chat.id
    chatBoxElement.innerHTML = ''

    if(chat){
        chat.messages.forEach(msg => addMessage(msg.text, msg.sender))
    }
}

function addMessage(text, sender) {
    const msg = document.createElement('div')
    msg.classList.add('message', sender)
    msg.textContent = text
    chatBoxElement.appendChild(msg)
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight
}

function addImage(image, sender) {
    const img = document.createElement('img')
    img.src = image
    img.classList.add('message', sender, 'image')
    img.alt = 'answer from a bot'
    chatBoxElement.appendChild(img)
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight
}


// Функция для увеличения картинки
function enableImagePreview() {
    const modal = document.querySelector('#image-modal');
    const modalImg = document.querySelector('#modal-img');

    // Когда кликают на картинку в чате
    document.addEventListener('click', (e) => {
        if (e.target.tagName === 'IMG' && e.target.classList.contains('image')) {
            modal.style.display = 'flex';
            modalImg.src = e.target.src;
        }
    });

    // Когда кликают на модальное окно (закрытие)
    modal.addEventListener('click', () => {
        modal.style.display = 'none';
    });
}
