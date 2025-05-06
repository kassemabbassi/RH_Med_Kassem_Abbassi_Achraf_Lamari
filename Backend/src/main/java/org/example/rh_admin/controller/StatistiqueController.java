package org.example.rh_admin.controller;


import org.example.rh_admin.entity.PdfFile;
import org.example.rh_admin.repository.AbsenceRepository;
import org.example.rh_admin.repository.PdfFileRepository;
import org.example.rh_admin.service.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.rowset.serial.SerialBlob;
import javax.sql.rowset.serial.SerialException;
import java.io.FileNotFoundException;
import java.sql.Date;
import java.sql.SQLException;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/statistique")
public class StatistiqueController {

    @Autowired
    private EmploiService emploiService;

    @Autowired
    private AbsenceService absenceService;
    @Autowired
    private TacheService tacheService;
    @Autowired
    private CongeService congeService;
    @Autowired
    private PdfService pdfService;
    @Autowired
    private PdfFileRepository pdfFileRepository;


    @GetMapping("/emploi")
    public ResponseEntity<?> emploi() {
        return ResponseEntity.ok(emploiService.getStatistique());
    }

    @PostMapping("/absence")
    public ResponseEntity<?> absence(@RequestBody Map<String , String> map) {
        Date debutDate = Date.valueOf(map.get("debutDate"));
        Date finDate = Date.valueOf(map.get("finDate"));
        return ResponseEntity.ok(absenceService.getStatistique(debutDate, finDate));
    }

    @PostMapping("/tache")
    public ResponseEntity<?> tache(@RequestBody Map<String , String> map) {
        Date debutDate = Date.valueOf(map.get("debutDate"));
        Date finDate = Date.valueOf(map.get("finDate"));
        return ResponseEntity.ok(tacheService.getStatistique(debutDate, finDate));
    }
    @PostMapping("/conge")
    public ResponseEntity<?> conge(@RequestBody Map<String , String> map) {
        System.out.println(map.get("finDate"));
        Date debutDate = Date.valueOf(map.get("debutDate"));
        Date finDate = Date.valueOf(map.get("finDate"));
        return ResponseEntity.ok(congeService.getStatistique(debutDate, finDate));
    }
    @PostMapping("")
    public ResponseEntity<?> statistique(@RequestBody Map<String , Object> params) {
        System.out.println(params);
        Map<String ,String> map = (Map<String, String>) params.get("date");
        String filename = String.valueOf(params.get("filename"));

        Date debutDate = Date.valueOf(map.get("debutDate"));
        Date finDate = Date.valueOf(map.get("finDate"));
        try {

            List<PdfFile> list = pdfService.getRapports();
            for (PdfFile pdfFile : list) {
                if(pdfFile.getFileName().equals(filename)) {
                    return ResponseEntity.status(403).body("Nom De Fichier  existant !");
                }
            }
            byte[] file = pdfService.getStat(debutDate, finDate);
            PdfFile pdf = new PdfFile();
            pdf.setFileName(filename);
            pdf.setCin(12345678);
            pdf.setType("rapport");
            pdf.setContenu(new SerialBlob(file));
            //pdf.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            pdf.setPeriod(debutDate+"-->"+finDate);
            pdf.setFileType("PDF");
            pdf.setFileSize((long) file.length);

            pdfFileRepository.save(pdf);

            System.out.println("Done");
            return ResponseEntity.ok("Save Done");


        } catch (FileNotFoundException | SQLException e) {
            return ResponseEntity.status(500).body(e.getMessage());
        }

    }


}
