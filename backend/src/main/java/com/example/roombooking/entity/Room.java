package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Entity
@Table(name = "rooms")
@Data
public class Room {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "room_id")
    private Long id;
    
    @Column(name = "room_name")
    private String name;
    
    private Integer capacity;
    
    private String location;
    
    private Boolean available;
    
    private Boolean restricted;
    
    @OneToMany(mappedBy = "room")
    // @JsonManagedReference("room-equipment")
    @JsonIgnore
    private Set<RoomEquipment> equipment;
    
    @OneToMany(mappedBy = "room")
    // @JsonBackReference
    @JsonIgnore
    private Set<Booking> bookings;
    
    @OneToMany(mappedBy = "room")
    // @JsonManagedReference("room-schedule")
    @JsonIgnore
    private Set<Schedule> schedules;
}