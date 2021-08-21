package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.request.FavouriteListRequest;
import com.example.onlinemarketplace.dto.response.FavouriteListDto;
import com.example.onlinemarketplace.model.FavouriteList;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface FavouriteListService {

    Page<FavouriteListDto> findByUser(String username, Pageable paging);

    List<FavouriteList> findByProduct(Product product);

    List<FavouriteList> findByProduct(String productName, String companyName);

    FavouriteList createNewFavourite(FavouriteList favouriteList);

    FavouriteListDto createNewFavourite(String username, String productName, String companyName);

    boolean deleteById(FavouriteList favouriteList);

    boolean deleteByUserAndProduct(FavouriteListRequest favouriteListRequest);

}
