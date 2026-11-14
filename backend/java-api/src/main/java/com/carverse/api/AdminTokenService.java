package com.carverse.api;

import org.springframework.http.HttpStatus;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

/**
 * Checks the admin token sent by the frontend. Tokens are created by the PHP service
 * when the admin logs in and stored in the shared admin_tokens table.
 */
@Service
public class AdminTokenService {

    private final JdbcTemplate jdbc;

    public AdminTokenService(JdbcTemplate jdbc) {
        this.jdbc = jdbc;
    }

    public void requireAdmin(String token) {
        if (token == null || token.isBlank()) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Please log in as admin first.");
        }
        Integer count = jdbc.queryForObject(
                "SELECT COUNT(*) FROM admin_tokens WHERE token = ? AND created_at > datetime('now', '-8 hours')",
                Integer.class, token);
        if (count == null || count == 0) {
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Your admin session has expired. Please log in again.");
        }
    }
}
