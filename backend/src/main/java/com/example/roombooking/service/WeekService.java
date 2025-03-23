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
    
    /**
     * 获取所有教学周
     */
    public List<Week> getAllWeeks() {
        return weekRepository.findAll();
    }
    
    /**
     * 根据ID获取教学周
     */
    public Optional<Week> getWeekById(Long id) {
        return weekRepository.findById(id);
    }
    
    /**
     * 根据周数获取教学周
     */
    public Optional<Week> getWeekByNumber(Integer weekNumber) {
        return weekRepository.findByWeekNumber(weekNumber);
    }
    
    /**
     * 获取当前教学周
     * @return 当前的教学周数，如果不在任何教学周期内返回0
     */
    public Integer getCurrentWeekNumber() {
        // 尝试使用原有方法
        Optional<Week> currentWeek = weekRepository.findCurrentWeek();
        System.out.println("currentWeek: " + currentWeek);
        if (currentWeek.isPresent()) {
            return currentWeek.get().getWeekNumber();
        }
        
        // 如果失败，则使用当前日期查询
        LocalDate today = LocalDate.now();
        return getWeekNumberByDate(today);
    }
    
    /**
     * 获取当前教学周详细信息
     */
    public Optional<Week> getCurrentWeek() {
        return weekRepository.findCurrentWeek();
    }
    
    /**
     * 根据日期获取教学周
     * @param date 特定日期
     * @return 对应的教学周数，如果不在任何教学周期内返回0
     */
    public Integer getWeekNumberByDate(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.map(Week::getWeekNumber).orElse(0);
    }
    
    /**
     * 根据日期获取教学周详细信息
     */
    public Optional<Week> getWeekByDate(LocalDate date) {
        return weekRepository.findByDate(date);
    }
    
    /**
     * 获取教学周的开始日期
     * @param weekNumber 教学周数
     * @return 开始日期
     */
    public LocalDate getWeekStartDate(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        return week.map(Week::getStartDate).orElse(null);
    }
    
    /**
     * 获取教学周的结束日期
     * @param weekNumber 教学周数
     * @return 结束日期
     */
    public LocalDate getWeekEndDate(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        return week.map(Week::getEndDate).orElse(null);
    }
    
    /**
     * 创建或更新教学周
     */
    public Week saveWeek(Week week) {
        return weekRepository.save(week);
    }
    
    /**
     * 删除教学周
     */
    public void deleteWeek(Long id) {
        weekRepository.deleteById(id);
    }
    
    /**
     * 检查日期是否在教学周期内
     */
    public boolean isDateInTeachingWeek(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.isPresent();
    }
    
    /**
     * 检查当前是否在教学周期内
     */
    public boolean isCurrentDateInTeachingWeek() {
        Optional<Week> week = weekRepository.findCurrentWeek();
        return week.isPresent();
    }
    
    /**
     * 获取特定周的日期范围
     * @param weekNumber 周数
     * @return 日期范围描述
     */
    public String getWeekDateRange(Integer weekNumber) {
        Optional<Week> week = weekRepository.findByWeekNumber(weekNumber);
        if (week.isPresent()) {
            Week w = week.get();
            return w.getStartDate() + " to " + w.getEndDate();
        }
        return "Unknown week";
    }
    
    /**
     * 批量生成教学周数据
     * @param startDate 第一周开始日期
     * @param numWeeks 周数
     */
    public void generateWeeks(LocalDate startDate, int numWeeks) {
        LocalDate currentStart = startDate;
        
        for (int i = 1; i <= numWeeks; i++) {
            Week week = new Week();
            week.setWeekNumber(i);
            week.setStartDate(currentStart);
            week.setEndDate(currentStart.plusDays(6)); // 设置结束日期为本周最后一天
            week.setDescription("第" + i + "教学周");
            
            weekRepository.save(week);
            
            // 下一周的开始日期
            currentStart = currentStart.plusDays(7);
        }
    }
    
    /**
     * 获取所有教学周信息 (原有JdbcTemplate实现保留，兼容可能的遗留代码)
     * @return 包含所有教学周信息的列表
     */
    public List<Map<String, Object>> getAllWeeksLegacy() {
        String sql = "SELECT * FROM weeks ORDER BY week_number";
        return jdbcTemplate.queryForList(sql);
    }

    /**
     * 根据日期获取教学周数
     * @param date 日期
     * @return 周数，如果不在教学周内返回null
     */
    public Integer getWeekNumberForDate(LocalDate date) {
        Optional<Week> week = weekRepository.findByDate(date);
        return week.map(Week::getWeekNumber).orElse(null);
    }

    
}