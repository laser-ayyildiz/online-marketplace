package com.example.onlinemarketplace.dto.request;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class BlackListRequest {

    @NotNull
    @NotBlank
    private String username;

    @NotNull
    @NotBlank
    private String companyName;
}
