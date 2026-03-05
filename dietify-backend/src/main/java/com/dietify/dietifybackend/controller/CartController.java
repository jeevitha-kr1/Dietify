package com.dietify.dietifybackend.controller;

import com.dietify.dietifybackend.dto.CartModels;
import com.dietify.dietifybackend.service.CartService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    private final CartService cartService;

    public CartController(CartService cartService) {
        this.cartService = cartService;
    }

   
    // POST http://localhost:8080/api/cart/from-plan
    @PostMapping("/from-plan")
    public ResponseEntity<CartModels.CartResponse> fromPlan(@RequestBody CartModels.CartFromPlanRequest req) {
        return ResponseEntity.ok(cartService.buildFromPlan(req));
    }

    @GetMapping("/health")
    public String health() {
        return "OK";
    }
}