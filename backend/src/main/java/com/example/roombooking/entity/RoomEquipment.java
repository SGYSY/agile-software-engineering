package com.example.roombooking.entity;

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
    private Room room;
    
    @Column(name = "equipment_name")
    private String equipmentName;
}