package com.algoquest.api.config;

import java.io.IOException;
import java.util.List;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.filter.OncePerRequestFilter;

import com.algoquest.api.service.UserService;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

public class TokenAuthFilter extends OncePerRequestFilter {
    private final UserService userService;

    public TokenAuthFilter(UserService userService) {
        this.userService = userService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain) throws IOException, ServletException {
        final String header = request.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            final String token = header.substring(7);
            userService.findByToken(token).ifPresent(user -> {
                final UsernamePasswordAuthenticationToken auth = new UsernamePasswordAuthenticationToken(
                        user.getEmail(),
                        null,
                        List.of(() -> "ROLE_" + user.getRole().name()));
                SecurityContextHolder.getContext().setAuthentication(auth);
            });
        }
        filterChain.doFilter(request, response);
    }
}
