package com.example.onlinemarketplace.service;

import com.example.onlinemarketplace.model.Role;
import com.example.onlinemarketplace.model.RoleType;

public interface RoleService {
    Role findByName(RoleType name);
}
