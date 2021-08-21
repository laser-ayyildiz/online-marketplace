package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.request.BlackListRequest;
import com.example.onlinemarketplace.dto.request.SellerRequest;
import com.example.onlinemarketplace.dto.request.UserRequest;
import com.example.onlinemarketplace.dto.response.BlackListDto;
import com.example.onlinemarketplace.model.BlackList;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.service.BlackListService;
import com.example.onlinemarketplace.service.SellerService;
import com.example.onlinemarketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/blacklist")
public class BlackListController {

    private final BlackListService blackListService;
    private final UserService userService;
    private final SellerService sellerService;

    @GetMapping("/user")
    public ResponseEntity<Page<BlackListDto>> getPageable(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<BlackListDto> blackListDtos = blackListService.findByUser(username, paging);
        return new ResponseEntity<>(blackListDtos, HttpStatus.OK);
    }

    @GetMapping("/count")
    public Integer getCountOfSellerBlocked(@Valid @RequestParam SellerRequest seller) {
        return blackListService.countBlackListBySeller(seller.getCompanyName());
    }

    @PostMapping("/objects")
    public BlackList create(@Valid @RequestBody User user, Seller seller) {
        return blackListService.createNewBlackList(user, seller);
    }

    @PostMapping("/strings")
    public ResponseEntity create(@Valid @RequestBody BlackListRequest blackListRequest) {
        if (!userService.existsByUsername(blackListRequest.getUsername()))
            return new ResponseEntity("user not found!", HttpStatus.BAD_REQUEST);

        else if (!sellerService.existsByCompanyName(blackListRequest.getCompanyName()))
            return new ResponseEntity("Company not found!", HttpStatus.BAD_REQUEST);

        BlackListDto blackList = null;
        try {
            blackList = blackListService.createNewBlackList(blackListRequest.getUsername(), blackListRequest.getCompanyName());
        } catch (DataIntegrityViolationException duplicateEx) {
            return new ResponseEntity("You blocked this company before", HttpStatus.BAD_REQUEST);
        }


        return new ResponseEntity<>(blackList, HttpStatus.OK);
    }

    @DeleteMapping
    public boolean delete(@RequestBody BlackListRequest blackList) {
        return blackListService.delete(blackList);
    }

    @DeleteMapping("/user")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public boolean deleteAllOfUser(@RequestBody UserRequest user) {
        try {
            blackListService.deleteAllByUser(user.getUsername());
            return true;
        } catch (Exception e) {
            return false;
        }
    }
}
