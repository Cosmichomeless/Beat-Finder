package com.cosmic.beatfinder.dto.database;

import com.cosmic.beatfinder.model.Users;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.Date;

@Data
@NoArgsConstructor
public class UsersDTO {
    private Long id_user;
    private String username;
    private String password;
    private String email;
    private Date created_at;

    public UsersDTO(Users users) {
        this.id_user = users.getId_user();
        this.username = users.getUsername();
        this.password = users.getPassword();
        this.email = users.getEmail();
        this.created_at = users.getCreated_at();
    }
}