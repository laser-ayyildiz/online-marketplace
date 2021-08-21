package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.dto.response.UserDto;
import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.repository.UserRepository;
import com.example.onlinemarketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;

@RequiredArgsConstructor
@Slf4j
@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public User createNewUser(User user) {
        return userRepository.save(user);
    }

    @Override
    public List<UserDto> getAllUsers() {
        return (userRepository
                .findAll())
                .stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList());
    }

    @Override
    public Page<UserDto> getAllUsersPageable(Pageable paging) {
        Page<User> page = userRepository.findAll(paging);
        return new PageImpl<UserDto>(page.getContent().stream()
                .map(this::convertToUserDto)
                .collect(Collectors.toList()), paging, page.getTotalElements());
    }

    @Override
    public Optional<UserDto> findByUsername(String username) {
        Objects.requireNonNull(username, "username cannot be null");
        return Optional.of(convertToUserDto(userRepository.findByUsername(username)));
    }

    @Override
    public User _findByUsername(String username) {
        Objects.requireNonNull(username, "username cannot be null");
        return userRepository.findByUsername(username);
    }

    @Override
    public Boolean existsByUsername(String username) {
        Objects.requireNonNull(username, "username cannot be null");
        return userRepository.existsByUsername(username);
    }

    @Override
    public Boolean existsByEmail(String email) {
        Objects.requireNonNull(email, "email cannot be null");
        return userRepository.existsByEmail(email);
    }

    @Override
    public boolean delete(String username) {
        Objects.requireNonNull(username, "username cannot be null");
        User user = userRepository.findByUsername(username);
        Long id = user.getId();
        userRepository.delete(user);
        return !userRepository.existsById(id);
    }

    @Override
    public User updateUser(User user) {
        return userRepository.save(user);
    }

    private UserDto convertToUserDto(User user) {
        UserDto userDto = new UserDto();
        userDto.setUsername(user.getUsername());
        userDto.setEmail(user.getEmail());
        userDto.setAddress(user.getAddress());
        userDto.setCity(user.getCity());
        userDto.setState(user.getState());
        userDto.setCreatedAt(user.getCreated_at());
        userDto.setUpdatedAt(user.getUpdated_at());

        return userDto;
    }
}
