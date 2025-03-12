package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.Set;

@Entity
@Table(name = "permissions")
@Data
public class Permission {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "permission_id")
    private Long id;
    
    @Column(name = "permission_name")
    private String name;
    
    @ManyToMany(mappedBy = "permissions")
    @JsonIgnore
    private Set<Role> roles;
}