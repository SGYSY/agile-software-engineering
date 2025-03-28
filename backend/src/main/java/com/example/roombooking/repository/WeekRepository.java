package com.example.roombooking.repository;

import com.example.roombooking.entity.Week;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.Optional;

@Repository
public interface WeekRepository extends JpaRepository<Week, Long> {

    @Query(value = "SELECT * FROM weeks WHERE week_number = :weekNumber", nativeQuery = true)
    Optional<Week> findByWeekNumber(@Param("weekNumber") Integer weekNumber);

    @Query(value = "SELECT * FROM weeks WHERE :date BETWEEN start_date AND end_date", nativeQuery = true)
    Optional<Week> findByDate(@Param("date") LocalDate date);

    @Query(value = "SELECT * FROM weeks WHERE CURDATE() BETWEEN start_date AND end_date", nativeQuery = true)
    Optional<Week> findCurrentWeek();

    @Query(value = "SELECT * FROM weeks WHERE start_date = :startDate", nativeQuery = true)
    Optional<Week> findByStartDate(@Param("startDate") LocalDate startDate);

    @Query(value = "SELECT * FROM weeks WHERE end_date = :endDate", nativeQuery = true)
    Optional<Week> findByEndDate(@Param("endDate") LocalDate endDate);
}