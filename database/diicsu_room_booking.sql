-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- host: 127.0.0.1
-- date 2025-03-20 11:57:24

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
--  `diicsu_room_booking_system_v4.1`
--
DROP DATABASE IF EXISTS `diicsu_room_booking_system_v4_1`;
CREATE DATABASE IF NOT EXISTS `diicsu_room_booking_system_v4_1` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `diicsu_room_booking_system_v4_1`;

-- --------------------------------------------------------

--
-- table struct `bookings`
--

DROP TABLE IF EXISTS `bookings`;

-- create booking table
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL AUTO_INCREMENT,
  `user_id` int NOT NULL,
  `room_id` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `status` varchar(20) NOT NULL,
  `conflict_detected` boolean DEFAULT false,
  `week_number` int NOT NULL,
  `day_of_week` int NOT NULL,
  PRIMARY KEY (`booking_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


CREATE TABLE weeks (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `week_number` INT NOT NULL,
    `start_date` DATE NOT NULL,
    `end_date` DATE NOT NULL, 
    `description` VARCHAR(100) 
);
--
-- store data `bookings`
--
INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `start_time`, `end_time`, `status`, `conflict_detected`, `week_number`, `day_of_week`) VALUES
(1, 1, 9, '09:00:00', '11:00:00', 'confirmed', 0, 3, 3),
(2, 2, 8, '02:00:00', '04:00:00', 'pending', 0, 3, 4),
(31, 2, 10, '02:00:00', '04:00:00', 'cancelled', 0, 3, 5);

DROP TRIGGER IF EXISTS `check_booking_conflict`;
DELIMITER $$
CREATE TRIGGER `check_booking_conflict` BEFORE INSERT ON `bookings` FOR EACH ROW BEGIN
    IF EXISTS (
        SELECT 1 FROM schedule s
        JOIN week w ON s.week_id = w.id
        JOIN schedule_times st ON s.period = st.period
        WHERE w.room_id = NEW.room_id
        AND w.week_number = NEW.week_number  -- 同一周
        AND CONCAT(DATE_ADD('2025-02-24', INTERVAL (w.week_number - 1) WEEK), ' ', st.start_time) < NEW.end_time
        AND CONCAT(DATE_ADD('2025-02-24', INTERVAL (w.week_number - 1) WEEK), ' ', st.end_time) > NEW.start_time
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'There are already courses scheduled for this time period and it cannot be booked';
    END IF;
END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- table struct `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `log_id` bigint NOT NULL,
  `book_type` enum('usage','cancellation','utilization') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'usage',
  `booking_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `booking_data` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `logs`
--

INSERT INTO `logs` (`log_id`, `book_type`, `booking_at`, `booking_data`) VALUES
(1, 'usage', '2025-03-03 07:29:43', 'Room A was booked 3 times in the last week.');

-- --------------------------------------------------------

--
-- table struct `notifications`
--

DROP TABLE IF EXISTS `notifications`;
CREATE TABLE `notifications` (
  `notification_id` bigint NOT NULL,
  `booking_id` int DEFAULT NULL,
  `notification_type` enum('email','sms') DEFAULT NULL,
  `message` varchar(255) DEFAULT NULL,
  `status` enum('sent','pending','failed') DEFAULT 'pending'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `notifications`
--

INSERT INTO `notifications` (`notification_id`, `booking_id`, `notification_type`, `message`, `status`) VALUES
(1, 1, 'email', 'Your room booking is confirmed. Room details: Room A, 9 AM to 11 AM.', 'pending'),
(2, 1, 'sms', 'Your room booking is confirmed. Room details: Room A, 9 AM to 11 AM.', 'pending'),
(53, 31, 'email', 'Your room booking has been pending. Room details: null, from 2025-03-07T10:00 to 2025-03-07T12:00.', 'pending'),
(54, 31, 'sms', 'Your room booking has been pending. Room: null', 'pending');

-- --------------------------------------------------------

--
-- table struct `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permission_id` int NOT NULL,
  `permission_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `permissions`
--

INSERT INTO `permissions` (`permission_id`, `permission_name`) VALUES
(1, 'Book Room'),
(2, 'Modify Bookings'),
(3, 'Delete Bookings'),
(4, 'Manage Rooms'),
(5, 'Approve Reservations'),
(6, 'Manage User Permissions'),
(7, 'Maintenance User System'),
(8, 'Manage users');

-- --------------------------------------------------------

--
-- table struct `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Administrator'),
(2, 'Faculty'),
(3, 'Student'),
(4, 'IT Team'),
(5, 'Facilities Management');

-- --------------------------------------------------------

--
-- table struct `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `role_permissions`
--

INSERT INTO `role_permissions` (`role_id`, `permission_id`) VALUES
(1, 1),
(2, 1),
(3, 1),
(1, 2),
(2, 2),
(3, 2),
(1, 3),
(2, 3),
(3, 3),
(1, 4),
(5, 4),
(1, 5),
(1, 6),
(4, 7),
(1, 8);

-- --------------------------------------------------------

--
-- table struct `rooms`
--

DROP TABLE IF EXISTS `rooms`;
CREATE TABLE `rooms` (
  `room_id` int NOT NULL,
  `room_name` varchar(255) NOT NULL,
  `capacity` int DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `available` tinyint(1) DEFAULT '1',
  `restricted` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `capacity`, `location`, `available`, `restricted`) VALUES
(8, 'A207', 60, 'Building A, Floor 2, 207', 1, 0),
(9, 'A206', 60, 'Building A, Floor 2, 206', 1, 0),
(10, 'A208', 60, 'Building A, Floor 2, 208', 1, 0),
(11, 'A310', 90, 'Building A, Floor 3, 310', 1, 0),
(12, 'A311', 90, 'Building A, Floor 3, 311', 1, 0),
(13, 'A410', 90, 'Building A, Floor 4, 410', 1, 0),
(14, 'Foreign Language Network Building 101', 20, 'Foreign Language Network Building, Floor 1, 101', 1, 0),
(15, 'Foreign Language Network Building 102', 20, 'Foreign Language Network Building, Floor 1, 102', 1, 0),
(16, 'Foreign Language Network Building 103', 20, 'Foreign Language Network Building, Floor 1, 103', 1, 0),
(17, 'Foreign Language Network Building 104', 20, 'Foreign Language Network Building, Floor 1, 104', 1, 0),
(18, 'Foreign Language Network Building 105', 20, 'Foreign Language Network Building, Floor 1, 105', 1, 0),
(19, 'Foreign Language Network Building 106', 20, 'Foreign Language Network Building, Floor 1, 106', 1, 0),
(20, 'Foreign Language Network Building 107', 20, 'Foreign Language Network Building, Floor 1, 107', 1, 0),
(21, 'Foreign Language Network Building 108', 20, 'Foreign Language Network Building, Floor 1, 108', 1, 0),
(22, 'Foreign Language Network Building 116', 20, 'Foreign Language Network Building, Floor 1, 116', 1, 0),
(23, 'Foreign Language Network Building 117', 20, 'Foreign Language Network Building, Floor 1, 117', 1, 0),
(24, 'Foreign Language Network Building 118', 20, 'Foreign Language Network Building, Floor 1, 118', 1, 0),
(25, 'Foreign Language Network Building 119', 20, 'Foreign Language Network Building, Floor 1, 119', 1, 0),
(26, 'Foreign Language Network Building 635', 20, 'Foreign Language Network Building, Floor 6, 635', 1, 0);

-- --------------------------------------------------------

--
-- table struct `room_issue`
--

DROP TABLE IF EXISTS `room_issue`;
CREATE TABLE `room_issue` (
  `issue_id` bigint NOT NULL,
  `room_id` int DEFAULT NULL,
  `issue_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `room_issue`
--

INSERT INTO `room_issue` (`issue_id`, `room_id`, `issue_name`, `description`) VALUES
(1, 9, 'Windows broken', NULL),
(2, 8, 'Tables broken', ''),
(3, 10, 'Projector broken', NULL),
(4, 11, 'Power interruption', NULL),
(5, 12, 'Whiteboard broken', NULL),
(6, 13, 'No WIFI signal', NULL);

-- --------------------------------------------------------

--
-- table struct `room_permission`
--

DROP TABLE IF EXISTS `room_permission`;
CREATE TABLE `room_permission` (
  `id` int NOT NULL,
  `room_id` int NOT NULL,
  `role_id` int DEFAULT NULL,
  `user_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data  `room_permission`
--

INSERT INTO `room_permission` (`id`, `room_id`, `role_id`, `user_id`) VALUES
(1, 9, 3, NULL),
(2, 9, 2, NULL),
(3, 8, 2, NULL),
(4, 8, 3, NULL),
(5, 10, 2, NULL),
(6, 10, 3, NULL),
(7, 11, 2, NULL),
(8, 11, 3, NULL),
(9, 12, 2, NULL),
(10, 12, 3, NULL),
(11, 13, 2, NULL),
(12, 13, 3, NULL);

-- --------------------------------------------------------

--
-- view `room_schedule`
--
DROP VIEW IF EXISTS `room_schedule`;
CREATE TABLE `room_schedule` (
`end_time` time
,`event_name` varchar(255)
,`event_type` varchar(7)
,`group_id` varchar(50)
,`instructor` varchar(255)
,`room_id` int
,`start_time` time
,`week_number` int
,`weekday` bigint
);

-- --------------------------------------------------------

--
-- table struct `schedule`
--

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `schedule_id` int NOT NULL,
  `room_id` int NOT NULL,
  `week_number` int NOT NULL,
  `weekday` int NOT NULL,
  `period` int NOT NULL,
  `start_time` time NOT NULL,
  `end_time` time NOT NULL,
  `course_name` varchar(255) NOT NULL,
  `instructor` varchar(255) DEFAULT NULL,
  `group_id` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;


--
-- table struct `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `school_number` int DEFAULT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- store data `users`
--

INSERT INTO `users` (`user_id`, `school_number`, `username`, `password_hash`, `first_name`, `last_name`, `email`, `phone_number`, `role_id`) VALUES
(1, NULL, 'admin1', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'Admin', 'One', 'admin1@example.com', '1234567890', 1),
(2, NULL, 'faculty1', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'Faculty', 'One', 'faculty1@example.com', '2345678901', 2),
(3, NULL, 'student1', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'Student', 'One', 'student1@example.com', '3456789012', 3),
(4, NULL, 'itteam1', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'IT', 'Team', 'itteam1@example.com', '4567890123', 4),
(5, NULL, 'facilities1', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'Facilities', 'Manager', 'facilities1@example.com', '5678901234', 5),
(11, 251234, 'john_doe', '$2a$10$QSFLp5//OV/kHkjnMAMa6ef6qRoUEGiCsWCW4SKwgWNVbeoUR//Su', 'John', 'Doe', 'john.doe@example.com', '1234567890', NULL);

-- --------------------------------------------------------

--
-- view struct `room_schedule`
--
DROP TABLE IF EXISTS `room_schedule`;

DROP VIEW IF EXISTS `room_schedule`;
CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `room_schedule`  AS SELECT `schedule`.`room_id` AS `room_id`, `schedule`.`week_number` AS `week_number`, `schedule`.`weekday` AS `weekday`, `schedule`.`start_time` AS `start_time`, `schedule`.`end_time` AS `end_time`, `schedule`.`course_name` AS `event_name`, `schedule`.`instructor` AS `instructor`, `schedule`.`group_id` AS `group_id`, 'course' AS `event_type` FROM `schedule`union select `bookings`.`room_id` AS `room_id`,`bookings`.`week_number` AS `week_number`,(weekday(`bookings`.`start_time`) + 1) AS `weekday`,cast(`bookings`.`start_time` as time) AS `start_time`,cast(`bookings`.`end_time` as time) AS `end_time`,concat('Booking by User ',`bookings`.`user_id`) AS `event_name`,NULL AS `instructor`,NULL AS `group_id`,'booking' AS `event_type` from `bookings`  ;

--
-- store table index
--

--
-- table index `bookings`
--
ALTER TABLE `bookings`
  -- ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- table index `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`);

--
-- table index `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- table index `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);

--
-- table index `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- table index `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- table index `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_name` (`room_name`);

--
-- table index `room_issue`
--
ALTER TABLE `room_issue`
  ADD PRIMARY KEY (`issue_id`),
  ADD KEY `room_id` (`room_id`);

--
-- table index `room_permission`
--
ALTER TABLE `room_permission`
  ADD PRIMARY KEY (`id`),
  ADD KEY `room_id` (`room_id`),
  ADD KEY `role_id` (`role_id`),
  ADD KEY `user_id` (`user_id`);

--
-- table index `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `room_id` (`room_id`);

--
-- table index `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- use AUTO_INCREMENT
--

--
-- use table AUTO_INCREMENT `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- use table AUTO_INCREMENT `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- use table AUTO_INCREMENT `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- use table AUTO_INCREMENT `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=10;

--
-- use table AUTO_INCREMENT `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- use table AUTO_INCREMENT `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- use table AUTO_INCREMENT `room_issue`
--
ALTER TABLE `room_issue`
  MODIFY `issue_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- use table AUTO_INCREMENT `room_permission`
--
ALTER TABLE `room_permission`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=14;

--
-- use table AUTO_INCREMENT `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=15355;

--
-- use table AUTO_INCREMENT `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=12;

--
-- retrict table
--

--
-- retrict table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- retrict table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`);

--
-- retrict table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`);

--
-- retrict table `room_issue`
--
ALTER TABLE `room_issue`
  ADD CONSTRAINT `room_issue_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- retrict table `room_permission`
--
ALTER TABLE `room_permission`
  ADD CONSTRAINT `room_permission_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`) ON DELETE CASCADE,
  ADD CONSTRAINT `room_permission_ibfk_2` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`) ON DELETE SET NULL,
  ADD CONSTRAINT `room_permission_ibfk_3` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`) ON DELETE SET NULL;

--
-- retrict table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- retrict table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

DELIMITER //
DROP PROCEDURE IF EXISTS generate_weeks;
CREATE PROCEDURE generate_weeks()
BEGIN
    DECLARE i INT DEFAULT 2;
    DECLARE start_dt DATE DEFAULT '2025-02-24';
    
    WHILE i <= 22 DO
        INSERT INTO weeks (week_number, start_date, end_date, description)
        VALUES (i, start_dt, DATE_ADD(start_dt, INTERVAL 6 DAY), CONCAT('The ', i, ' teaching week'));
        
        SET start_dt = DATE_ADD(start_dt, INTERVAL 7 DAY);
        SET i = i + 1;
    END WHILE;
END //
DELIMITER ;

INSERT INTO weeks (week_number, start_date, end_date, description)
VALUES (1, '2025-02-17', '2024-02-23', 'The 1 teaching week');
CALL generate_weeks();


DROP TRIGGER IF EXISTS `check_booking_conflict`;

-- Create a new trigger
DELIMITER $$
CREATE TRIGGER `check_booking_conflict` BEFORE INSERT ON `bookings` 
FOR EACH ROW 
BEGIN
    -- Check if there is any conflict with existing courses
    IF EXISTS (
        SELECT 1 FROM schedule 
        WHERE room_id = NEW.room_id
        AND week_number = NEW.week_number  
        AND weekday = NEW.day_of_week
        AND (
            (start_time < NEW.end_time AND end_time > NEW.start_time)
            OR (start_time = NEW.start_time)
            OR (end_time = NEW.end_time)
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'There are already courses scheduled for this time period and it cannot be booked';
    END IF;

    -- 检查是否与其他预订时间冲突
    IF EXISTS (
        SELECT 1 FROM bookings
        WHERE room_id = NEW.room_id
        AND week_number = NEW.week_number
        AND day_of_week = NEW.day_of_week
        AND status != 'cancelled'
        AND (
            (start_time < NEW.end_time AND end_time > NEW.start_time)
            OR (start_time = NEW.start_time)
            OR (end_time = NEW.end_time)
        )
    ) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'This time slot is already booked, please select another time';
    END IF;
END$$
DELIMITER ;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;