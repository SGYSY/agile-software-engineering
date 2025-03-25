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


    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public String getName() {
        return name;
    }
    
    public void setName(String name) {
        this.name = name;
    }
    
    public String getRoomName() {
        return name;
    }
    
    public void setRoomName(String roomName) {
        this.name = roomName;
    }
    
    public Integer getCapacity() {
        return capacity;
    }
    
    public void setCapacity(Integer capacity) {
        this.capacity = capacity;
    }
    
    public String getLocation() {
        return location;
    }
    
    public void setLocation(String location) {
        this.location = location;
    }
    
    public Boolean getAvailable() {
        return available;
    }
    
    public void setAvailable(Boolean available) {
        this.available = available;
    }
    
    public Boolean getRestricted() {
        return restricted;
    }
    
    public void setRestricted(Boolean restricted) {
        this.restricted = restricted;
    }
    
    public Set<RoomEquipment> getEquipment() {
        return equipment;
    }
    
    public void setEquipment(Set<RoomEquipment> equipment) {
        this.equipment = equipment;
    }
    
    public Set<Booking> getBookings() {
        return bookings;
    }
    
    public void setBookings(Set<Booking> bookings) {
        this.bookings = bookings;
    }
    
    public Set<Schedule> getSchedules() {
        return schedules;
    }
    
    public void setSchedules(Set<Schedule> schedules) {
        this.schedules = schedules;
    }

    
    // equals, hashCode and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Room room = (Room) o;
        return id != null && id.equals(room.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "Room{" +
               "id=" + id +
               ", name='" + name + '\'' +
               ", capacity=" + capacity +
               ", location='" + location + '\'' +
               ", available=" + available +
               ", restricted=" + restricted +
               '}';
    }
}