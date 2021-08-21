package com.example.onlinemarketplace.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class UserDto {

    private String username;

    private String email;

    private String address;

    private String city;

    private String state;

    private Date createdAt;

    private Date updatedAt;
}
