package org.example.rh_admin.controller;


import org.example.rh_admin.DTO.CongeDTO;
import org.example.rh_admin.entity.Conge;
import org.example.rh_admin.entity.Notification;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.CongeRepository;
import org.example.rh_admin.repository.NotificationRepository;
import org.example.rh_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/user/conge")
public class CongeController {


    @Autowired
    private CongeRepository congeRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;


    @PostMapping("/demande")
    public ResponseEntity<?> demanderConge(@RequestBody CongeDTO congedto) {
        try {
            // Vérifier si l'utilisateur existe
            Optional<User> optionalUser = userRepository.findByCin(congedto.getCinExpediteur());
            if (optionalUser.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Utilisateur non trouvé avec le CIN : " + congedto.getCinExpediteur());
            }
            User user = optionalUser.get();

            // Vérifier si la date de début est valide
            if (congedto.getDateDebut() == null) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("La date de début est obligatoire.");
            }

            // Vérifier si le solde de congé est suffisant
            if (user.getEmploi().getSoldeConge() < congedto.getPeriode()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Solde de congé insuffisant. Disponible : " + user.getEmploi().getSoldeConge() + " jours.");
            }

            // Calcul de la date de fin
            Calendar calendar = Calendar.getInstance();
            calendar.setTime(congedto.getDateDebut());
            calendar.add(Calendar.DAY_OF_MONTH, congedto.getPeriode());
            Date dateFin = calendar.getTime();

            // Création de l'entité Conge
            Conge conge = new Conge();
            conge.setUser(user);
            conge.setPeriode(congedto.getPeriode());
            conge.setType(congedto.getType());
            conge.setDateDebut(congedto.getDateDebut());
            conge.setDateFin((java.sql.Date) dateFin);
            conge.setValide(false);
            // Sauvegarde de la demande de congé
            congeRepository.save(conge);



            // Vérifier si le responsable RH existe
            Optional<User> userrh = userRepository.findByCin(11111111);
            if (userrh.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body("Le responsable RH n'a pas été trouvé.");
            }
            User rh = userrh.get();

            // Création et enregistrement de la notification avec la cause du congé
            Notification notification = new Notification();
            notification.setTitre("Demande de congé "+conge.getIdconge());
            notification.setContenu("L'" + user.getEmploi().getRole() + " " + user.getNom() +
                    " a demandé un congé du " + new SimpleDateFormat("yyyy-MM-dd").format(congedto.getDateDebut()) +
                    " au " + new SimpleDateFormat("yyyy-MM-dd").format(dateFin) +
                    " pour la raison suivante : \"" + congedto.getType() + "\".");
            notification.setRecepteuruser(rh);
            notification.setExpediteuruser(user);
            notification.setStatut(false);
            notification.setCreatedAt((java.sql.Date) new Date());
            notification.setType(true);
            notificationRepository.save(notification);



            return ResponseEntity.ok("Demande de congé envoyée avec succès. Date de fin prévue : " +
                    new SimpleDateFormat("yyyy-MM-dd").format(dateFin));

        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de l'envoi de la demande : " + e.getMessage());
        }
    }


    @GetMapping
    public List<Conge> getAll()
    {
        return congeRepository.findAll();
    }


}
