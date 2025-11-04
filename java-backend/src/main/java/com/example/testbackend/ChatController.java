package com.example.testbackend;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*") // разрешаем фронту подключаться
public class ChatController {

    @GetMapping("/test")
    public Map<String, String> getTestMessage() {
        Map<String, String> response = new HashMap<>();
        response.put("message", "Привет с Java backend! 🧠");
        return response;
    }
}
