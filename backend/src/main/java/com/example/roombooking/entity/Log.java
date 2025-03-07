package com.example.roombooking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "logs")
@Data
public class Log {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "log_id")
    private Long id;
    
    @Enumerated(EnumType.STRING)
    @Column(name = "book_type")
    private BookType bookType;
    
    @Column(name = "booking_at")
    private LocalDateTime bookingAt;
    
    @Column(name = "booking_data")
    private String bookingData;
    
    public enum BookType {
        usage, cancellation, utilization
    }
}