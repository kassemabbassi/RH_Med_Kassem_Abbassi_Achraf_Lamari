package org.example.rh_admin.controller;

import org.example.rh_admin.entity.PdfFile;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.service.PdfService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.FileNotFoundException;
import java.util.List;

@RestController
@RequestMapping("/pdf")
public class PdfController {
    @Autowired
    private PdfService pdfService;


    @GetMapping("")
    public ResponseEntity<List<PdfFile>> getPdf() {
        return ResponseEntity.ok( pdfService.getRapports());
    }


    @PostMapping("")
    public ResponseEntity<byte[]> pdf(@RequestBody List<User> users) throws FileNotFoundException {
        try {
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=Resultat.pdf") // Affichage inline
                    .contentType(MediaType.APPLICATION_PDF)
                    .body(pdfService.getRecherchePDF(users));
        } catch (FileNotFoundException e) {
            throw new RuntimeException(e);
        }
    }
}
