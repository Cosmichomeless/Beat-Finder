package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.Users;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;


public interface UsersRepository extends JpaRepository<Users, Long> {
    Optional<Users> findByUsernameOrEmail(String username, String email);

    // Añadir estos métodos al UsersRepository existente
    boolean existsByUsername(String username);
    Optional<Users> findByUsername(String username);

    Optional<Users> findByEmail(String email); // Corregido: debe ser Optional<Users>
    boolean existsByEmail(String email); // Añadido: útil para verificar disponibilidad

}

