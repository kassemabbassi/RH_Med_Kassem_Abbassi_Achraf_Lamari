package org.example.rh_admin.controller;


import jakarta.mail.MessagingException;
import jakarta.persistence.EntityNotFoundException;
import org.example.rh_admin.DTO.*;
import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.Journal;
import org.example.rh_admin.entity.PdfFile;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.*;
import org.example.rh_admin.service.EmploiService;
import org.example.rh_admin.service.PdfGenerationService;
import org.example.rh_admin.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.sql.rowset.serial.SerialBlob;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;
import java.util.stream.Collectors;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@RestController
@RequestMapping("/user")
public class UserController {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserService userService;
    @Autowired
    private EmploiService emploiService;
    @Autowired
    private EmploiRepository emploiRepository;


    @Autowired
    private JournalRepository journalRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private PdfFileRepository pdfFileRepository;


    @GetMapping("/hello")
    public String hello() {
        return "hello";
    }







    @PostMapping(value = "/create")
    public ResponseEntity<String> createUser(@RequestBody UserAndEmploiDto userandemploi) {



        String result = userService.create(userandemploi);
        if (result.startsWith("Error")) {
            return ResponseEntity.badRequest().body(result);
        }
        Journal journal =new Journal();
        journal.setDate((java.sql.Date) new Date());
        journal.setTitre("Ajout d'un utilisateur");
        journal.setDescription("Un utilisateur avec le nom "+userandemploi.getNom()+" "+userandemploi.getPrenom() +"a été ajouté.");
        journalRepository.save(journal);
        return ResponseEntity.ok(result);






    }



    @PostMapping("/set-password")
    public ResponseEntity<String> setPassword(@RequestBody Map<String,String> payload)
    {
        String email=payload.get("email");
        String password=payload.get("password");


        Optional<User> optionaluser=userRepository.findByEmail(email);
        if(optionaluser.isEmpty())
        {
            return ResponseEntity.badRequest().body("User "+email+" n'existe pas !");
        }
        User user=optionaluser.get();

        user.setPassword(password);
        userRepository.save(user);
        return ResponseEntity.ok("Password updated successfully.");
    }








   @GetMapping("/{cin}/emploi")
   public EmploiDto getEmploiByCin(@PathVariable int cin) {
       Emploi emploi = emploiService.find(cin);
       if(emploi!=null)
       {
           return new EmploiDto(emploi.getId_emploi(), emploi.getUser().getCin(),emploi.getGrade(), emploi.getPoste(), emploi.getDateDebut(), emploi.getSpecialite(), emploi.getRole(), emploi.getDepartement(), emploi.getAnciennete(), emploi.getSoldeConge(), emploi.getHeuresSuppl());
       }
       return null;
   }


   /* @PostMapping("/login")
    public ResponseEntity<User> login(@RequestBody LoginRequest request) {
        User user = userService.authenticate(request.getEmail(), request.getPassword());

        if (user != null) {
            return ResponseEntity.ok(user); // La réponse sera convertie en JSON
        }

        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build(); // 401 si les identifiants sont invalides
    }*/


    @PostMapping("/send")
    public ResponseEntity<String> SendEmail() throws GeneralSecurityException, IOException, MessagingException {

       String response= userService.sendemail("a", "Bienvenue", "Votre compte a été créé avec succès, votre mot de passe est: 111");
        return ResponseEntity.ok(response);
    }

    @PostMapping("/update")
    public ResponseEntity<String> updateUser(@RequestBody UserAndEmploiDto userandemploi) {

        String response=userService.updateuser(userandemploi);

        Journal journal=new Journal();
        journal.setTitre("Modification d'un utilisateur");
        journal.setDescription("Les informations de l'utilisateur ayant le nom"+userandemploi.getNom()+" "+userandemploi
                .getPrenom()+" ont été modifiées.");
        journal.setDate((java.sql.Date) new Date());
        journalRepository.save(journal);

        return ResponseEntity.ok(response);

    }



