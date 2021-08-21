package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.exception.ProductNotFoundException;
import com.example.onlinemarketplace.model.Category;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.repository.ProductRepository;
import com.example.onlinemarketplace.service.ProductService;
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
public class ProductServiceImpl implements ProductService {
    private final ProductRepository productRepository;

    @Override
    public ProductDto findById(Long id) {
        return convertToProductDto(productRepository.getById(id));
    }

    @Override
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ProductDto> getAllProductsPageable(Pageable paging) {
        Page<Product> page = productRepository.findAll(paging);
        return new PageImpl<ProductDto>(page.getContent().stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public Page<ProductDto> getListByNameLike(String name, Pageable paging) {
        Page<Product> page = productRepository.findAllByNameContains(name, paging);
        return new PageImpl<ProductDto>(page.getContent().stream()
                .map(this::convertToProductDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public ProductDto findByNameAndSeller(String name, Seller seller) {
        return convertToProductDto(productRepository.findByNameAndSeller(name, seller));
    }

    @Override
    public Product createNewProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Product updateProduct(Product product) {
        return productRepository.save(product);
    }

    @Override
    public Boolean deleteProduct(Product product) {
        Objects.requireNonNull(product, "product cannot be null");
        Long id = product.getId();
        productRepository.delete(product);
        return !productRepository.existsById(id);
    }

    @Override
    public Product findByName(String name) {
        Objects.requireNonNull(name, "name cannot be null");
        return productRepository.findByName(name).orElseThrow(ProductNotFoundException::new);
    }

    @Override
    public List<Product> getProductsBySeller(Seller seller) {
        Objects.requireNonNull(seller, "seller can not be null");
        return productRepository.getAllBySeller(seller);
    }

    @Override
    public boolean existsByName(String name) {
        return productRepository.existsByName(name);
    }

    public ProductDto convertToProductDto(Product product) {
        ProductDto productDto = new ProductDto();

        //Base values
        productDto.setId(product.getId());
        productDto.setName(product.getName());
        productDto.setDescription(product.getDescription());
        productDto.setPrice(product.getPrice());
        productDto.setShippingCost(product.getShippingCost());
        productDto.setIsAvailable(product.getIsAvailable());
        productDto.setPicturePath(product.getPicturePath());
        productDto.setDiscountRate(product.getDiscountRate());

        //Relations
        Seller seller = product.getSeller();
        Category category = product.getCategory();
        productDto.setSellerName(seller.getCompanyName());
        productDto.setCategory(category.getName());
        productDto.setBaseCategory(category.getBaseCategory().toString());

        return productDto;
    }
}
