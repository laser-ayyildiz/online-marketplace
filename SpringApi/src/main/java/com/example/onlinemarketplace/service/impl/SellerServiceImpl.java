package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.dto.response.SellerDto;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.repository.ProductRepository;
import com.example.onlinemarketplace.repository.SellerRepository;
import com.example.onlinemarketplace.service.SellerService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class SellerServiceImpl implements SellerService {

    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final ProductServiceImpl productService;

    @Override
    public List<SellerDto> getAllSellers() {
        return (sellerRepository
                .findAll())
                .stream()
                .map(this::convertToSellerDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<SellerDto> getAllSellersPageable(Pageable paging) {
        Page<Seller> page = sellerRepository.findAll(paging);
        return new PageImpl<SellerDto>(page.getContent().stream()
                .map(this::convertToSellerDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public Seller findByCompanyName(String companyName) {
        return sellerRepository.findByCompanyName(companyName);
    }

    @Override
    public SellerDto findByCompanyNameDto(String companyName) {
        return convertToSellerDto(sellerRepository.findByCompanyName(companyName));
    }

    @Override
    public Seller createNewSeller(Seller seller) {
        Objects.requireNonNull(seller, "seller cannot be null");
        return sellerRepository.save(seller);
    }

    @Override
    public Seller updateSeller(Seller seller) {
        Objects.requireNonNull(seller, "seller cannot be null");
        return sellerRepository.save(seller);
    }

    @Override
    public boolean deleteSeller(String companyName) {
        Objects.requireNonNull(companyName, "company name cannot be null");
        Seller seller = sellerRepository.findByCompanyName(companyName);
        Long id = seller.getId();
        sellerRepository.delete(seller);
        return !sellerRepository.existsById(id);
    }

    @Override
    public boolean existsById(Seller seller) {
        Objects.requireNonNull(seller, "seller cannot be null");
        return sellerRepository.existsById(seller);
    }

    @Override
    public boolean existsByCompanyName(String companyName) {
        return sellerRepository.existsByCompanyName(companyName);
    }

    @Override
    public Page<SellerDto> findAllByCompanyNameContains(String name, Pageable paging) {
        Page<Seller> page = sellerRepository.findAllByCompanyNameContains(name, paging);
        return new PageImpl<SellerDto>(page.getContent().stream()
                .map(this::convertToSellerDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public List<ProductDto> getAllProducts(String companyName) {
        Seller seller = sellerRepository.findByCompanyName(companyName);
        List<Product> list = productRepository.getAllBySeller(seller);
        return list
                .stream()
                .map(productService::convertToProductDto)
                .collect(Collectors.toList());
    }

    private SellerDto convertToSellerDto(Seller seller) {
        SellerDto sellerDto = new SellerDto();

        //Base values
        sellerDto.setId(seller.getId());
        sellerDto.setCompanyName(seller.getCompanyName());
        sellerDto.setTaxNumber(seller.getTaxNumber());

        //Relations
        User user = seller.getUser();
        sellerDto.setUsername(user.getUsername());
        sellerDto.setEmail(user.getEmail());
        sellerDto.setAddress(user.getAddress());

        return sellerDto;
    }
}
