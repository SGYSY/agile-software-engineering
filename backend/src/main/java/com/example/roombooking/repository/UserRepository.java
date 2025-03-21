package com.example.roombooking.repository;

import com.example.roombooking.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);
    boolean existsByUsername(String username);
    boolean existsByEmail(String email);
    @Query("SELECT COUNT(u) FROM User u WHERE u.username = :username")
    long countByUsername(@Param("username") String username);

    Optional<User> findByUsernameAndPassword(String username, String password_hash);

}