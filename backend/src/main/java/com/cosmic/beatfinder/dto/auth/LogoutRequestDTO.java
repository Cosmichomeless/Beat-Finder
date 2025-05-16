package com.cosmic.beatfinder.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class LogoutRequestDTO {
	private String email;
}
