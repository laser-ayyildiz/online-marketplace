package com.example.onlinemarketplace.repository;

import com.example.onlinemarketplace.model.Seller;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SellerRepository extends JpaRepository<Seller, Long> {

    List<Seller> findAll();

    Seller findByCompanyName(String companyName);

    boolean existsById(Seller seller);

    Page<Seller> findAllByCompanyNameContains(String name, Pageable paging);

    boolean existsByCompanyName(String companyName);
}
