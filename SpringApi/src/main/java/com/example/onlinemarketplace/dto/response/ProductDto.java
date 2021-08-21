package com.example.onlinemarketplace.dto.response;

import lombok.Data;

@Data
public class ProductDto {

    private Long id;

    private String name;

    private Float price;

    private Float shippingCost;

    private String description;

    private Boolean isAvailable = true;

    private String picturePath;

    private String sellerName;

    private String category;

    private String baseCategory;

    private Integer discountRate;
}
