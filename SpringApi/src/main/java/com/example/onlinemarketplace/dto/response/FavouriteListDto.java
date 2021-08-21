package com.example.onlinemarketplace.dto.response;

import lombok.Getter;
import lombok.Setter;

import java.util.Date;


@Getter
@Setter
public class FavouriteListDto {

    private String username;

    private String productName;

    private String companyName;

    private Date createdAt;
}
