package org.example.rh_admin.controller;


import org.example.rh_admin.DTO.QuotasDTO;
import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.Quotas;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.QuotasRepository;
import org.example.rh_admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController

@RequestMapping("/quota")

public class QuotasController {


    @Autowired
    private QuotasRepository quotasRepository;


    @Autowired
    private UserService userService;


    @GetMapping
    public ResponseEntity<List<QuotasDTO>> getAll()

    {
        try {
            // Récupérer tous les utilisateurs
            List<Quotas> quotas = quotasRepository.findAll();

            // Convertir les entités User en UserDTO
            List<QuotasDTO> quotasDTOS = quotas.stream()
                    .map(QuotasDTO::new)
                    .collect(Collectors.toList());

            // Retourner la liste des DTO avec le statut 200 OK
            return ResponseEntity.ok(quotasDTOS);
        } catch (Exception e) {
            // Retourner une réponse d'erreur avec un message explicatif
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @PutMapping("/update")
    public ResponseEntity<?> updateQuotas(@RequestBody List<Map<String, Object>> quotasData) {
        if (quotasData == null || quotasData.isEmpty()) {
            return ResponseEntity.badRequest().body("La liste des quotas ne peut pas être vide ou nulle.");
        }

        for (Map<String, Object> quotaData : quotasData) {
            try {

                if (!quotaData.containsKey("typeEmploye") || !quotaData.containsKey("quota")) {
                    return ResponseEntity.badRequest().body("Chaque élément de la liste doit contenir 'typeEmploye' et 'quota'.");
                }

                String typeEmploye = (String) quotaData.get("typeEmploye");
                int newQuota;

                try {
                    newQuota = Integer.parseInt(quotaData.get("quota").toString());
                } catch (NumberFormatException e) {
                    return ResponseEntity.badRequest().body("Le quota doit être un nombre valide.");
                }


                Optional<Quotas> existingQuotaOpt = quotasRepository.findByTypeEmploye(typeEmploye);

                if (existingQuotaOpt.isPresent()) {
                    Quotas quota = existingQuotaOpt.get();
                    quota.setQuota(newQuota);
                    quotasRepository.save(quota);
                    List<Emploi> listemplois=quota.getEmplois();
                    for(Emploi e:listemplois)
                    {
                        User user=e.getUser();
                        e.setSoldeConge(e.getQuota().getQuota());

                        userService.sendemail(user.getEmail(),"Mise a jour de quotas ", "nous vous informe qu on achangé notre solde congé a "+e.getQuota().getQuota());


                    }
                } else {
                    return ResponseEntity.status(HttpStatus.NOT_FOUND)
                            .body("Quota non trouvé pour le type d'employé: " + typeEmploye);
                }

            } catch (Exception e) {
                // Journalisation de l'erreur

                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur lors de la mise à jour des quotas: " + e.getMessage());
            }
        }

        return ResponseEntity.ok("Quotas mis à jour avec succès");
    }



}