    @PostMapping("/delete")
    public ResponseEntity<?> deleteUser(@RequestBody Map<String, Integer> payload) {
        Optional<User> userOptional = userRepository.findById(payload.get("cin"));
        Journal journal=new Journal();
        if (userOptional.isPresent()) {
            User user=userOptional.get();

            journal.setTitre("Suppression d'un utilisateur");
            //  journal.setDate((java.sql.Date) new Date());
            journal.setDescription("L'utilisateur ayant le nom:"+user.getNom()+" "+user.getPrenom()+
                    " et de cin:"+user.getCin()+" a été supprimé.");
        }
        try {
            Integer cin = payload.get("cin");
            userService.deleteUserByCin(cin);
            journalRepository.save(journal);

            return ResponseEntity.ok().body(new HashMap<String, String>() {{
                put("message", "Utilisateur supprimé avec succès");
            }});
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new HashMap<String, String>() {{
                put("error", "Erreur lors de la suppression: " + e.getMessage());
            }});
        }
    }



    @GetMapping("/all")
    public ResponseEntity<List<UserDTO>> getAllUsers() {
        try {
            // Récupérer tous les utilisateurs
            List<User> users = userRepository.findAll();

            // Convertir les entités User en UserDTO
            List<UserDTO> userDTOs = users.stream()
                    .map(UserDTO::new)
                    .collect(Collectors.toList());

            // Retourner la liste des DTO avec le statut 200 OK
            return ResponseEntity.ok(userDTOs);
        } catch (Exception e) {
            // Retourner une réponse d'erreur avec un message explicatif
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Collections.emptyList());
        }
    }


    @PostMapping("/incrementerheuressupp")
    public ResponseEntity<?> updateheures(@RequestBody HeuresSuppDTO hsdto)
    {
        try {


            User user = userRepository.findByCin(hsdto.getCin()).
                    orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le CIN: " + hsdto.getCin()));


            Emploi emploi = user.getEmploi();
            emploi.setHeuresSuppl(emploi.getHeuresSuppl()+1);


            emploiRepository.save(emploi);
            return ResponseEntity.status(HttpStatus.CREATED).body(hsdto);

        }
        catch (EntityNotFoundException e) {

            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "Erreur lors de mise a jour d heures supplémentaires."));
        } catch (Exception e) {

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur lors de mise a jour d heures supplémentaires."));
        }




    }


    @PostMapping("/decrementerheuressupp")
    public ResponseEntity<?> decrementerheures(@RequestBody HeuresSuppDTO hsdto) {
        try {
            // Validation du CIN

            // Recherche de l'utilisateur
            User user = userRepository.findByCin(hsdto.getCin())
                    .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le CIN: " + hsdto.getCin()));

            Emploi emploi = user.getEmploi();

            // Vérification des heures supplémentaires
            if (emploi == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Aucun emploi trouvé pour cet utilisateur"));
            }

            if (emploi.getHeuresSuppl() <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Les heures supplémentaires sont déjà à zéro"));
            }

            // Décrémentation des heures
            emploi.setHeuresSuppl(emploi.getHeuresSuppl() - 1);
            emploiRepository.save(emploi);

            // Construction de la réponse
            Map<String, Object> response = new HashMap<>();
            response.put("cin", user.getCin());
            response.put("heuresSuppl", emploi.getHeuresSuppl());
            response.put("message", "Heures supplémentaires mises à jour avec succès");

            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Pour le debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur lors de la mise à jour"));
        }
    }


    @PostMapping("/updateconge")
    public ResponseEntity<?> updateconge(@RequestBody HeuresSuppDTO hsdto)
    {
        try{
            User user=userRepository.findByCin(hsdto.getCin()).
                    orElseThrow(()->new EntityNotFoundException("Utilisateur non trouvé avec le CIN: " + hsdto.getCin()));


            Emploi emploi=user.getEmploi();
            if (emploi == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Aucun emploi trouvé pour cet utilisateur"));
            }

            if (hsdto.getHeuresSupp() < 12) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Les heures supplémentaires doivent supérieur ou égale a 12 pour la conversion"));
            }
            int h=hsdto.getHeuresSupp();
            while(h>=12)
            {
                emploi.setSoldeConge(emploi.getSoldeConge()+1);
                h-=12;
            }
            emploi.setHeuresSuppl(h);


            emploiRepository.save(emploi);
            // Construction de la réponse
            Map<String, Object> response = new HashMap<>();

            response.put("heuresSuppl", emploi.getHeuresSuppl());
            response.put("message", "Heures supplémentaires mises à jour avec succès");
            return ResponseEntity.ok(response);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest()
                    .body(Map.of("error", e.getMessage()));
        } catch (Exception e) {
            e.printStackTrace(); // Pour le debugging
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "Erreur interne du serveur lors de la mise à jour"));
        }

        }


    @PostMapping("/file")
    public ResponseEntity<String> generateAndStorePdf(@RequestBody Map<String, Integer> request) {
        try {
            int cin = request.get("cin");
            byte[] pdfContent = pdfGenerationService.generatePdf(cin);

            PdfFile pdfFile = new PdfFile();
            pdfFile.setCin(cin);
            pdfFile.setFileName("user_" + cin + ".pdf");
            pdfFile.setFileType("application/pdf");
            pdfFile.setFileSize((long) pdfContent.length);
            pdfFile.setContenu(new SerialBlob(pdfContent));
            pdfFile.setCreatedAt((java.sql.Date) new Date());
            pdfFile.setType("User Report");
            pdfFile.setPeriod("Monthly");

            pdfFileRepository.save(pdfFile);

            return ResponseEntity.ok("PDF generated and stored successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating PDF: " + e.getMessage());
        }
    }
    @PostMapping("/certificattravail")
    public ResponseEntity<String> generatechhada3amal(@RequestBody Map<String, Integer> request) {
        try {
            int cin = request.get("cin");
            byte[] pdfContent = pdfGenerationService.generateCertificateOfWork(cin);

            PdfFile pdfFile = new PdfFile();
            pdfFile.setCin(cin);
            pdfFile.setFileName(" certificat_travail" + cin + ".pdf");
            pdfFile.setFileType("application/pdf");
            pdfFile.setFileSize((long) pdfContent.length);
            pdfFile.setContenu(new SerialBlob(pdfContent));
            pdfFile.setCreatedAt((java.sql.Date) new Date());
            pdfFile.setType("Certificat Travail");
            pdfFile.setPeriod("yearly");

            pdfFileRepository.save(pdfFile);

            return ResponseEntity.ok("PDF generated and stored successfully.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error generating PDF: " + e.getMessage());
        }
    }


    @PostMapping("/files")
    public ResponseEntity<?> getPdfFilesByCin(@RequestBody Map<String, Integer> request) {
        try {
            int cin = request.get("cin");
            if (cin <= 0) {
                return ResponseEntity.badRequest().body("CIN must be a positive integer.");
            }

            List<PdfFileDTO> pdfFiles = pdfGenerationService.getPdfFilesByCin(cin);
            if (pdfFiles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF files found for CIN: " + cin);
            }

            return ResponseEntity.ok(pdfFiles);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }


    @PostMapping("/download-files")
    public ResponseEntity<?> downloadPdfFilesByCin(@RequestBody Map<String, Integer> request) {
        try {
            int cin = request.get("cin"); // Récupère le CIN depuis le corps de la requête
            List<PdfFile> pdfFiles = pdfFileRepository.findByCin(cin); // Récupère les fichiers PDF

            if (pdfFiles.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF files found for CIN: " + cin);
            }

            // Si un seul fichier est trouvé, retournez-le directement
            if (pdfFiles.size() == 1) {
                PdfFile pdfFile = pdfFiles.get(0);
                byte[] fileContent = pdfGenerationService.getPdfFileContent(pdfFile.getContenu());
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfFile.getFileName() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(fileContent);
            }

            // Si plusieurs fichiers sont trouvés, créez une archive ZIP
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            try (ZipOutputStream zipOut = new ZipOutputStream(baos)) {
                for (PdfFile pdfFile : pdfFiles) {
                    ZipEntry zipEntry = new ZipEntry(pdfFile.getFileName());
                    zipOut.putNextEntry(zipEntry);
                    byte[] fileContent = pdfGenerationService.getPdfFileContent(pdfFile.getContenu());
                    zipOut.write(fileContent);
                    zipOut.closeEntry();
                }
            } catch (Exception e) {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Error creating ZIP file: " + e.getMessage());
            }

            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"pdf_files.zip\"")
                    .contentType(MediaType.APPLICATION_OCTET_STREAM)
                    .body(baos.toByteArray());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }
    @GetMapping("/download-files/{id}")
    public ResponseEntity<?> downloadPdf(@PathVariable int id) {
        try {

            Optional<PdfFile> pdfFile = pdfFileRepository.findById(id);

            if (!pdfFile.isPresent()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("No PDF files found for id ") ;
            }



                byte[] fileContent = pdfGenerationService.getPdfFileContent(pdfFile.get().getContenu());
                return ResponseEntity.ok()
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + pdfFile.get().getFileName() + "\"")
                        .contentType(MediaType.APPLICATION_PDF)
                        .body(fileContent);



        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An error occurred: " + e.getMessage());
        }
    }











    }







