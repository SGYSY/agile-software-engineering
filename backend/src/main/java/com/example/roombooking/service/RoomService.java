package com.example.roombooking.service;

import com.example.roombooking.entity.Room;
import com.example.roombooking.entity.RoomPermission;
import com.example.roombooking.entity.User;
import com.example.roombooking.repository.RoomPermissionRepository;
import com.example.roombooking.repository.RoomRepository;
import com.example.roombooking.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.*;

@Service
public class RoomService {

    @Autowired
    private RoomRepository roomRepository;

    @Autowired
    private RoomPermissionRepository roomPermissionRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private WeekService weekService;

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Optional<Room> getRoomById(Long id) {
        return roomRepository.findById(id);
    }

    public List<Room> getAvailableRooms() {
        return roomRepository.findByAvailableTrue();
    }

    public List<Room> getPermittedRooms(Long userId) {
        List<Long> ll = roomRepository.findAllRoomIds();
        User u = userRepository.findById(userId).get();
        List<Room> allRoom = roomRepository.findRoomsByRestrictedType(0);
        if(u.getRole().getId() == 2){
            allRoom.addAll(roomRepository.findRoomsByRestrictedType(1));
        }
        if(u.getRole().getId() == 1){
            allRoom.addAll(roomRepository.findRoomsByRestrictedType(1));
            allRoom.addAll(roomRepository.findRoomsByRestrictedType(2));
        }
        for (Long roomId : ll) {
            List<RoomPermission> rp = roomPermissionRepository.checkUserAccessToRoom(userId, roomId);
            if (rp == null || rp.isEmpty())
                continue;
            Optional<Room> tr = roomRepository.findById(roomId);
            if(tr.isEmpty())
                continue;
            allRoom.add(tr.get());
        }
        List<Room> allRooms = new ArrayList<>();
        Set<Room> permissionSet = new HashSet<>(allRooms);
        permissionSet.addAll(allRoom);

        allRooms = new ArrayList<>(permissionSet);
        return allRooms;
    }

    public List<Room> getRoomsByMinCapacity(int capacity) {
        return roomRepository.findByCapacityGreaterThanEqual(capacity);
    }


    // public List<Room> getAvailableRoomsBetween(LocalDateTime start, LocalDateTime end) {
    //     String startStr = start.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    //     String endStr = end.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"));
    //     return roomRepository.findAvailableRooms(startStr, endStr);
    // }

    public List<Room> getAvailableRoomsBetween(LocalDateTime start, LocalDateTime end) {
        Integer weekNumber = weekService.getWeekNumberForDate(start.toLocalDate());
        Integer dayOfWeek = start.getDayOfWeek().getValue();
        
        Time startTime = Time.valueOf(start.toLocalTime());
        Time endTime = Time.valueOf(end.toLocalTime());

        return roomRepository.findAvailableRoomsByWeekAndDay(weekNumber, dayOfWeek, startTime, endTime);
    }

    
    public Room saveRoom(Room room) {
        return roomRepository.save(room);
    }

    public void deleteRoom(Long id) {
        roomRepository.deleteById(id);
    }

    // public List<Long> getAvailableRoomIdsByTimeSlot(
    //         Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime) {

    //     Time sqlStartTime = Time.valueOf(startTime);
    //     Time sqlEndTime = Time.valueOf(endTime);

    //     return roomRepository.findAvailableRoomIdsByTimeSlot(
    //         weekNumber, dayOfWeek, sqlStartTime, sqlEndTime);
    // }

    public List<Long> getAvailableRoomIdsByTimeSlot(
            Integer weekNumber, Integer dayOfWeek, LocalTime startTime, LocalTime endTime, List<Long> roomIds) {
        
        if (roomIds == null || roomIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // filter out unavailable and restricted rooms
        List<Long> availableRoomIds = roomRepository.findAvailableAndNotRestrictedRoomIds(roomIds);
        
        if (availableRoomIds.isEmpty()) {
            return new ArrayList<>();
        }
        
        // convert to sql usable type
        Time sqlStartTime = Time.valueOf(startTime);
        Time sqlEndTime = Time.valueOf(endTime);

        return roomRepository.findAvailableRoomIdsByTimeSlot(
            weekNumber, dayOfWeek, sqlStartTime, sqlEndTime, availableRoomIds);
    }

    /**
     * set room restriction
     * @param roomId room id
     * @param restricted restricted
     * @param restrictionReason restriction reason
     * @return room
     */
    public Optional<Room> setRoomRestriction(Long roomId, Long restricted, String restrictionReason) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        if (roomOpt.isEmpty()) {
            return Optional.empty();
        }
        
        Room room = roomOpt.get();
        room.setRestricted(restricted);
        
        // room.setRestrictionReason(restrictionReason);
        
        return Optional.of(roomRepository.save(room));
    }
    
    /**
     * get all restricted rooms
     */
    public List<Room> getAllBookableRooms() {
        return roomRepository.findBookableRooms();
    }

    /**
     * check if a room is bookable
     * @param roomId 
     * @return 
     */
    public Map<String, Object> checkRoomBookable(Long roomId) {
        Optional<Room> roomOpt = roomRepository.findById(roomId);
        Map<String, Object> result = new HashMap<>();
        
        if (roomOpt.isEmpty()) {
            result.put("exists", false);
            result.put("message", "room not found");
            return result;
        }
        
        Room room = roomOpt.get();
        result.put("exists", true);
        result.put("roomId", room.getId());
        result.put("roomName", room.getName());
        
        // check if room is available
        if (!room.getAvailable()) {
            result.put("bookable", false);
            result.put("message", "room is under maintenance, not bookable");
            return result;
        }
        
        // check if room is restricted
//        if (room.getRestricted() > 0) {
//            result.put("bookable", false);
//            result.put("message", "room is used for staff, not bookable");
//            return result;
//        }
        
        result.put("bookable", true);
        result.put("message", "room is bookable");
        return result;
    }
}