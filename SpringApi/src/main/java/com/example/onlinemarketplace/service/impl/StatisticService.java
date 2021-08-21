package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.model.Statistic;
import com.example.onlinemarketplace.repository.CategoryRepository;
import com.example.onlinemarketplace.repository.ProductRepository;
import com.example.onlinemarketplace.repository.SellerRepository;
import com.example.onlinemarketplace.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class StatisticService {

    private final UserRepository userRepository;
    private final SellerRepository sellerRepository;
    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    public Statistic get(){
        Statistic statistic = new Statistic();
        statistic.setUserCount(userRepository.count());
        statistic.setSellerCount(sellerRepository.count());
        statistic.setProductCount(productRepository.count());
        statistic.setCategoryCount(categoryRepository.count());

        return statistic;
    }

}
