package org.example.rh_admin.controller;


import org.example.rh_admin.DTO.NotificationDTO;
import org.example.rh_admin.entity.Conge;
import org.example.rh_admin.entity.Notification;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.CongeRepository;
import org.example.rh_admin.repository.NotificationRepository;
import org.example.rh_admin.repository.UserRepository;
import org.example.rh_admin.service.NotificationService;
import org.example.rh_admin.service.PdfGenerationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;


import java.sql.Date;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/notifications")

public class NotificationController {
    @Autowired
    private NotificationService notificationService;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private NotificationRepository notificationRepository;
    @Autowired
    private PdfGenerationService pdfGenerationService;

    @Autowired
    private CongeRepository congeRepository;


    @PutMapping("/{id}/mark-read")
    public ResponseEntity<?> markAsRead(@PathVariable int id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

            notification.setStatut(true);
            notificationRepository.save(notification);

            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {
            // Retourner un message clair pour les erreurs spécifiques
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error marking notification as read");
        }

    }

    @DeleteMapping("/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable int id) {
        try {
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification not found"));

            notificationRepository.delete(notification);
            return ResponseEntity.ok().build();
        } catch (ResponseStatusException e) {

            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error deleting notification ");
        }

    }


    @GetMapping("/{cin}")
    public ResponseEntity<?> getNotificationsByDestinataire(@PathVariable int cin) {
        try {
            // Vérification si l'utilisateur avec ce CIN existe
            User user = userRepository.findByCin(cin)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur avec CIN " + cin + " introuvable."));

            // Récupération des notifications pour ce destinataire
            List<Notification> notifications = notificationRepository.findByRecepteuruserCin(cin);

            // Vérification si des notifications sont trouvées
            if (notifications.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NO_CONTENT)
                        .body("Aucune notification trouvée pour l'utilisateur avec CIN " + cin);
            }

            // Conversion des notifications en DTOs
            List<NotificationDTO> notifDTOS = notifications.stream()
                    .map(notification -> {
                        NotificationDTO dto = new NotificationDTO(notification);
                        if (notification.getExpediteuruser() != null) {
                            dto.setNomexpediteur(notification.getExpediteuruser().getNom() + " " + notification.getExpediteuruser().getPrenom());
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());

            // Retourner les notifications sous forme de liste
            return ResponseEntity.ok(notifDTOS);

        } catch (ResponseStatusException e) {
            // Gestion des erreurs spécifiques avec un message détaillé
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Erreur : " + e.getReason());
        } catch (IllegalArgumentException e) {
            // Gestion des erreurs d'argument incorrect (ex. mauvais CIN)
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Erreur dans les paramètres fournis : " + e.getMessage());
        } catch (Exception e) {
            // Gestion des erreurs générales et inattendues
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur interne est survenue : " + e.getMessage());
        }
    }


    @GetMapping("/generation/{cin}")
    public ResponseEntity<?> getNotificationsByDestinataireAndTypeTrue(@PathVariable int cin) {
        try {
            // Vérification si l'utilisateur avec ce CIN existe
            User user = userRepository.findByCin(cin)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur avec CIN " + cin + " introuvable."));

            // Récupération des notifications pour ce destinataire avec type=true
            List<Notification> notifications = notificationRepository.findByRecepteuruserCinAndTypeTrue(cin);

            // Conversion des notifications en DTOs
            List<NotificationDTO> notifDTOS = notifications.stream()
                    .map(notification -> {
                        NotificationDTO dto = new NotificationDTO(notification);
                        if (notification.getExpediteuruser() != null) {
                            dto.setNomexpediteur(notification.getExpediteuruser().getNom() + " " + notification.getExpediteuruser().getPrenom());
                        }
                        return dto;
                    })
                    .collect(Collectors.toList());

            // Retourner les notifications sous forme de liste
            return ResponseEntity.ok(notifDTOS);

        } catch (ResponseStatusException e) {
            // Retourner un message clair pour les erreurs spécifiques
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getReason());
        } catch (Exception e) {
            // Gestion des erreurs générales
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Une erreur interne est survenue : " + e.getMessage());
        }
    }


    @PostMapping("/demande")
    public ResponseEntity<?> creerdemande(@RequestBody NotificationDTO nd) {
        try {
            // 🔍 Récupérer l'expéditeur (employé qui fait la demande)
            User user = userRepository.findByCin(nd.getCinexpediteur())
                    .orElseThrow(() -> new RuntimeException("Utilisateur expéditeur non trouvé"));

            // 🔍 Récupérer le RH (destinataire de la demande)
            User userrh = userRepository.findByCin(11111111)
                    .orElseThrow(() -> new RuntimeException("Utilisateur RH non trouvé"));

            // 🔎 Vérification de l'attestation demandée
            boolean isTravail = nd.getType().contains("travail");
            boolean isConge = nd.getType().contains("congé");

            // ✅ Cas 1 : Attestation de travail (aucune restriction)
            if (isTravail) {
                return notificationService.creerNotification(nd, user, userrh);
            }

            // ❌ Cas 2 : Attestation de congé sans être en congé
            if (isConge && !user.isConge()) {
                return ResponseEntity.badRequest().body("Vous devez être en congé pour générer une attestation de congé.");
            }

            // ✅ Cas 3 : Attestation de congé (si l'utilisateur est en congé)
            return notificationService.creerNotification(nd, user, userrh);

        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de l'envoi de la notification : " + e.getMessage());
        }
    }







