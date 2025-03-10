package com.example.roombooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

import com.fasterxml.jackson.annotation.JsonIgnore;

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
    @JsonIgnore
    private Set<RoomEquipment> equipment;
    
    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private Set<Booking> bookings;
    
    @OneToMany(mappedBy = "room")
    @JsonIgnore
    private Set<Schedule> schedules;


    public void setId(Long id){
        this.id = id;
    }

    public Long getId(){
        return this.id;
    }

    public String getName() {
        return name;
    }

    public Boolean getAvailable() {
        return available;
    }

    public Boolean getRestricted() {
        return restricted;
    }

    public Integer getCapacity() {
        return capacity;
    }

    public String getLocation() {
        return location;
    }

    public Set<Booking> getBookings() {
        return bookings;
    }

    public Set<RoomEquipment> getEquipment() {
        return equipment;
    }

    public Set<Schedule> getSchedules() {
        return schedules;
    }

    public void setAvailable(Boolean available) {
        this.available = available;
    }

    public void setBookings(Set<Booking> bookings) {
        this.bookings = bookings;
    }

    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }

    public void setEquipment(Set<RoomEquipment> equipment) {
        this.equipment = equipment;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setRestricted(Boolean restricted) {
        this.restricted = restricted;
    }

    public void setSchedules(Set<Schedule> schedules) {
        this.schedules = schedules;
    }
}