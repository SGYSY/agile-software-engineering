package com.example.roombooking.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room_permission")
@Data
public class RoomPermission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;
}