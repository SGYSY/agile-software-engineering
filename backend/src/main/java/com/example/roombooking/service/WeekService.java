package com.example.roombooking.service;

import com.example.roombooking.entity.Week;
import com.example.roombooking.repository.WeekRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class WeekService {

    @Autowired
    private JdbcTemplate jdbcTemplate;

    @Autowired
    private WeekRepository weekRepository;

    // Retrieve all week records from the database
    public List<Week> getAllWeeks() {
        return weekRepository.findAll();
    }

    // Find a week by its unique ID
    public Optional<Week> getWeekById(Long id) {
        return weekRepository.findById(id);
    }

    // Find a week by its week number
    public Optional<Week> getWeekByNumber(Integer weekNumber) {
        return weekRepository.findByWeekNumber(weekNumber);
    }

    // Get the current teaching week number based on today's date
    public Integer getCurrentWeekNumber() {
        Optional<Week> currentWeek = weekRepository.findCurrentWeek();
        System.out.println("currentWeek: " + currentWeek);
        if (currentWeek.isPresent()) {
            return currentWeek.get().getWeekNumber();
        }

        LocalDate today = LocalDate.now();
        return getWeekNumberByDate(today);
    }

    // Retrieve the current week object based on today's date
    public Optional<Week> getCurrentWeek() {
        return weekRepository.findCurrentWeek();
    }

    // Get the week number that includes the given date
    public Integer getWeekNumberByDate(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.map(Week::getWeekNumber).orElse(0);
    }

    // Find the week that contains the given date
    public Optional<Week> getWeekByDate(LocalDate date) {
        return weekRepository.findByDate(date);
    }

    // Get the start date of the given week number
    public LocalDate getWeekStartDate(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        return week.map(Week::getStartDate).orElse(null);
    }

    // Get the end date of the given week number
    public LocalDate getWeekEndDate(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        return week.map(Week::getEndDate).orElse(null);
    }

    // Save or update a Week object in the database
    public Week saveWeek(Week week) {
        return weekRepository.save(week);
    }

    // Delete a week record by ID
    public void deleteWeek(Long id) {
        weekRepository.deleteById(id);
    }

    // Check if the given date falls within a teaching week
    public boolean isDateInTeachingWeek(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.isPresent();
    }

    // Check if today's date falls within a teaching week
    public boolean isCurrentDateInTeachingWeek() {
        Optional<Week> week = weekRepository.findCurrentWeek();
        return week.isPresent();
    }

    // Get a formatted string representing the date range of the given week number
    public String getWeekDateRange(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        if (week.isPresent()) {
            Week w = week.get();
            return w.getStartDate() + " to " + w.getEndDate();
        }
        return "Unknown week";
    }

    // Automatically generate a set of teaching weeks starting from a given date
    public void generateWeeks(LocalDate startDate, int numWeeks) {
        LocalDate currentStart = startDate;

        for (int i = 1; i <= numWeeks; i++) {
            Week week = new Week();
            week.setWeekNumber(i);
            week.setStartDate(currentStart);
            week.setEndDate(currentStart.plusDays(6));
            week.setDescription("For" + i + " Week");

            weekRepository.save(week);

            currentStart = currentStart.plusDays(7);
        }
    }

    // Legacy method using raw SQL to fetch week data
    public List<Map<String, Object>> getAllWeeksLegacy() {
        String sql = "SELECT * FROM weeks ORDER BY week_number";
        return jdbcTemplate.queryForList(sql);
    }

    // Get the week number for a specific date
    public Integer getWeekNumberForDate(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.map(Week::getWeekNumber).orElse(null);
    }
}
