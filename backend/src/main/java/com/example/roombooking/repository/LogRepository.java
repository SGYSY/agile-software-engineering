package com.example.roombooking.repository;

import com.example.roombooking.entity.Log;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface LogRepository extends JpaRepository<Log, Long> {
    
    @Query(value = "SELECT * FROM logs WHERE book_type = :bookType", nativeQuery = true)
    List<Log> findByBookType(@Param("bookType") String bookType);
    
    @Query(value = "SELECT * FROM logs WHERE booking_at BETWEEN :startDate AND :endDate", nativeQuery = true)
    List<Log> findByBookingDateBetween(@Param("startDate") LocalDateTime startDate, 
                                       @Param("endDate") LocalDateTime endDate);
    
    @Query(value = "INSERT INTO logs (book_type, booking_data) VALUES (:bookType, :bookingData)", nativeQuery = true)
    void createLog(@Param("bookType") String bookType, @Param("bookingData") String bookingData);
}