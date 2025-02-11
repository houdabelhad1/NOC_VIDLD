package com.hbdev.myllama.web;

import com.hbdev.myllama.service.MyLlamaService;
import org.springframework.web.bind.annotation.*;

@RestController
@CrossOrigin(origins = "http://localhost:5173", allowedHeaders = "*", methods = {RequestMethod.GET, RequestMethod.POST})

public class LlamaController {

    private final MyLlamaService myLlamaService;

    public LlamaController(MyLlamaService myLlamaService) {
        this.myLlamaService = myLlamaService;
    }

    @GetMapping("/ask-health-advice")
    public String getHealthAdvice(@RequestParam String question) {
        return myLlamaService.getHealthAdvice(question);
    }
}
