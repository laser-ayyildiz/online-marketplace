package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.exception.RoleNotFoundException;
import com.example.onlinemarketplace.model.Role;
import com.example.onlinemarketplace.model.RoleType;
import com.example.onlinemarketplace.repository.RoleRepository;
import com.example.onlinemarketplace.service.RoleService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.Objects;

@Slf4j
@RequiredArgsConstructor
@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    @Override
    public Role findByName(RoleType name) {
        Objects.requireNonNull(name, "role name cannot be null");
        return roleRepository.findByName(name).orElseThrow(RoleNotFoundException::new);
    }
}