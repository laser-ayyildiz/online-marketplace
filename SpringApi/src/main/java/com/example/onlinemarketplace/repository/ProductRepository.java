package com.example.onlinemarketplace.repository;

import com.example.onlinemarketplace.model.Category;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProductRepository extends JpaRepository<Product, Long> {

    Optional<Product> findByName(String name);

    boolean existsById(Long id);

    boolean existsByName(String name);

    Product findByNameAndSeller(String name, Seller seller);

    List<Product> getAllBySeller(Seller seller);

    Page<Product> findAllByNameContains(String name, Pageable paging);

    List<Product> getProductsByCategory(Category category);

    List<Product> getProductsByIsAvailable(Boolean isAvailable);

    List<Product> getProductsByDiscountRateGreaterThanEqual(Integer discountRate);

    List<Product> getProductsByDescriptionContains(String description);
}
