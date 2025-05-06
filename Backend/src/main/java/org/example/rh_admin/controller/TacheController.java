package org.example.rh_admin.controller;


import jakarta.persistence.EntityNotFoundException;
import org.example.rh_admin.DTO.TacheResponseDTO;
import org.example.rh_admin.entity.Notification;
import org.example.rh_admin.entity.Tache;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.NotificationRepository;
import org.example.rh_admin.repository.TacheRepository;
import org.example.rh_admin.repository.UserRepository;
import org.example.rh_admin.service.TacheService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RequestMapping("/taches")

@RestController
public class TacheController {



    @Autowired
    private TacheService tacheService;

    @Autowired
    private TacheRepository tacheRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private NotificationRepository notificationRepository;


    @PostMapping
    public ResponseEntity<?> createTache(@RequestBody TacheResponseDTO dto) {
        Optional<User> userOptional = userRepository.findById(dto.getCin());

        if (userOptional.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "Utilisateur avec CIN " + dto.getCin() + " non trouvé."));
        }


        User user = userOptional.get();
        if(dto.getDateDebut()==null || dto.getDateDebut().after(dto.getDateFin()) ||
                dto.getDateDebut().before(user.getDatenaissance()))
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "date debut invalide"));
        }
        if(dto.getDateFin()==null)
        {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", "date fin invalide"));
        }

        Tache createdTache = new Tache();
        createdTache.setUsertache(user);
        createdTache.setEtat(dto.getEtat());
        createdTache.setDescription(dto.getDescription());
        createdTache.setDateDebut(dto.getDateDebut());
        createdTache.setDateFin(dto.getDateFin());

        try {
            createdTache = tacheService.save(createdTache);
            Notification n=new Notification();
            n.setStatut(false);
            n.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            n.setTitre("Affectation d une tache ");
            n.setContenu(createdTache.getDescription());
            n.setExpediteuruser(user);
            n.setRecepteuruser(user);
            notificationRepository.save(n);

            return ResponseEntity.status(HttpStatus.CREATED).body(createdTache);
        } catch (EntityNotFoundException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors de la création de la tâche : " + e.getMessage()));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur inattendue lors de la création de la tâche."));
        }
    }



    @PutMapping("/{id}")
    public ResponseEntity<Tache> updateTache(
            @PathVariable Integer id,
            @RequestBody Tache tacheDetails
    ) {
        try {
            Tache updatedTache = tacheService.update(id, tacheDetails);
            return ResponseEntity.ok(updatedTache);
        } catch (HttpClientErrorException.NotFound e) {

            return ResponseEntity.notFound().build();
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }

    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteTache(@PathVariable Integer id) {
        try {
            tacheService.delete(id);
            return ResponseEntity.ok().build();
        } catch (EntityNotFoundException e) {

            return ResponseEntity.notFound().build();
        }
    }



   @GetMapping
   public ResponseEntity<List<TacheResponseDTO>> getAllTaches() {
       try {
           List<Tache> taches = tacheRepository.findAll();

           // Convertir les tâches en DTOs
           List<TacheResponseDTO> tacheDTOs = taches.stream()
                   .map(tache -> {
                       TacheResponseDTO dto = new TacheResponseDTO(tache);

                       // Ajouter les informations sur le user
                       if (tache.getUsertache() != null) {
                           dto.setResponsable(tache.getUsertache().getNom()+" "+tache.getUsertache().getPrenom());

                       }

                       return dto;
                   })
                   .collect(Collectors.toList());

           return ResponseEntity.ok(tacheDTOs);
       } catch (Exception e) {
           return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
       }
   }

}


