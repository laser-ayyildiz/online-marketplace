package com.example.onlinemarketplace.dto.request;

import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class SellerRequest {

    @NotBlank
    @NotNull
    private String companyName;
}
