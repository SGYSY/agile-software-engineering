package com.example.roombooking.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;

@Entity
@Table(name = "room_issue")
@Data
public class RoomIssue {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "issue_id")
    private Long id;
    
    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;
    
    @Column(name = "issue_name")
    private String issueName;
    
    @Column(name = "description")
    private String description;
}