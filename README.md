# **DIICSU Room Booking System - Team Search X Repository**

## **Project Overview**

The **DIICSU Room Booking System** is a comprehensive full-stack application designed to manage the classroom reservation process for educational institutions. The system supports multiple user roles (**administrators, faculty, students, etc.**) and provides **classroom resource management, online booking, conflict detection, notifications, and usage statistics**.

---

## **Technology Stack**

### **Backend**

- **Framework:** Spring Boot 3.x
- **ORM:** Spring Data JPA
- **Security:** Spring Security
- **JDK Version:** Java 17
- **Build Tool:** Maven

### **Frontend**

- **Framework:** React.js
- **UI Library:** Ant Design (configured with English UI)
- **Routing:** React Router
- **Build Tool:** Create React App

### **Database**

- **Database System:** MySQL 9.0.1
- **Character Set:** UTF-8 (`utf8mb4`)

---

## **System Architecture**

The system follows a standard **three-tier architecture**:

1. **Presentation Layer (Frontend)** - React application handling the user interface and interactions.
2. **Business Logic Layer (Backend)** - Spring Boot application processing business logic.
3. **Data Access Layer** - JPA interacting with the MySQL database.

---

## **Features**

### **User Management**

- Role-based access control system
- Support for five roles: **Administrator, Faculty, Student, IT Team, and Facilities Management**
- Fine-grained permission control system

### **Classroom Management**

- Classroom information maintenance (name, location, capacity, etc.)
- Classroom equipment management
- Classroom availability status management

### **Booking Management**

- Online classroom reservation
- Booking status tracking (**pending, confirmed, cancelled**)
- Booking conflict detection
- Personal booking history query

### **Schedule Viewing**

- View booking schedule by classroom
- View all classroom schedules by day
- Administrator schedule management interface

### **Notification System**

- Email notifications
- SMS notifications
- Booking confirmations and reminders

### **Statistics & Reports**

- Classroom utilization statistics
- Booking cancellation records
- System usage logs

---

## **Database Structure**

The system uses the **`diicsu_room_booking_system_v2`** database, which includes the following main tables:

- **`users`** - User information
- **`roles`** - User roles
- **`permissions`** - System permissions
- **`role_permissions`** - Role-permission associations
- **`rooms`** - Classroom information
- **`room_equipment`** - Classroom equipment
- **`bookings`** - Reservation records
- **`notifications`** - Notification records
- **`logs`** - System logs
- **`schedule`** - Scheduling table

---

## **Project Structure**

agile-software-engineering/
├── backend/                   # Spring Boot backend
│   ├── src/main/java/
│   │   └── com/example/roombooking/
│   │       ├── controller/    # REST controllers
│   │       ├── entity/        # JPA entities
│   │       ├── repository/    # Data access layer
│   │       ├── service/       # Business logic layer
│   │       ├── config/        # Configuration classes
│   │       └── RoomBookingApplication.java
│   ├── src/main/resources/
│   │   └── application.properties
│   └── pom.xml
├── frontend-web/              # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/        # Shared components
│   │   ├── pages/             # Page components
│   │   ├── services/          # API services
│   │   ├── utils/             # Utility functions
│   │   ├── App.js             # Application entry
│   │   └── index.js
│   └── package.json
└── database/                  # Database scripts
    └── diicsu_room_booking.sql

### **Installation & Running**

#### **Database Setup**

1. Install **MySQL 9.0+**
2. Execute `database/diicsu_room_booking.sql` script to create the database and tables.

#### **Backend Setup**

1. Ensure **JDK 17+** and **Maven** are installed.
2. Configure the database connection in `backend/src/main/resources/application.properties`.
3. Run the backend server:
   ```bash
   cd backend
   mvn spring-boot:run
   ```
4. Backend service will start at `http://localhost:8080`

#### **Frontend Setup**

1. Ensure **Node.js** and **npm** are installed.
2. Run the frontend application:
   ```bash
   cd frontend-web
   npm install
   npm start
   ```
3. Frontend application will start at `http://localhost:3000`

---

## **User Roles**

| Role                            | Permissions                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| **Administrator**         | Full access, manages users, classrooms, and bookings         |
| **Faculty**               | Can book classrooms and manage their own reservations        |
| **Student**               | Can book classrooms, view, and cancel their own reservations |
| **IT Team**               | Maintains the user system                                    |
| **Facilities Management** | Manages classroom resources and equipment                    |

---

## **Main Pages**

- **Login Page** - User authentication entry.
- **Home Page** - System dashboard.
- **Booking Page** - Create new reservations.
- **My Bookings** - View personal booking history.
- **Classroom Schedule** - View booking schedule for specific classrooms.
- **Daily Schedule** - View daily booking status for all classrooms.
- **Admin Pages** - Administrator-specific functionality.

---

## **Development Guide**

### **Backend Development**

- Follow **Spring Boot best practices**.
- Use **JPA Repository pattern** for data access.
- Implement **logging and permission control** based on AOP.

### **Frontend Development**

- Use **React functional components and Hooks**.
- Use **React Router** for routing control.
- Build UI with **Ant Design** component library.

---

## **Security Considerations**

- Implement **authentication and authorization** with **Spring Security**.
- Store **encrypted passwords**.
- Use **role-based access control**.
- Protect API endpoints from unauthorized access.

---

## **Project Maintenance**

- Use **Git** for version control.
- Follow **Agile development methodology**.
- Use **Test-Driven Development (TDD)** to ensure code quality.

---

## **System Requirements**

- **Java 17** or higher
- **Node.js 14** or higher
- **MySQL 9.0** or higher
- **Modern browsers** (Chrome, Firefox, Edge, etc.)
- **Stable network connection**