   /* @GetMapping("/valider/{id}")
    public ResponseEntity<?> valider(@PathVariable int id) {
        try {
            // Vérification de l'existence de la notification
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification avec ID " + id + " introuvable."));

            // Récupération de l'utilisateur RH
            User userrh = userRepository.findByCin(11111111)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur RH introuvable."));

            // Récupération de l'expéditeur de la notification (employé)
            int recepteurCin = notification.getExpediteuruser().getCin();
            User user = userRepository.findByCin(recepteurCin)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur associé à la notification introuvable."));

            if (notification.getTitre().contains("Demande de congé")) {
                if (user.getMesconges().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Aucune période de congé associée à cet utilisateur.");
                }

                // Extraction de l'ID du congé à partir du titre de la notification
                String idCongeStr = notification.getTitre().substring(17);
                int idConge;
                try {
                    idConge = Integer.parseInt(idCongeStr);
                } catch (NumberFormatException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("ID du congé invalide dans le titre de la notification.");
                }

                // Vérification du congé à valider
                Conge conge = congeRepository.findById(idConge)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Le congé associé à cette notification est introuvable."));

                // Mise à jour des informations de l'utilisateur et du congé
                if (!user.getMesconges().contains(conge)) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Le congé sélectionné ne correspond pas à cet utilisateur.");
                }

                user.setConge(true);
                user.getEmploi().setSoldeConge(user.getEmploi().getSoldeConge() - conge.getPeriode());
                conge.setValide(true);

                userRepository.save(user);
                congeRepository.save(conge);

                // Création d'une notification de validation
                Notification notification1 = new Notification();
                notification1.setTitre("Validation de demande de congé");
                notification1.setContenu("Votre demande de congé a été validée avec succès. Date de fin prévue : " + conge.getDateFin());
                notification1.setCreatedAt(new Date());
                notification1.setExpediteuruser(userrh);
                notification1.setRecepteuruser(user);
                notification1.setStatut(false);
                notification1.setType(false);

                notificationRepository.save(notification1);
                return ResponseEntity.ok("Demande de congé validée avec succès. Date de fin prévue : " + conge.getDateFin());
            }


            if (notification.getTitre().length() < 25) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Titre de la notification invalide pour ce traitement.");
            }
            if (notification.getTitre().contains("Attestation")) {
                String demandeType = notification.getTitre().substring(25);
                notification.setStatut(true);  // Marquer la notification comme traitée
                notificationRepository.save(notification);

                // Trier la liste des congés en fonction de la date de début (du plus récent au plus ancien)
                List<Conge> mesCongesTries = user.getMesconges().stream()
                        .sorted(Comparator.comparing(Conge::getDateDebut).reversed())  // Tri décroissant selon la date de début
                        .collect(Collectors.toList());

                // Vérifier s'il y a des congés et si le premier est en cours
                if (!mesCongesTries.isEmpty()) {
                    Conge actuel = mesCongesTries.get(0);

                    // Vérifier si le congé est actuel (en cours)
                    Date currentDate = new Date();
                    if (currentDate.after(actuel.getDateDebut()) && currentDate.before(actuel.getDateFin())) {
                        // Génération du document PDF
                        String response = "";
                        try {

                            response = pdfGenerationService.generate_attestation_conge(recepteurCin, actuel);
                        } catch (Exception e) {
                            // Gérer les erreurs lors de la génération du PDF
                            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                    .body("Erreur lors de la génération du PDF : " + e.getMessage());
                        }

                        // Création d'une notification de validation pour l'utilisateur
                        Notification notification2 = new Notification();
                        notification2.setTitre("Validation de génération de " + demandeType);
                        notification2.setContenu("Votre demande de génération de " + demandeType + " a été validée. Vous pouvez maintenant la consulter et télécharger le PDF.");
                        notification2.setCreatedAt(new Date());
                        notification2.setExpediteuruser(userrh); // Utilisateur RH
                        notification2.setRecepteuruser(user); // Utilisateur concerné par la demande
                        notification2.setStatut(false); // Notification non lue
                        notification2.setType(false);  // Notification de type validation (par exemple)

                        // Sauvegarder la notification
                        notificationRepository.save(notification2);

                        // Réponse avec le lien ou le statut de la génération PDF
                        return ResponseEntity.ok(response);
                    } else {
                        // Retourner un message si le congé n'est pas en cours
                        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                                .body("Le congé sélectionné n'est pas actuellement en cours.");
                    }
                } else {
                    // Retourner un message si aucune demande de congé n'est trouvée
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Aucun congé valide trouvé pour cet utilisateur.");
                }
            }



            String demandeType = notification.getTitre().substring(25);
                notification.setStatut(true);
                notificationRepository.save(notification);

                // Génération du document PDF
                String response;
                try {
                    response = pdfGenerationService.generate_certificat_travail(recepteurCin);
                } catch (Exception e) {
                    return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                            .body("Erreur lors de la génération du PDF : " + e.getMessage());
                }

                // Création d'une notification de validation
                Notification notification2 = new Notification();
                notification2.setTitre("Validation de génération de " + demandeType);
                notification2.setContenu("Votre demande de génération de " + demandeType + " a été validée. Vous pouvez maintenant la consulter et télécharger le PDF.");
                notification2.setCreatedAt(new Date());
                notification2.setExpediteuruser(userrh);
                notification2.setRecepteuruser(user);
                notification2.setStatut(false);
                notification2.setType(false);

                notificationRepository.save(notification2);
                return ResponseEntity.ok(response);

            } catch(ResponseStatusException e){
                return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
            } catch(Exception e){
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Erreur interne du serveur : " + e.getMessage());
            }
        }*/

