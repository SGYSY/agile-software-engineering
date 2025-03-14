-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- host: 127.0.0.1
-- date: 2025-03-11 11:15:45
-- server version: 9.0.1
-- PHP version: 8.2.12

DROP DATABASE IF EXISTS `diicsu_room_booking_system_v2`;

CREATE DATABASE IF NOT EXISTS `diicsu_room_booking_system_v2` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci;
USE `diicsu_room_booking_system_v2`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- database: `diicsu_room_booking_system_v2`

-- --------------------------------------------------------

--
-- table structure for `bookings`
--

DROP TABLE IF EXISTS `bookings`;
CREATE TABLE `bookings` (
  `booking_id` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `room_id` int DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `status` enum('pending','confirmed','cancelled') DEFAULT 'pending',
  `conflict_detected` tinyint(1) DEFAULT '0'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `bookings`
--

INSERT INTO `bookings` (`booking_id`, `user_id`, `room_id`, `start_time`, `end_time`, `status`, `conflict_detected`) VALUES
(1, 1, 1, '2025-03-05 09:00:00', '2025-03-05 11:00:00', 'confirmed', 0),
(2, 2, 2, '2025-03-06 02:00:00', '2025-03-06 04:00:00', 'pending', 0),
(31, 2, 2, '2025-03-07 02:00:00', '2025-03-07 04:00:00', 'cancelled', 0);

-- --------------------------------------------------------

--
-- table structure for `logs`
--

DROP TABLE IF EXISTS `logs`;
CREATE TABLE `logs` (
  `log_id` bigint NOT NULL,
  `book_type` enum('usage','cancellation','utilization') CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT 'usage',
  `booking_at` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  `booking_data` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `logs`
--

INSERT INTO `logs` (`log_id`, `book_type`, `booking_at`, `booking_data`) VALUES
(1, 'usage', '2025-03-03 07:29:43', 'Room A was booked 3 times in the last week.');

-- --------------------------------------------------------

--
-- table structure for `notifications`
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
-- dumping data for table `notifications`
--

INSERT INTO `notifications` (`notification_id`, `booking_id`, `notification_type`, `message`, `status`) VALUES
(1, 1, 'email', 'Your room booking is confirmed. Room details: Room A, 9 AM to 11 AM.', 'pending'),
(2, 1, 'sms', 'Your room booking is confirmed. Room details: Room A, 9 AM to 11 AM.', 'pending'),
(53, 31, 'email', 'Your room booking has been pending. Room details: null, from 2025-03-07T10:00 to 2025-03-07T12:00.', 'pending'),
(54, 31, 'sms', 'Your room booking has been pending. Room: null', 'pending');

-- --------------------------------------------------------

--
-- table structure for `permissions`
--

DROP TABLE IF EXISTS `permissions`;
CREATE TABLE `permissions` (
  `permission_id` int NOT NULL,
  `permission_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `permissions`
--

INSERT INTO `permissions` (`permission_id`, `permission_name`) VALUES
(1, 'Book Room'),
(2, 'Modify Bookings'),
(3, 'Delete Bookings'),
(4, 'Manage Rooms'),
(5, 'Approve Reservations'),
(6, 'Manage User Permissions'),
(7, 'Maintenance User System');

-- --------------------------------------------------------

--
-- table structure for `roles`
--

DROP TABLE IF EXISTS `roles`;
CREATE TABLE `roles` (
  `role_id` int NOT NULL,
  `role_name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `roles`
--

INSERT INTO `roles` (`role_id`, `role_name`) VALUES
(1, 'Administrator'),
(2, 'Faculty'),
(3, 'Student'),
(4, 'IT Team'),
(5, 'Facilities Management');

-- --------------------------------------------------------

--
-- table structure for `role_permissions`
--

DROP TABLE IF EXISTS `role_permissions`;
CREATE TABLE `role_permissions` (
  `role_id` int NOT NULL,
  `permission_id` int NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `role_permissions`
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
(4, 7);

-- --------------------------------------------------------

--
-- table structure for `rooms`
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
-- dumping data for table `rooms`
--

INSERT INTO `rooms` (`room_id`, `room_name`, `capacity`, `location`, `available`, `restricted`) VALUES
(1, 'Room A', 20, 'Building 1, Floor 2', 1, 0),
(2, 'Room B', 50, 'Building 2, Floor 1', 1, 0),
(3, 'Room 634', 30, 'Building 1, Floor 3', 1, 0);

-- --------------------------------------------------------

--
-- table structure for `room_equipment`
--

DROP TABLE IF EXISTS `room_equipment`;
CREATE TABLE `room_equipment` (
  `equipment_id` bigint NOT NULL,
  `room_id` int DEFAULT NULL,
  `equipment_name` varchar(255) DEFAULT NULL,
  `description` varchar(255) DEFAULT NULL,
  `is_available` bit(1) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `room_equipment`
--

INSERT INTO `room_equipment` (`equipment_id`, `room_id`, `equipment_name`, `description`, `is_available`) VALUES
(1, 1, 'Projector', NULL, NULL),
(2, 1, 'Whiteboard', NULL, NULL),
(3, 2, 'Projector', NULL, NULL),
(4, 2, 'Conference Phone', NULL, NULL),
(5, 3, 'Whiteboard', NULL, NULL),
(6, 3, 'Conference Phone', NULL, NULL);

-- --------------------------------------------------------

--
-- table structure for `schedule`
--

DROP TABLE IF EXISTS `schedule`;
CREATE TABLE `schedule` (
  `schedule_id` bigint NOT NULL,
  `room_id` int DEFAULT NULL,
  `start_time` datetime DEFAULT NULL,
  `end_time` datetime DEFAULT NULL,
  `usage` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `schedule`
--

INSERT INTO `schedule` (`schedule_id`, `room_id`, `start_time`, `end_time`, `usage`) VALUES
(1, 1, '2025-03-05 09:00:00', '2025-03-05 11:00:00', 'None'),
(2, 2, '2025-03-05 11:00:00', '2025-03-05 13:00:00', 'None');

-- --------------------------------------------------------

--
-- table structure for `users`
--

DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `user_id` int NOT NULL,
  `username` varchar(255) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `first_name` varchar(255) DEFAULT NULL,
  `last_name` varchar(255) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(255) DEFAULT NULL,
  `role_id` int DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

--
-- dumping data for table `users`
--

INSERT INTO `users` (`user_id`, `username`, `password_hash`, `first_name`, `last_name`, `email`, `phone_number`, `role_id`) VALUES
(1, 'admin1', '123456', 'Admin', 'One', 'admin1@example.com', '1234567890', 1),
(2, 'faculty1', '123456', 'Faculty', 'One', 'faculty1@example.com', '2345678901', 2),
(3, 'student1', '123456', 'Student', 'One', 'student1@example.com', '3456789012', 3),
(4, 'itteam1', '123456', 'IT', 'Team', 'itteam1@example.com', '4567890123', 4),
(5, 'facilities1', '123456', 'Facilities', 'Manager', 'facilities1@example.com', '5678901234', 5);

--
-- indexes for dumped tables
--

--
-- indexes for table `bookings`
--
ALTER TABLE `bookings`
  ADD PRIMARY KEY (`booking_id`),
  ADD KEY `user_id` (`user_id`),
  ADD KEY `room_id` (`room_id`);

--
-- indexes for table `logs`
--
ALTER TABLE `logs`
  ADD PRIMARY KEY (`log_id`);

--
-- indexes for table `notifications`
--
ALTER TABLE `notifications`
  ADD PRIMARY KEY (`notification_id`),
  ADD KEY `booking_id` (`booking_id`);

--
-- indexes for table `permissions`
--
ALTER TABLE `permissions`
  ADD PRIMARY KEY (`permission_id`);

--
-- indexes for table `roles`
--
ALTER TABLE `roles`
  ADD PRIMARY KEY (`role_id`);

--
-- indexes for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD PRIMARY KEY (`role_id`,`permission_id`),
  ADD KEY `permission_id` (`permission_id`);

--
-- indexes for table `rooms`
--
ALTER TABLE `rooms`
  ADD PRIMARY KEY (`room_id`),
  ADD UNIQUE KEY `room_name` (`room_name`);

--
-- indexes for table `room_equipment`
--
ALTER TABLE `room_equipment`
  ADD PRIMARY KEY (`equipment_id`),
  ADD KEY `room_id` (`room_id`);

--
-- indexes for table `schedule`
--
ALTER TABLE `schedule`
  ADD PRIMARY KEY (`schedule_id`),
  ADD KEY `room_id` (`room_id`);

--
-- indexes for table `users`
--
ALTER TABLE `users`
  ADD PRIMARY KEY (`user_id`),
  ADD UNIQUE KEY `username` (`username`),
  ADD UNIQUE KEY `email` (`email`),
  ADD KEY `role_id` (`role_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `bookings`
--
ALTER TABLE `bookings`
  MODIFY `booking_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=38;

--
-- AUTO_INCREMENT for table `logs`
--
ALTER TABLE `logs`
  MODIFY `log_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `notifications`
--
ALTER TABLE `notifications`
  MODIFY `notification_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=68;

--
-- AUTO_INCREMENT for table `permissions`
--
ALTER TABLE `permissions`
  MODIFY `permission_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `roles`
--
ALTER TABLE `roles`
  MODIFY `role_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `rooms`
--
ALTER TABLE `rooms`
  MODIFY `room_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `room_equipment`
--
ALTER TABLE `room_equipment`
  MODIFY `equipment_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `schedule`
--
ALTER TABLE `schedule`
  MODIFY `schedule_id` bigint NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `user_id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- constraints for dumped tables
--

--
-- constraints for table `bookings`
--
ALTER TABLE `bookings`
  ADD CONSTRAINT `bookings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`user_id`),
  ADD CONSTRAINT `bookings_ibfk_2` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- constraints for table `notifications`
--
ALTER TABLE `notifications`
  ADD CONSTRAINT `notifications_ibfk_1` FOREIGN KEY (`booking_id`) REFERENCES `bookings` (`booking_id`);

--
-- constraints for table `role_permissions`
--
ALTER TABLE `role_permissions`
  ADD CONSTRAINT `role_permissions_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`),
  ADD CONSTRAINT `role_permissions_ibfk_2` FOREIGN KEY (`permission_id`) REFERENCES `permissions` (`permission_id`);

--
-- constraints for table `room_equipment`
--
ALTER TABLE `room_equipment`
  ADD CONSTRAINT `room_equipment_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- constraints for table `schedule`
--
ALTER TABLE `schedule`
  ADD CONSTRAINT `schedule_ibfk_1` FOREIGN KEY (`room_id`) REFERENCES `rooms` (`room_id`);

--
-- constraints for table `users`
--
ALTER TABLE `users`
  ADD CONSTRAINT `users_ibfk_1` FOREIGN KEY (`role_id`) REFERENCES `roles` (`role_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
