package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.RefreshTokenDTO;
import jakarta.persistence.*;
import lombok.Data;

import java.time.Instant;

@Data
@Entity
@Table (name = "refresh_token")
public class RefreshToken {
	@Id
	@GeneratedValue (strategy = GenerationType.IDENTITY)
	private Long id;

	private String token;
	private String email;
	private Instant ceatedAt;
	private Instant lastUsed;

	public RefreshToken() {
		this.ceatedAt = Instant.now();
		this.lastUsed = Instant.now();
	}

	public RefreshToken(RefreshTokenDTO refreshTokenDTO) {
		this.id = refreshTokenDTO.getId();
		this.token = refreshTokenDTO.getToken();
		this.email = refreshTokenDTO.getEmail();
		this.ceatedAt = refreshTokenDTO.getCeatedAt();
		this.lastUsed = refreshTokenDTO.getLastUsed();
	}
}
