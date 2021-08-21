package com.example.onlinemarketplace.dto.response;

import lombok.Data;

@Data
public class SellerDto {

    private Long id;

    private String companyName;

    private String username;

    private String email;

    private String address;

    private String taxNumber;
}
