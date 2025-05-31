package com.cosmic.beatfinder.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class RefreshRequestDTO {
	private String refreshToken;
}
