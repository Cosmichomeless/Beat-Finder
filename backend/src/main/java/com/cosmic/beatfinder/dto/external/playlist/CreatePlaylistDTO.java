package com.cosmic.beatfinder.dto.external.playlist;

import lombok.Data;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Data
public class CreatePlaylistDTO {
    private String spotifyToken;
    private String name;
    private String description;
    private boolean isPublic;

}

