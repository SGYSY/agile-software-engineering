package com.example.roombooking.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.context.request.WebRequest;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Object> handleGlobalException(Exception ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("exceptionType", ex.getClass().getName());
        
        // Get and add the first part of the stack trace to help debugging
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace != null && stackTrace.length > 0) {
            StringBuilder trace = new StringBuilder();
            for (int i = 0; i < Math.min(5, stackTrace.length); i++) {
                trace.append(stackTrace[i].toString()).append("\n");
            }
            body.put("trace", trace.toString());
        }
        
        body.put("path", request.getDescription(false));
        
        // Print the entire error to the console
        ex.printStackTrace();
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    
    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Object> handleIllegalArgumentException(IllegalArgumentException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", ex.getMessage());
        body.put("path", request.getDescription(false));
        
        return new ResponseEntity<>(body, HttpStatus.BAD_REQUEST);
    }
    
    @ExceptionHandler(java.util.ConcurrentModificationException.class)
    public ResponseEntity<Object> handleConcurrentModificationException(
            java.util.ConcurrentModificationException ex, WebRequest request) {
        Map<String, Object> body = new HashMap<>();
        body.put("timestamp", LocalDateTime.now());
        body.put("message", "A circular reference was detected during JSON serialization. Please contact the developer to fix this issue.");
        body.put("exceptionDetails", ex.getMessage());
        body.put("path", request.getDescription(false));
        
        ex.printStackTrace(); // Prints a stack trace to the console
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}