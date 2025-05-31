package com.cosmic.beatfinder.service.database;

import com.cosmic.beatfinder.dto.database.UsersDTO;
import com.cosmic.beatfinder.model.Users;
import com.cosmic.beatfinder.repository.UsersRepository;
import com.cosmic.beatfinder.service.database.factory.UsersFactoryService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    @Autowired
    private UsersRepository usersRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UsersFactoryService usersFactoryService;

    public Users create(UsersDTO usersDTO) throws Exception {
        // Verificar si el usuario ya existe
        if (usersRepository.findByUsernameOrEmail(usersDTO.getUsername(), usersDTO.getEmail()).isPresent()) {
            throw new Exception("El usuario ya existe");
        }

        // Codificar la contraseña
        String encodedPassword = passwordEncoder.encode(usersDTO.getPassword());

        // Crear la entidad de usuario y guardarlo en la base de datos
        Users user = new Users(usersDTO);
        user.setPassword(encodedPassword);

        return usersRepository.save(user);
    }

    public Users update(UsersDTO usersDTO) throws Exception {
        Users existingUser = usersRepository.findById(usersDTO.getId_user()).orElseThrow(() -> new Exception("Usuario no encontrado"));

        // Actualizar los valores según el DTO
        existingUser.setUsername(usersDTO.getUsername());
        existingUser.setEmail(usersDTO.getEmail());
        // Si deseas cambiar la contraseña, codifícala
        if (usersDTO.getPassword() != null) {
            existingUser.setPassword(passwordEncoder.encode(usersDTO.getPassword()));
        }

        return usersRepository.save(existingUser);
    }

    public void delete(Long id) throws Exception {
        Users user = usersRepository.findById(id).orElseThrow(() -> new Exception("Usuario no encontrado"));
        usersRepository.delete(user);
    }

    public List<UsersDTO> findAll() {
        return usersFactoryService.createUsersDTOs(usersRepository.findAll());
    }



    // Buscar un usuario por nombre de usuario o correo electrónico
    public Users findByUsernameOrEmail(String usernameOrEmail) {
        return usersRepository.findByUsernameOrEmail(usernameOrEmail, usernameOrEmail).orElse(null);
    }

    public boolean existsByUsername(String username) {
        return usersRepository.existsByUsername(username);
    }

    /**
     * Cambia el nombre de usuario de un usuario identificado por su email
     */
    @Transactional
    public void changeUsernameByEmail(String email, String newUsername) throws Exception {
        // Verificar si el nuevo nombre de usuario ya existe
        if (existsByUsername(newUsername)) {
            throw new IllegalArgumentException("El nombre de usuario ya está en uso");
        }

        // Buscar el usuario por su email
        Users user = usersRepository.findByEmail(email)
                .orElseThrow(() -> new Exception("Usuario no encontrado con el email proporcionado"));

        // Si el usuario intenta cambiar al mismo nombre, no hacemos nada
        if (user.getUsername().equals(newUsername)) {
            return;
        }

        // Actualizar el nombre de usuario
        user.setUsername(newUsername);

        // Guardar los cambios
        usersRepository.save(user);
    }


    public Users findByUsername(String oldUsername) {
        return usersRepository.findByUsername(oldUsername).orElse(null);
    }
}