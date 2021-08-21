package com.example.onlinemarketplace.dto.response;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

import java.util.Date;

@Getter
@Setter
public class BlackListDto {

    private String username;

    private String companyName;

    private String sellerEmail;

    private Date createdAt;
}
