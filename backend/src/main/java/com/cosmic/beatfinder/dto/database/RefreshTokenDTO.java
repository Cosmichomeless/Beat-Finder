package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.RefreshToken;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.Instant;

@Data
@NoArgsConstructor
public class RefreshTokenDTO {
	private Long id;
	private String token;
	private String email;
	private Instant ceatedAt;
	private Instant lastUsed;

	public RefreshTokenDTO(RefreshToken refreshToken) {
		this.id = refreshToken.getId();
		this.token = refreshToken.getToken();
		this.email = refreshToken.getEmail();
		this.ceatedAt = refreshToken.getCeatedAt();
		this.lastUsed = refreshToken.getLastUsed();
	}

}
