package com.cosmic.beatfinder.repository.Achievement;


import com.cosmic.beatfinder.model.Achievements.Achievement;
import com.cosmic.beatfinder.model.Achievements.UserAchievement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface UserAchievementRepository extends JpaRepository<UserAchievement, Long> {
    List<UserAchievement> findByUsername(String username);
    List<UserAchievement> findByUsernameAndUnlockedTrue(String username);
    Optional<UserAchievement> findByUsernameAndAchievement(String username, Achievement achievement);
}