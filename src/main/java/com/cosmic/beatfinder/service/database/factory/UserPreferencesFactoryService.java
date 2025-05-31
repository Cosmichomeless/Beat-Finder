package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.UserPreferencesDTO;
import com.cosmic.beatfinder.model.UserPreferences;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class UserPreferencesFactoryService {

    public UserPreferences createUserPreferences(UserPreferencesDTO dto) {
        return new UserPreferences(dto);
    }

    public UserPreferencesDTO createUserPreferencesDTO(UserPreferences entity) {
        return new UserPreferencesDTO(entity);
    }

    public List<UserPreferencesDTO> createUserPreferencesDTOs(List<UserPreferences> entities) {
        List<UserPreferencesDTO> dtos = new ArrayList<>();
        entities.forEach(entity -> dtos.add(createUserPreferencesDTO(entity)));
        return dtos;
    }
}