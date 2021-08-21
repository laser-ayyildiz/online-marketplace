package com.example.onlinemarketplace.dto.request;

import com.example.onlinemarketplace.model.Seller;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Getter
@Setter
public class ProductRequest {

    @NotBlank
    @NotNull
    private String productName;

    private String companyName;

    private Seller seller;
}
