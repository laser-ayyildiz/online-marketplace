package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.request.SellerRequest;
import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.dto.response.SellerDto;
import com.example.onlinemarketplace.model.Seller;
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

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/seller")
public class SellerController {

    private final SellerService sellerService;

    @GetMapping
    public ResponseEntity<Page<SellerDto>> getPageable(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<SellerDto> sellerDto = sellerService.getAllSellersPageable(paging);
        return new ResponseEntity<>(sellerDto, HttpStatus.OK);
    }

    @GetMapping("/find")
    public ResponseEntity<Page<SellerDto>> findByNameContains(
            @RequestParam String name,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "12") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<SellerDto> sellerDto = sellerService.findAllByCompanyNameContains(name, paging);
        return new ResponseEntity<>(sellerDto, HttpStatus.OK);
    }

    @GetMapping("/company")
    public ResponseEntity findByName(
            @RequestParam String name
    ) {
        SellerDto sellerDto = sellerService.findByCompanyNameDto(name);
        return new ResponseEntity<>(sellerDto, HttpStatus.OK);
    }

    @GetMapping("/products")
    public ResponseEntity findAllProducts(
            @RequestParam String name
    ) {
        List<ProductDto> products = sellerService.getAllProducts(name);
        return new ResponseEntity<>(products, HttpStatus.OK);
    }

    @PostMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Seller create(@Valid @RequestBody Seller seller) {
        return sellerService.createNewSeller(seller);
    }

    @DeleteMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean delete(@Valid @RequestBody SellerRequest seller) {
        return sellerService.deleteSeller(seller.getCompanyName());
    }

    @PutMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public Seller update(@Valid @RequestBody Seller seller) {
        return sellerService.updateSeller(seller);
    }
}
