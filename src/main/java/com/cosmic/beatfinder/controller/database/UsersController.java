package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.auth.ChangeUsernameRequestDTO;
import com.cosmic.beatfinder.dto.database.UsersDTO;
import com.cosmic.beatfinder.model.Users;
import com.cosmic.beatfinder.service.database.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UsersController {

    @Autowired
    private UserService usersService;

    @GetMapping
    public ResponseEntity<List<UsersDTO>> findAll() {
        try {
            return new ResponseEntity<>(usersService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<Users> create(@RequestBody UsersDTO usersDTO) {
        if (usersDTO.getUsername() == null || usersDTO.getPassword() == null || usersDTO.getEmail() == null) {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        try {
            return new ResponseEntity<>(usersService.create(usersDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    @PutMapping
    public ResponseEntity<Users> update(UsersDTO usersDTO) {
        try {
            return new ResponseEntity<>(usersService.update(usersDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            usersService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // Endpoint para verificar si un nombre de usuario ya existe
    @GetMapping("/check-username/{username}")
    public ResponseEntity<Boolean> checkUsernameExists(@PathVariable String username) {
        try {
            boolean exists = usersService.existsByUsername(username);
            return ResponseEntity.ok(exists);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PostMapping("/change-username")
    public ResponseEntity<?> changeUsername(@RequestBody ChangeUsernameRequestDTO request) {
        try {
            // Primero obtenemos el usuario por su nombre de usuario actual
            Users user = usersService.findByUsername(request.getOldUsername());
            if (user == null) {
                return ResponseEntity.badRequest().body("Usuario no encontrado");
            }

            // Llamamos al servicio para cambiar el nombre de usuario, pasando el email del usuario encontrado
            usersService.changeUsernameByEmail(user.getEmail(), request.getNewUsername());
            return ResponseEntity.ok().build();
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error al cambiar el nombre de usuario: " + e.getMessage());
        }
    }
}