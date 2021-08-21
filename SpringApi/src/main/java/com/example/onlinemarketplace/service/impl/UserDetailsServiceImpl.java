package com.example.onlinemarketplace.service.impl;

import com.example.onlinemarketplace.model.User;
import com.example.onlinemarketplace.security.MyUserDetails;
import com.example.onlinemarketplace.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@RequiredArgsConstructor
@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UserService userService;

    @Override
    @Transactional
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        final User user = userService._findByUsername(username);

        return MyUserDetails.build(user);
    }
}
