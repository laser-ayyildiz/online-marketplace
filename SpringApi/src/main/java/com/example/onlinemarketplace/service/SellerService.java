package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.dto.response.SellerDto;
import com.example.onlinemarketplace.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SellerService {

    List<SellerDto> getAllSellers();

    Page<SellerDto> getAllSellersPageable(Pageable pageable);

    Seller findByCompanyName(String companyName);

    SellerDto findByCompanyNameDto(String companyName);

    Seller createNewSeller(Seller seller);

    Seller updateSeller(Seller seller);

    boolean deleteSeller(String companyName);

    boolean existsById(Seller seller);

    boolean existsByCompanyName(String companyName);

    Page<SellerDto> findAllByCompanyNameContains(String name, Pageable paging);

    List<ProductDto> getAllProducts(String companyName);
}
