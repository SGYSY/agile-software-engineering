package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room_equipment")
@Data
public class RoomEquipment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "equipment_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    @JsonIgnore
    private Room room;
    
    @Column(name = "equipment_name")
    private String name;
    
    private String description;
    
    @Column(name = "is_available")
    private Boolean isAvailable;
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public Room getRoom() {
        return room;
    }
    
    public void setRoom(Room room) {
        this.room = room;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getEquipmentName() {
        return name;
    }
    
    public void setEquipmentName(String equipmentName) {
        this.name = equipmentName;
    }
    
    public String getDescription() {
        return description;
    }
    
    public void setDescription(String description) {
        this.description = description;
    }
    
    public Boolean getIsAvailable() {
        return isAvailable;
    }
    
    public void setIsAvailable(Boolean isAvailable) {
        this.isAvailable = isAvailable;
    }
    
    public Boolean isAvailable() {
        return isAvailable;
    }
    
    public void setAvailable(Boolean available) {
        this.isAvailable = available;
    }
    
    // equals, hashCode and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        RoomEquipment equipment = (RoomEquipment) o;
        return id != null && id.equals(equipment.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "RoomEquipment{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", description='" + description + '\'' +
               ", isAvailable=" + isAvailable +
               '}';
    }
}