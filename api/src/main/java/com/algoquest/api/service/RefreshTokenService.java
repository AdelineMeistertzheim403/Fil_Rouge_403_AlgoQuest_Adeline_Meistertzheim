package com.algoquest.api.service;

import java.time.Duration;
import java.time.Instant;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import com.algoquest.api.dto.UserDTO;
import com.algoquest.api.model.RefreshToken;
import com.algoquest.api.model.User;
import com.algoquest.api.repository.RefreshTokenRepository;

@Service
public class RefreshTokenService {

    private final RefreshTokenRepository repository;
    private final BCryptPasswordEncoder encoder = new BCryptPasswordEncoder();

    @Value("${security.jwt.refresh-ttl-days:14}")
    private int refreshTtlDays;

    public RefreshTokenService(RefreshTokenRepository repository) {
        this.repository = repository;
    }

    public String issueRefreshToken(User user, String deviceId, String userAgent, String ip) {
        final String raw = UUID.randomUUID().toString() + ":" + user.getId();
        final String hash = encoder.encode(raw);

        final RefreshToken token = new RefreshToken();
        token.setUserId(user.getId());
        token.setTokenHash(hash);
        token.setExpiresAt(Instant.now().plus(Duration.ofDays(refreshTtlDays)));
        token.setDeviceId(deviceId);
        token.setUserAgent(userAgent);
        token.setIp(ip);

        repository.save(token);

        return raw;
    }

    public Optional<UserDTO> verifyAndRotate(String rawToken, UserService userService, String deviceId,
            String userAgent, String ip) {
        final List<RefreshToken> tokens = repository.findAll();
        for (RefreshToken t : tokens) {
            if (t.isActive() && encoder.matches(rawToken, t.getTokenHash())) {
                // rotation
                t.setRevokedAt(Instant.now());
                repository.save(t);

                // nouveau refresh
                final String newRaw = UUID.randomUUID() + ":" + t.getUserId();
                final String newHash = encoder.encode(newRaw);

                final RefreshToken newToken = new RefreshToken();
                newToken.setUserId(t.getUserId());
                newToken.setTokenHash(newHash);
                newToken.setExpiresAt(Instant.now().plus(Duration.ofDays(refreshTtlDays)));
                newToken.setDeviceId(deviceId);
                newToken.setUserAgent(userAgent);
                newToken.setIp(ip);
                repository.save(newToken);

                t.setReplacedByTokenHash(newHash);
                repository.save(t);

                return userService.findById(t.getUserId());
            }
        }
        return Optional.empty();
    }

    public void revokeAll(String userId) {
        final List<RefreshToken> tokens = repository.findByUserId(userId);
        tokens.forEach(t -> t.setRevokedAt(Instant.now()));
        repository.saveAll(tokens);
    }
}
