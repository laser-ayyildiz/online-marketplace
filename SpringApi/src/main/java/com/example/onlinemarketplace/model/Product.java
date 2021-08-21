package com.example.onlinemarketplace.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import lombok.*;
import lombok.experimental.SuperBuilder;
import org.hibernate.validator.constraints.Range;

import javax.persistence.*;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
@Entity
@Table(uniqueConstraints = {
        @UniqueConstraint(columnNames = {"name", "seller_id"})
})
public class Product extends BaseEntity {

    @NotNull
    @OneToOne(fetch = FetchType.LAZY, cascade = {CascadeType.MERGE})
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Seller seller;

    @NotNull
    private String name;

    @NotNull
    @Min(value = 1)
    private Float price;

    private Float shippingCost;

    @ManyToOne(fetch = FetchType.LAZY)
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"})
    private Category category;

    @Column(length = 1000)
    private String description;

    @Builder.Default
    private Boolean isAvailable = true;
    private String picturePath;

    @Range(min = 0, max = 90)
    @Builder.Default
    private Integer discountRate = 0;

}
