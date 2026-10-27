
package com.foodrescuett.backend;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "donations")
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String foodName;
    private String category;
    private Double quantity;
    private LocalDateTime expiry;
    private String location;

    @Column(length = 1000)
    private String description;

    private String status = "Available";
private Long donorId;
private Long ngoId;
private Long volunteerId;

    public Donation() {
    }

    public Long getId() {
        return id;
    }

    public String getFoodName() {
        return foodName;
    }

    public void setFoodName(String foodName) {
        this.foodName = foodName;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public Double getQuantity() {
        return quantity;
    }

    public void setQuantity(Double quantity) {
        this.quantity = quantity;
    }

    public LocalDateTime getExpiry() {
        return expiry;
    }

    public void setExpiry(LocalDateTime expiry) {
        this.expiry = expiry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public Long getDonorId() {
        return donorId;
    }

    public void setDonorId(Long donorId) {
        this.donorId = donorId;
    }
    public Long getNgoId() { 
        return ngoId; 
    }
    
    public void setNgoId(Long ngoId) {
         this.ngoId = ngoId;
    }
    public Long getVolunteerId() {
    return volunteerId;
}

public void setVolunteerId(Long volunteerId) {
    this.volunteerId = volunteerId;
}
}
