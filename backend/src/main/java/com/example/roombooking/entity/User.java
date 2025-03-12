package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Entity
@Table(name = "users")
@Data
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long id;
    
    private String username;
    
    @Column(name = "password_hash")
    private String passwordHash;
    
    @Column(name = "first_name")
    private String firstName;
    
    @Column(name = "last_name")
    private String lastName;
    
    private String email;
    
    @Column(name = "phone_number")
    private String phoneNumber;
    
    @ManyToOne
    @JoinColumn(name = "role_id")
    private Role role;
    
    @OneToMany(mappedBy = "user")
    @JsonIgnore
    private Set<Booking> bookings;
}