package com.cosmic.beatfinder.service.database.factory;

import com.cosmic.beatfinder.dto.database.HistoryDTO;
import com.cosmic.beatfinder.model.History;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class HistoryFactoryService {

    public History createHistory(HistoryDTO historyDTO) {
        return new History(historyDTO);
    }

    public HistoryDTO createHistoryDTO(History history) {
        return new HistoryDTO(history);
    }

    public List<HistoryDTO> createHistoryDTOs(List<History> historyList) {
        List<HistoryDTO> historyDTOs = new ArrayList<>();
        historyList.forEach(history -> historyDTOs.add(createHistoryDTO(history)));
        return historyDTOs;
    }
}