package com.dietify.dietifybackend.dto;

import java.util.Map;

public class ProfileResponse {
    public Long profileId;
    public Map<String, Object> savedAnswers;

    public Integer dailyCalories;
    public Integer proteinG;
    public Integer carbsG;
    public Integer fatG;
    public Double waterLiters;

    public ProfileResponse() {}
}