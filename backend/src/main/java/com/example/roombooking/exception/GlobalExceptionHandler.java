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
        
        // 获取并添加堆栈跟踪的第一部分以帮助调试
        StackTraceElement[] stackTrace = ex.getStackTrace();
        if (stackTrace != null && stackTrace.length > 0) {
            StringBuilder trace = new StringBuilder();
            for (int i = 0; i < Math.min(5, stackTrace.length); i++) {
                trace.append(stackTrace[i].toString()).append("\n");
            }
            body.put("trace", trace.toString());
        }
        
        body.put("path", request.getDescription(false));
        
        // 打印整个错误到控制台
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
        body.put("message", "检测到 JSON 序列化中的循环引用。请联系开发人员修复此问题。");
        body.put("exceptionDetails", ex.getMessage());
        body.put("path", request.getDescription(false));
        
        ex.printStackTrace(); // 打印堆栈跟踪到控制台
        
        return new ResponseEntity<>(body, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}