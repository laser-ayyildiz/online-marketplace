package com.example.onlinemarketplace.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class FavouriteListRequest {

    @NotNull
    @NotBlank
    private String username;

    @NotNull
    @NotBlank
    private String productName;

    @NotNull
    @NotBlank
    private String companyName;
}
