package org.example.rh_admin.service;


import jakarta.persistence.EntityNotFoundException;
import org.example.rh_admin.entity.Journal;
import org.example.rh_admin.repository.JournalRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class JournalService {


    @Autowired
    private JournalRepository journalRepository;
   



    public List<Journal> getAllJournaux()
    {
        return journalRepository.findAll();
    }

    public void delete(Integer id) {
        Journal journal = journalRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tâche non trouvée"));
        journalRepository.delete(journal);
    }
}
