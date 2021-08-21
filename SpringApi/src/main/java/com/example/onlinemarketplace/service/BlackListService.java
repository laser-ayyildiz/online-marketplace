package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.request.BlackListRequest;
import com.example.onlinemarketplace.dto.response.BlackListDto;
import com.example.onlinemarketplace.model.BlackList;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BlackListService {

    Page<BlackListDto> findByUser(String username, Pageable paging);

    Integer countBlackListBySeller(String companyName);

    BlackList createNewBlackList(User user, Seller seller);

    BlackList createNewBlackList(BlackList blackList);

    BlackListDto createNewBlackList(String username, String companyName);

    boolean delete(BlackListRequest blackList);

    boolean delete(User user, Seller seller);

    boolean delete(String username, String companyName);

    void deleteAllByUser(String username);
}
