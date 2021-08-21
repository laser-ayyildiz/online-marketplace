package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.request.FavouriteListRequest;
import com.example.onlinemarketplace.dto.response.FavouriteListDto;
import com.example.onlinemarketplace.model.FavouriteList;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.service.FavouriteListService;
import com.example.onlinemarketplace.service.ProductService;
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
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.Objects;

@RequiredArgsConstructor
@Slf4j
@RestController
@RequestMapping("/api/favourite")
public class FavouriteListController {

    private final FavouriteListService favouriteListService;
    private final UserService userService;
    private final SellerService sellerService;
    private final ProductService productService;

    @GetMapping
    public ResponseEntity<Page<FavouriteListDto>> getPageable(
            @RequestParam String username,
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<FavouriteListDto> favouriteListDtos = favouriteListService.findByUser(username, paging);
        return new ResponseEntity<>(favouriteListDtos, HttpStatus.OK);
    }

    @PostMapping("/objects")
    public FavouriteList create(@RequestBody User user, @RequestBody Product product) {
        FavouriteList favourite = new FavouriteList(user, product);
        return favouriteListService.createNewFavourite(favourite);
    }

    @PostMapping("/strings")
    public ResponseEntity create(@RequestBody FavouriteListRequest favouriteObject) {
        if (!userService.existsByUsername(favouriteObject.getUsername()))
            return new ResponseEntity("user not found!", HttpStatus.BAD_REQUEST);

        else if (!sellerService.existsByCompanyName(favouriteObject.getCompanyName()))
            return new ResponseEntity("Company not found!", HttpStatus.BAD_REQUEST);

        else if (!productService.existsByName(favouriteObject.getProductName()))
            return new ResponseEntity("Product not found!", HttpStatus.BAD_REQUEST);

        FavouriteListDto favouriteListDto = null;

        try {
            favouriteListDto = favouriteListService.createNewFavourite(favouriteObject.getUsername(), favouriteObject.getProductName(), favouriteObject.getCompanyName());
        } catch (DataIntegrityViolationException duplicateEx) {
            return new ResponseEntity("You favourited this product before", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(favouriteListDto, HttpStatus.OK);
    }

    @Transactional
    @DeleteMapping
    public boolean delete(@RequestBody FavouriteListRequest favouriteObject) {
        return favouriteListService.deleteByUserAndProduct(favouriteObject);
    }

}
