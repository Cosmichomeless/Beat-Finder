package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.Instant;
import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
	Optional<RefreshToken> findByToken(String token);
	void deleteByEmail(String email);
	void deleteByLastUsedBefore(Instant days);
}
