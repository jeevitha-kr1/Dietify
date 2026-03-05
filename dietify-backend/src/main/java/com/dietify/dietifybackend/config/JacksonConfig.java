package com.dietify.dietifybackend.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.context.annotation.*;

@Configuration
public class JacksonConfig {
    @Bean
    public ObjectMapper objectMapper() {
        return new ObjectMapper();
    }
}