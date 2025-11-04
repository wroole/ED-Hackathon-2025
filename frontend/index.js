const inputForm = document.querySelector('#chat-input')
const addChatElement = document.querySelector('#new-chat-btn')

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


newChatElement.addEventListener('submit', event => {
    event.preventDefault()



})


function addMessage(text, sender) {
    const chatBoxElement = document.querySelector('#chat-box')
    const msg = document.createElement('div')
    msg.classList.add('message', sender)
    msg.textContent = text
    chatBoxElement.appendChild(msg)
    chatBoxElement.scrollTop = chatBoxElement.scrollHeight
}

function addImage(image, sender) {
    const chatBoxElement = document.querySelector('#chat-box')
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
