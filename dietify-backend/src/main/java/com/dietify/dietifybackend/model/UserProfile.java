package com.dietify.dietifybackend.model;

import jakarta.persistence.*;

@Entity
public class UserProfile {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Lob
    @Column(columnDefinition = "TEXT")
    private String answersJson; // store full answers as JSON string

    private Integer dailyCalories;
    private Integer proteinG;
    private Integer carbsG;
    private Integer fatG;
    private Double waterLiters;

    public Long getId() { return id; }

    public String getAnswersJson() { return answersJson; }
    public void setAnswersJson(String answersJson) { this.answersJson = answersJson; }

    public Integer getDailyCalories() { return dailyCalories; }
    public void setDailyCalories(Integer dailyCalories) { this.dailyCalories = dailyCalories; }

    public Integer getProteinG() { return proteinG; }
    public void setProteinG(Integer proteinG) { this.proteinG = proteinG; }

    public Integer getCarbsG() { return carbsG; }
    public void setCarbsG(Integer carbsG) { this.carbsG = carbsG; }

    public Integer getFatG() { return fatG; }
    public void setFatG(Integer fatG) { this.fatG = fatG; }

    public Double getWaterLiters() { return waterLiters; }
    public void setWaterLiters(Double waterLiters) { this.waterLiters = waterLiters; }
}