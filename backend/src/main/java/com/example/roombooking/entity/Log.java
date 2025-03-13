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
    
    // Getters and Setters
    public Long getId() {
        return id;
    }
    
    public void setId(Long id) {
        this.id = id;
    }
    
    public BookType getBookType() {
        return bookType;
    }
    
    public void setBookType(BookType bookType) {
        this.bookType = bookType;
    }
    
    public LocalDateTime getBookingAt() {
        return bookingAt;
    }
    
    public void setBookingAt(LocalDateTime bookingAt) {
        this.bookingAt = bookingAt;
    }
    
    public String getBookingData() {
        return bookingData;
    }
    
    public void setBookingData(String bookingData) {
        this.bookingData = bookingData;
    }
    
    // equals, hashCode and toString methods
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        
        Log log = (Log) o;
        return id != null && id.equals(log.id);
    }
    
    @Override
    public int hashCode() {
        return id != null ? id.hashCode() : 0;
    }
    
    @Override
    public String toString() {
        return "Log{" +
               "id=" + id +
               ", bookType=" + bookType +
               ", bookingAt=" + bookingAt +
               ", bookingData='" + bookingData + '\'' +
               '}';
    }
}