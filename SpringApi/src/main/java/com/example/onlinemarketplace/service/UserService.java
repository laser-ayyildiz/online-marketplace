package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.dto.response.UserDto;
import com.example.onlinemarketplace.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.Optional;

public interface UserService {
    User createNewUser(User user);

    List<UserDto> getAllUsers();

    Page<UserDto> getAllUsersPageable(Pageable paging);

    Optional<UserDto> findByUsername(String username);

    User _findByUsername(String username);

    Boolean existsByUsername(String username);

    Boolean existsByEmail(String email);

    boolean delete(String username);

    User updateUser(User user);
}
