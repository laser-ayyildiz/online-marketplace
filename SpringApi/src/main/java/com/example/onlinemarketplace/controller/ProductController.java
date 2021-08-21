package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.service.ProductService;
import com.example.onlinemarketplace.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/product")
public class ProductController {

    private final ProductService productService;
    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<Page<ProductDto>> getPageable(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<ProductDto> productsDto = productService.getAllProductsPageable(paging);
        return new ResponseEntity<>(productsDto, HttpStatus.OK);
    }

    @GetMapping("/all")
    public List<ProductDto> getAll() {
        return productService.getAllProducts();
    }

    @GetMapping("/find")
    public ProductDto find(
            @RequestParam String productName,
            @RequestParam String companyName
    ) {
        Objects.requireNonNull(productName, "product name can not be null");
        Objects.requireNonNull(companyName, "company name can not be null");
        Seller seller = sellerService.findByCompanyName(companyName);
        return productService.findByNameAndSeller(productName, seller);
    }

    @GetMapping("/list")
    public ResponseEntity<Page<ProductDto>> getPageable(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<ProductDto> productsDto = productService.getListByNameLike(name, paging);
        return new ResponseEntity<>(productsDto, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Product create(@Valid @RequestBody Product product) {
        return productService.createNewProduct(product);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean delete(@Valid @RequestBody Product product) {
        return productService.deleteProduct(product);
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Product update(@Valid @RequestBody Product product) {
        return productService.updateProduct(product);
    }
}