  @GetMapping("/valider/{id}")
  public ResponseEntity<?> valider(@PathVariable int id) {
      try {
          // Vérification de l'existence de la notification
          Notification notification = notificationRepository.findById(id)
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Notification introuvable avec ID : " + id));

          // Récupération du RH (récepteur)
          User userRh = userRepository.findByCin(11111111)
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur RH introuvable."));

          // Récupération de l'expéditeur de la notification
          User user = userRepository.findByCin(notification.getExpediteuruser().getCin())
                  .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Utilisateur expéditeur introuvable."));

          String titre = notification.getTitre();

          if (titre.contains("Demande de congé")) {
              return notificationService.validerDemandeConge(user, userRh, notification);
          }

          if (titre.contains("Attestation")) {
              return notificationService.genererAttestation(user, userRh, notification);
          }
          else
              return notificationService.generateCetificatTravail(user,userRh,notification);


      } catch (ResponseStatusException e) {
          return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
      } catch (Exception e) {
          return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne du serveur : " + e.getMessage());
      }
  }






    @GetMapping("/rejetter/{id}")
    public ResponseEntity<?> rejetter(@PathVariable int id) {
        try {
            // Vérification et récupération de la notification
            Notification notification = notificationRepository.findById(id)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Notification avec ID " + id + " introuvable."));

            // Récupération de l'utilisateur RH
            User userrh = userRepository.findByCin(11111111)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Utilisateur RH introuvable."));

            // Récupération de l'expéditeur (l'utilisateur concerné par la notification)
            int recepteurCin = notification.getExpediteuruser().getCin();
            User user = userRepository.findByCin(recepteurCin)
                    .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                            "Utilisateur associé à la notification introuvable."));

            if (notification.getTitre().contains("Demande de congé")) {
                if (user.getMesconges().isEmpty()) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("Aucune période de congé associée à cet utilisateur.");
                }

                // Extraction et validation de l'ID du congé
                String idCongeStr = notification.getTitre().substring(17);
                int idConge;
                try {
                    idConge = Integer.parseInt(idCongeStr);
                } catch (NumberFormatException e) {
                    return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                            .body("ID du congé invalide dans le titre de la notification.");
                }

                // Vérification et suppression du congé
                Conge conge = congeRepository.findById(idConge)
                        .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND,
                                "Le congé associé à cette notification est introuvable."));
                System.out.println("id: "+idConge);

                congeRepository.delete(conge);
                congeRepository.flush();  // Force l'exécution immédiate
                System.out.println("congé supprimé");


                // Création de la notification de refus
                Notification notificationRefus = new Notification();
                notificationRefus.setTitre("Refus de demande de congé");
                notificationRefus.setContenu("Votre demande de congé a été refusée.");
                notificationRefus.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
                notificationRefus.setExpediteuruser(userrh);
                notificationRefus.setRecepteuruser(user);
                notificationRefus.setStatut(false);
                notificationRefus.setType(false);

                notificationRepository.save(notificationRefus);

                return ResponseEntity.ok("Demande de congé refusée avec succès.");
            }

            // Vérification du titre pour éviter les erreurs d'index
            if (notification.getTitre().length() < 25) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body("Titre de la notification invalide pour ce traitement.");
            }

            // Mise à jour de la notification comme traitée
            notification.setStatut(true);
            notificationRepository.save(notification);

            // Création de la notification de refus pour une autre demande (ex: certificat)
            String typeDemande = notification.getTitre().substring(25);
            Notification notificationRefus = new Notification();
            notificationRefus.setTitre("Refus de génération de " + typeDemande);
            notificationRefus.setContenu("Votre demande de génération de " + typeDemande + " a été refusée.");
            notificationRefus.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            notificationRefus.setExpediteuruser(userrh);
            notificationRefus.setRecepteuruser(user);
            notificationRefus.setStatut(false);
            notificationRefus.setType(false);

            notificationRepository.save(notificationRefus);

            return ResponseEntity.ok("Demande de génération de " + typeDemande + " refusée avec succès.");
        } catch (ResponseStatusException e) {
            return ResponseEntity.status(e.getStatusCode()).body(e.getReason());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Erreur interne du serveur : " + e.getMessage());
        }
    }









}
