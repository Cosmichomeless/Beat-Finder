package com.cosmic.beatfinder.dto.auth;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ChangeUsernameRequestDTO {
    private String oldUsername;
    private String newUsername;



}