package com.example.onlinemarketplace.repository;

import com.example.onlinemarketplace.model.FavouriteList;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface FavouriteListRepository extends JpaRepository<FavouriteList, Long> {

    boolean existsByUserAndProduct(User user, Product product);

    Page<FavouriteList> findByUser(User user, Pageable pageable);

    List<FavouriteList> findByProduct(Product product);

    void deleteByUserAndProduct(User user, Product product);

    void deleteAllByUser(User user);
}
