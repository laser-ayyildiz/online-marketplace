package com.example.onlinemarketplace.exception;

import java.time.LocalDateTime;

public class ExceptionResponse {
    private LocalDateTime timestamp;
    private String message;
    private int statusCode;
    private String path;

    public ExceptionResponse() {
    }

    public ExceptionResponse(LocalDateTime timestamp, String message, int statusCode, String path) {
        this.timestamp = timestamp;
        this.message = message;
        this.statusCode = statusCode;
        this.path = path;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public int getStatusCode() {
        return statusCode;
    }

    public void setStatusCode(int statusCode) {
        this.statusCode = statusCode;
    }

    public String getPath() {
        return path;
    }

    public void setPath(String path) {
        this.path = path;
    }
}