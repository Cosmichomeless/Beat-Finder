package com.cosmic.beatfinder.repository;

import com.cosmic.beatfinder.model.History;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HistoryRepository extends JpaRepository<History, Long> {

    // Este metodo obtiene las últimas 10 canciones de un usuario ordenadas por el ID (o por cualquier otro campo)
    List<History> findTop10ByUserOrderByIdDesc(String user);

    List<History> findByUser(String user);


    List<History> getAllByUser(String user);
}
