package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.RefreshTokenDTO;
import com.cosmic.beatfinder.model.RefreshToken;
import com.cosmic.beatfinder.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;


import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.temporal.ChronoUnit;
import java.util.UUID;

@Service
public class RefreshTokenService {
	@Autowired
	private RefreshTokenRepository refreshTokenRepository;

	public RefreshTokenDTO createRefreshToken(String email) {
		RefreshToken refreshToken = refreshTokenRepository.findByEmail(email)
				.orElseGet(() -> {
					RefreshToken newToken = new RefreshToken();
					newToken.setEmail(email);
					return newToken;
				});

		refreshToken.setToken(UUID.randomUUID().toString());
		refreshToken.setLastUsed(ZonedDateTime.now(ZoneId.of("Europe/Madrid")).toInstant());
		return new RefreshTokenDTO(refreshTokenRepository.save(refreshToken));
	}

	public RefreshTokenDTO findByToken(String token) {
		RefreshToken refreshToken = refreshTokenRepository.findByToken(token).orElseThrow(() -> new RuntimeException("Refresh Token not found"));
		refreshToken.setLastUsed(Instant.now());
		return new RefreshTokenDTO(refreshToken);
	}

	public void deleteByEmail(String email) {
		refreshTokenRepository.deleteByEmail(email);
	}

	public void deleteOldTokens() {
		Instant days = Instant.now().minus(30, ChronoUnit.DAYS);
		refreshTokenRepository.deleteByLastUsedBefore(days);
	}

	@Scheduled(fixedRate = 86400000) // 24 horas
	public void deleteInactiveTokens() {
		Instant days = Instant.now().minus(30, ChronoUnit.DAYS);
		refreshTokenRepository.deleteByLastUsedBefore(days);
		System.out.println("Tokens inactivos eliminados correctamente");
	}
}
