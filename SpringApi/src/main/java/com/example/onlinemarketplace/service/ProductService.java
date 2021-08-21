package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.response.ProductDto;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductService {

    ProductDto findById(Long id);

    List<ProductDto> getAllProducts();

    Page<ProductDto> getAllProductsPageable(Pageable paging);

    Page<ProductDto> getListByNameLike(String name, Pageable paging);

    ProductDto findByNameAndSeller(String name, Seller seller);

    Product createNewProduct(Product product);

    Product updateProduct(Product product);

    Boolean deleteProduct(Product product);

    Product findByName(String name);

    List<Product> getProductsBySeller(Seller seller);

    boolean existsByName(String name);
}
