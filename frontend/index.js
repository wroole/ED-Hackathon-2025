// === ФОН VANTA ===
let vantaEffect = VANTA.NET({
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
window.vantaEffect = vantaEffect; // чтобы theme.js мог менять фон

// === ЧАТ ===
document.addEventListener("DOMContentLoaded", () => {
  const chat = document.getElementById("chat");
  const chatBox = document.getElementById("chat-box");
  const chatForm = document.getElementById("chat-input");
  const chatInput = document.getElementById("user-input");
  const chatWrapper = document.querySelector(".chat-wrapper");

  let firstMessageSent = false;

  chatForm.addEventListener("submit", async event => {
    event.preventDefault();
    const inputValue = chatInput.value.trim();
    if (!inputValue) return;

    if (!firstMessageSent) {
      chat.classList.add("active");
      resizeChat();
      firstMessageSent = true;
    }

    addMessage(inputValue, "user");
    chatInput.value = "";

    try {
      const res = await fetch("http://127.0.0.1:8000/ask", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputValue })
      });

      if (!res.ok) throw new Error("Network error");
      const data = await res.json();

      const typing = addMessage("...", "bot", true);
      await new Promise(r => setTimeout(r, 600));
      typing.remove();

      addMessage(data.answer || "No response from server.", "bot");
      if (data.image) addImage("http://localhost:8000" + data.image, "bot");
    } catch {
      addMessage("Networking error", "bot");
    }
  });

  function addMessage(text, sender, temp = false) {
    const msg = document.createElement("div");
    msg.classList.add("message", sender);
    msg.textContent = text;
    chatBox.appendChild(msg);
    chatBox.scrollTop = chatBox.scrollHeight;
    if (temp) return msg;
  }

  function addImage(url, sender) {
    const img = document.createElement("img");
    img.src = url;
    img.classList.add("message", sender);
    img.alt = "Image response";
    chatBox.appendChild(img);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function resizeChat() {
    const screenH = window.innerHeight;
    const screenW = window.innerWidth;
    const chatWidth = Math.min(screenW * 0.9, 780);
    const chatHeight = Math.min(screenH * 0.5, 500);
    chatWrapper.style.width = chatWidth + "px";
    chat.style.minHeight = chatHeight + "px";
    chatWrapper.style.top = "50%";
    chatWrapper.style.left = "50%";
    chatWrapper.style.transform = "translate(-50%, -50%)";
  }

  window.addEventListener("resize", () => {
    if (chat.classList.contains("active")) resizeChat();
  });

  // === ПАНЕЛЬ IDEA ===
  const ideaBtn = document.getElementById("idea-btn");
  const ideaPanel = document.getElementById("idea-panel");

  ideaBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    ideaPanel.classList.toggle("active");

      ideaPanel.innerHTML = "";

      const fact = document.createElement("p")
      fact.textContent = 'Fact is loading...'
      ideaPanel.appendChild(fact);
    fetch("http://localhost:8000/fact")
        .then(res => res.json())
        .then(data => {

            fact.textContent = data.fact

        })



  });

  document.addEventListener("click", (e) => {
    if (!ideaPanel.contains(e.target) && !ideaBtn.contains(e.target)) {
      ideaPanel.classList.remove("active");
    }
    ideaPanel.innerHTML = "";
  });
});
