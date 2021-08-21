package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.dto.request.FavouriteListRequest;
import com.example.onlinemarketplace.dto.response.FavouriteListDto;
import com.example.onlinemarketplace.model.FavouriteList;
import com.example.onlinemarketplace.model.Product;
import com.example.onlinemarketplace.model.Seller;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.repository.FavouriteListRepository;
import com.example.onlinemarketplace.repository.ProductRepository;
import com.example.onlinemarketplace.repository.SellerRepository;
import com.example.onlinemarketplace.repository.UserRepository;
import com.example.onlinemarketplace.service.FavouriteListService;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;


@AllArgsConstructor
@Slf4j
@Service
public class FavouriteListImpl implements FavouriteListService {

    private final UserRepository userRepository;
    private final ProductRepository productRepository;
    private final SellerRepository sellerRepository;
    private FavouriteListRepository favouriteListRepository;

    @Override
    public Page<FavouriteListDto> findByUser(String username, Pageable paging) {
        User user = userRepository.findByUsername(username);
        Page<FavouriteList> page = favouriteListRepository.findByUser(user, paging);
        return new PageImpl<FavouriteListDto>(page.getContent().stream()
                .map(this::convertToFavouriteListDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public List<FavouriteList> findByProduct(Product product) {
        return favouriteListRepository.findByProduct(product);
    }

    @Override
    public List<FavouriteList> findByProduct(String productName, String companyName) {
        Seller seller = sellerRepository.findByCompanyName(companyName);
        Product product = productRepository.findByNameAndSeller(productName, seller);
        return favouriteListRepository.findByProduct(product);
    }

    @Override
    public FavouriteList createNewFavourite(FavouriteList favouriteList) {
        return favouriteListRepository.save(favouriteList);
    }


    @Override
    public FavouriteListDto createNewFavourite(String username, String productName, String companyName) {
        User user = userRepository.findByUsername(username);
        Seller seller = sellerRepository.findByCompanyName(companyName);
        Product product = productRepository.findByNameAndSeller(productName, seller);
        FavouriteList favouriteList = new FavouriteList(user, product);
        return convertToFavouriteListDto(favouriteListRepository.save(favouriteList));
    }

    @Override
    public boolean deleteById(FavouriteList favouriteList) {
        Long id = favouriteList.getId();
        favouriteListRepository.delete(favouriteList);
        return !favouriteListRepository.existsById(id);
    }

    @Override
    public boolean deleteByUserAndProduct(FavouriteListRequest favouriteListRequest) {
        User user = userRepository.findByUsername(favouriteListRequest.getUsername());
        Seller seller = sellerRepository.findByCompanyName(favouriteListRequest.getCompanyName());
        Product product = productRepository.findByNameAndSeller(favouriteListRequest.getProductName(), seller);
        favouriteListRepository.deleteByUserAndProduct(user, product);

        return !favouriteListRepository.existsByUserAndProduct(user, product);
    }

    public FavouriteListDto convertToFavouriteListDto(FavouriteList favouriteList) {
        FavouriteListDto favouriteListDto = new FavouriteListDto();
        favouriteListDto.setCreatedAt(favouriteList.getCreated_at());

        //Relations
        Product product = favouriteList.getProduct();
        Seller seller = product.getSeller();
        User user = favouriteList.getUser();

        favouriteListDto.setUsername(user.getUsername());
        favouriteListDto.setProductName(product.getName());
        favouriteListDto.setCompanyName(seller.getCompanyName());

        return favouriteListDto;
    }
}
