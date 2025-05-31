package com.cosmic.beatfinder.dto.auth;

import com.cosmic.beatfinder.dto.database.RefreshTokenDTO;
import com.cosmic.beatfinder.dto.database.UsersDTO;
import lombok.Data;
import lombok.NoArgsConstructor;


@Data
@NoArgsConstructor
public class LoginResponseDTO {
	private String token;
	private RefreshTokenDTO refreshToken;
	private UsersDTO user;


}
