package com.cosmic.beatfinder.configs;

import lombok.Getter;
import lombok.Setter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
@Getter
@Setter
@Configuration
public class SpotifyConfig {

	@Value("${spotify.client-id}")
	private String clientId;

	@Value("${spotify.client-secret}")
	private String clientSecret;

	@Value("${spotify.redirect-uri}")
	private String redirectUri;


	@Value("${spotify.token-url}")
	private String tokenUrl;


}
