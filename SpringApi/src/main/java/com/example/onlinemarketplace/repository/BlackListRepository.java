package com.example.onlinemarketplace.repository;

import com.example.onlinemarketplace.model.BlackList;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface BlackListRepository extends JpaRepository<BlackList, Long> {

    Page<BlackList> findByUser(User user, Pageable pageable);

    Integer countBlackListBySeller(Seller seller);

    BlackList findByUserAndSeller(User user, Seller seller);

    void deleteAllByUser(User user);
}
