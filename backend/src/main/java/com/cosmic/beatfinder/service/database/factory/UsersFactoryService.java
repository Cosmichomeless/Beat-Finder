package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.UsersDTO;
import com.cosmic.beatfinder.model.Users;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UsersFactoryService {

    public Users createUsers(UsersDTO usersDTO) {
        return new Users(usersDTO);
    }

    public UsersDTO createUsersDTO(Users users) {
        return new UsersDTO(users);
    }

    public List<UsersDTO> createUsersDTOs(List<Users> usersList) {
        List<UsersDTO> usersDTOs = new ArrayList<>();
        usersList.forEach(users -> usersDTOs.add(createUsersDTO(users)));
        return usersDTOs;
    }
}