package org.example.rh_admin.service;


import org.example.rh_admin.DTO.NotificationDTO;
import org.example.rh_admin.entity.Conge;
import org.example.rh_admin.entity.Notification;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.CongeRepository;
import org.example.rh_admin.repository.NotificationRepository;
import org.example.rh_admin.repository.PdfFileRepository;
import org.example.rh_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.sql.Date;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class NotificationService {

    @Autowired
    private NotificationRepository notificationRepository;

    @Autowired
    private PdfFileRepository pdfFileRepository;
    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PdfGenerationService pdfGenerationService;


    @Autowired
    private CongeRepository congeRepository;


    /**
     * Valide une demande de congé.
     */
    public ResponseEntity<?> validerDemandeConge(User user, User userRh, Notification notification) {
        if (user.getMesconges().isEmpty()) {
            return ResponseEntity.badRequest().body("Aucune période de congé associée à cet utilisateur.");
        }

        // Extraction et validation de l'ID du congé
        int idConge;
        try {
            idConge = Integer.parseInt(notification.getTitre().substring(17));
        } catch (NumberFormatException e) {
            return ResponseEntity.badRequest().body("ID du congé invalide dans le titre de la notification.");
        }

        Conge conge = congeRepository.findById(idConge)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Le congé associé est introuvable."));

        if (!user.getMesconges().contains(conge)) {
            return ResponseEntity.badRequest().body("Le congé sélectionné ne correspond pas à cet utilisateur.");
        }

        // Mise à jour des informations
        user.setConge(true);
        user.getEmploi().setSoldeConge(user.getEmploi().getSoldeConge() - conge.getPeriode());
        conge.setValide(true);

        userRepository.save(user);
        congeRepository.save(conge);

        // Création d'une notification
        Notification notifValidation = new Notification();
        notifValidation.setTitre("Validation de demande de congé");
        notifValidation.setContenu("Votre demande de congé a été validée. Date de fin : " + conge.getDateFin());
        notifValidation.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
        notifValidation.setExpediteuruser(userRh);
        notifValidation.setRecepteuruser(user);
        notifValidation.setStatut(false);
        notifValidation.setType(false);

        notificationRepository.save(notifValidation);

        return ResponseEntity.ok("Demande de congé validée avec succès. Date de fin : " + conge.getDateFin());
    }

    /**
     * Génère une attestation de travail ou de congé.
     */
    public ResponseEntity<?> genererAttestation(User user, User userRh, Notification notification) {
        String demandeType = notification.getTitre().substring(25);
        notification.setStatut(true);
        notificationRepository.save(notification);

        if (demandeType.contains("congé")) {
            List<Conge> congesTries = user.getMesconges().stream()
                    .sorted(Comparator.comparing(Conge::getDateDebut).reversed())
                    .collect(Collectors.toList());

            if (congesTries.isEmpty()) {
                return ResponseEntity.badRequest().body("Aucun congé valide trouvé pour cet utilisateur.");
            }

            Conge congeActuel = congesTries.get(0);
            Date currentDate = Date.valueOf(new java.util.Date().toString());

            if (currentDate.after(congeActuel.getDateDebut()) && currentDate.before(congeActuel.getDateFin())) {
                try {
                    String response = pdfGenerationService.generate_attestation_conge(user.getCin(), congeActuel);
                    return creerNotificationEtReponse(user, userRh, demandeType, response);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors de la génération du PDF : " + e.getMessage());
                }
            } else {
                return ResponseEntity.badRequest().body("Le congé sélectionné n'est pas actuellement en cours.");
            }
        }

        try {
            String response = pdfGenerationService.generate_certificat_travail(user.getCin());
            return creerNotificationEtReponse(user, userRh, demandeType, response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la génération du PDF : " + e.getMessage());
        }
    }







    public ResponseEntity<?> generateCetificatTravail(User user, User userRh, Notification notification )
    {
        String demandeType = notification.getTitre().substring(25);
        notification.setStatut(true);
        notificationRepository.save(notification);

        try {
            String response = pdfGenerationService.generate_certificat_travail(user.getCin());
            return creerNotificationEtReponse(user, userRh, demandeType, response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la génération du PDF : " + e.getMessage());
        }
    }

    /**
     * Crée une notification après la génération du document et renvoie la réponse appropriée.
     */
    public ResponseEntity<?> creerNotificationEtReponse(User user, User userRh, String demandeType, String response) {
        Notification notifValidation = new Notification();
        notifValidation.setTitre("Validation de génération de " + demandeType);
        notifValidation.setContenu("Votre demande de génération de " + demandeType + " a été validée. Vous pouvez consulter et télécharger le PDF.");
        notifValidation.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
        notifValidation.setExpediteuruser(userRh);
        notifValidation.setRecepteuruser(user);
        notifValidation.setStatut(false);
        notifValidation.setType(false);

        notificationRepository.save(notifValidation);
        return ResponseEntity.ok(response);
    }





    public ResponseEntity<?> creerNotification(NotificationDTO nd, User user, User userrh) {
        try {
            Notification notification = new Notification();
            notification.setTitre("Demande de génération de " + nd.getType());
            notification.setContenu(String.format(
                    "Demande de génération de %s par %s %s (%d), %s",
                    nd.getType(), user.getNom(), user.getPrenom(), nd.getCinexpediteur(), user.getEmploi().getRole()
            ));

            notification.setExpediteuruser(user);
            notification.setRecepteuruser(userrh);
            notification.setStatut(false);
            notification.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            notification.setType(true);

            // 🔽 Sauvegarde dans la base de données
            notificationRepository.save(notification);

            return ResponseEntity.ok().body("Demande envoyée avec succès.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur lors de la création de la notification : " + e.getMessage());
        }
    }

}
