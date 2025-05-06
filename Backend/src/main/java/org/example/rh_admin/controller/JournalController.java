package org.example.rh_admin.controller;


import jakarta.persistence.EntityNotFoundException;
import org.example.rh_admin.entity.Journal;
import org.example.rh_admin.repository.JournalRepository;
import org.example.rh_admin.service.JournalService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/journaux")
public class JournalController {

    @Autowired
    private JournalRepository journalRepository;
    @Autowired
    private JournalService journalService;

    @GetMapping
    public List<Journal> getJournaux()
    {
        return journalService.getAllJournaux();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTache(@PathVariable Integer id) {
        try {
            journalService.delete(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {

            return ResponseEntity.notFound().build();
        }
    }


}
