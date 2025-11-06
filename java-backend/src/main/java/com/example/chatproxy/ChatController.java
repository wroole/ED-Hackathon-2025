package com.example.chatproxy;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.*;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // разрешаем запросы с фронтенда
public class ChatController {

    private final RestTemplate restTemplate = new RestTemplate();
    private final List<Message> chatHistory = new ArrayList<>();

    @PostMapping("/chat")
    public ResponseEntity<Map<String, Object>> handleChat(@RequestBody Map<String, String> payload) {
        String question = payload.get("question");

        if (question == null || question.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("error", "Question is empty"));
        }

        // 1️⃣ сохраняем сообщение пользователя
        chatHistory.add(new Message("user", question));

        try {
            // 2️⃣ отправляем вопрос на Python FastAPI
            Map<String, String> body = Map.of("question", question);
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    "http://127.0.0.1:8000/ask", body, Map.class);

            // 3️⃣ получаем ответ от Python
            Map<String, Object> pythonResponse = response.getBody();
            String answer = (String) pythonResponse.get("answer");
            String image = (String) pythonResponse.get("image");

            // 4️⃣ сохраняем ответ бота
            chatHistory.add(new Message("bot", answer));

            // 5️⃣ возвращаем фронту JSON
            Map<String, Object> result = new HashMap<>();
            result.put("answer", answer);
            if (image != null) result.put("image", image);
            result.put("history", chatHistory);

            return ResponseEntity.ok(result);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError()
                    .body(Map.of("error", "Ошибка связи с Python-сервером: " + e.getMessage()));
        }
    }

    // 💾 получить всю историю
    @GetMapping("/history")
    public ResponseEntity<List<Message>> getHistory() {
        return ResponseEntity.ok(chatHistory);
    }
}
