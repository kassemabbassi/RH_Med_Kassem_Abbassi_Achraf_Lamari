package org.example.rh_admin.controller;


import org.example.rh_admin.DTO.RequeteRechercherDTO;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.service.EmploiService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/recherche")
public class RechercheController {

    @Autowired
    private EmploiService emploiService;



    @PostMapping("/grade")
    public ResponseEntity<List<String>> getGrade() {
        return ResponseEntity.ok(emploiService.getGrade());
    }
    @PostMapping("/poste")
    public ResponseEntity<List<String>> getPoste() {
        return ResponseEntity.ok(emploiService.getPostes());
    }
    @PostMapping("/specialite")
    public ResponseEntity<List<String>> getSpecialite() {
        return ResponseEntity.ok(emploiService.getSpecialites());
    }
    @PostMapping("/anciennite")
    public ResponseEntity<List<String>> getAnciennites() {
        return ResponseEntity.ok(emploiService.getAnciennites());
    }
    @PostMapping("")
    public ResponseEntity<?> getRecherche(@RequestBody RequeteRechercherDTO rech) {

        System.out.println(rech);


        return ResponseEntity.ok(emploiService.Recherche(rech.getMotCle(),rech.getGrades(),rech.getPostes(),rech.getSpecialites(),rech.getAnciennites(),
                rech.getSexe(),rech.getHandicape(),rech.getRoles(),rech.getDepartements()));
    }
}
