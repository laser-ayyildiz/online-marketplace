package com.example.onlinemarketplace.repository;

import com.example.onlinemarketplace.model.Role;
import com.example.onlinemarketplace.model.RoleType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RoleRepository extends JpaRepository<Role, Long> {

    Optional<Role> findByName(RoleType name);
}