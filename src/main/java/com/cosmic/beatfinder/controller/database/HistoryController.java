package com.cosmic.beatfinder.controller.database;

import com.cosmic.beatfinder.dto.database.HistoryDTO;
import com.cosmic.beatfinder.model.History;
import com.cosmic.beatfinder.service.database.HistoryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/history")
public class HistoryController {

    @Autowired
    private HistoryService historyService;

    @GetMapping("/{user}")
    public ResponseEntity<List<History>> getHistoryByUser(@PathVariable String user) {
        List<History> historyList = historyService.getLast10HistoryByUser(user);
        return new ResponseEntity<>(historyList, HttpStatus.OK);
    }

    @GetMapping("all/{user}")
    public ResponseEntity<List<History>> getAllHistoryByUser(@PathVariable String user) {
        List<History> historyList = historyService.getAllHistory(user);
        return new ResponseEntity<>(historyList, HttpStatus.OK);
    }




    @GetMapping
    public ResponseEntity<List<HistoryDTO>> findAll() {
        try {
            return new ResponseEntity<>(historyService.findAll(), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @PostMapping
    public ResponseEntity<History> create(@RequestBody HistoryDTO historyDTO) {
        try {
            return new ResponseEntity<>(historyService.create(historyDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }


    @PutMapping
    public ResponseEntity<History> update(@RequestBody HistoryDTO historyDTO) {
        try {
            return new ResponseEntity<>(historyService.update(historyDTO), HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        try {
            historyService.delete(id);
            return new ResponseEntity<>(HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}