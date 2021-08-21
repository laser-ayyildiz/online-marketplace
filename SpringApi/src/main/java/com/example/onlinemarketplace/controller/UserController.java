package com.example.onlinemarketplace.controller;

import com.example.onlinemarketplace.dto.request.SignupRequest;
import com.example.onlinemarketplace.dto.request.UserRequest;
import com.example.onlinemarketplace.dto.response.UserDto;
import com.example.onlinemarketplace.exception.UserNotFoundException;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import javax.validation.Valid;
import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@RestController
@RequestMapping("/api/user")
@PreAuthorize("hasRole('ROLE_ADMIN')")
public class UserController {
    private final AuthController authController;
    private final UserService userService;

    @GetMapping("all")
    public ResponseEntity<Page<UserDto>> getPageable(
            @RequestParam(defaultValue = "0") int pageNumber,
            @RequestParam(defaultValue = "5") int pageSize
    ) {
        Pageable paging = PageRequest.of(pageNumber, pageSize);
        Page<UserDto> userDto = userService.getAllUsersPageable(paging);
        return new ResponseEntity<>(userDto, HttpStatus.OK);
    }

    @GetMapping
    public UserDto getUserByUsername(@RequestParam String username) {
        Objects.requireNonNull(username, "parameter can not be null");
        try {
            return userService.findByUsername(username).orElseThrow(() -> new UserNotFoundException("User Not Found"));
        } catch (NullPointerException e) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }
    }

    @PostMapping
    public ResponseEntity<?> create(@Valid @RequestBody SignupRequest signupRequest) {
        return authController.registerUser(signupRequest);
    }

    @DeleteMapping
    public boolean delete(@Valid @RequestBody UserRequest user) {
        return userService.delete(user.getUsername());
    }

    @PutMapping
    public User update(@Valid @RequestBody User user) {
        return userService.updateUser(user);
    }
}