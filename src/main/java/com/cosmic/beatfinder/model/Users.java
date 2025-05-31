package com.cosmic.beatfinder.model;

import com.cosmic.beatfinder.dto.database.UsersDTO;
import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.Date;
import java.util.List;

@NoArgsConstructor
@Data
@Entity
@Table(name = "users")
public class Users implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_user;
    private String username;
    private String password;
    private String email;
    private Date created_at;

    public Users(UsersDTO usersDTO) {
        this.id_user = usersDTO.getId_user();
        this.username = usersDTO.getUsername();
        this.password = usersDTO.getPassword();
        this.email = usersDTO.getEmail();
        this.created_at = usersDTO.getCreated_at();
    }


    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return this.username;
    }
}
