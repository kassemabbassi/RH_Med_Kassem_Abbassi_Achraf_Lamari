package org.example.rh_admin.service;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import jakarta.mail.MessagingException;
import jakarta.mail.Session;
import jakarta.mail.internet.InternetAddress;
import jakarta.mail.internet.MimeMessage;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.example.rh_admin.DTO.Login.LoginDTO;
import org.example.rh_admin.DTO.User.UserHomeDTO;
import org.example.rh_admin.DTO.User.UserMapper;
import org.example.rh_admin.DTO.UserAndEmploiDto;
import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.Quotas;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.EmploiRepository;
import org.example.rh_admin.repository.QuotasRepository;
import org.example.rh_admin.repository.UserRepository;
import org.example.rh_admin.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.token.TokenService;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.security.GeneralSecurityException;
import java.util.*;

import static org.example.rh_admin.service.GmailService.sendEmail;

@Service
public class UserService {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmploiRepository emploiRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private QuotasRepository quotasRepository;


    @Autowired
    private UserMapper userMapper;

    public static Message createEmail(String to, String from, String subject, String bodyText)
            throws MessagingException, IOException {
        Properties props = new Properties();
        Session session = Session.getDefaultInstance(props, null);

        MimeMessage email = new MimeMessage(session);
        email.setFrom(new InternetAddress(from));
        email.addRecipient(jakarta.mail.Message.RecipientType.TO, new InternetAddress(to));
        email.setSubject(subject);
        email.setText(bodyText);

        ByteArrayOutputStream buffer = new ByteArrayOutputStream();
        email.writeTo(buffer);
        byte[] rawMessageBytes = buffer.toByteArray();
        String encodedEmail = Base64.getUrlEncoder().encodeToString(rawMessageBytes);

        Message message = new Message();
        message.setRaw(encodedEmail);
        return message;
    }

    public String sendemail(String to ,String subject,String bodytext) throws GeneralSecurityException, IOException, MessagingException
    {
        Gmail service= GmailService.getGmailService();
        Message email = createEmail(to, "isimm.staff.zone@gmail.com",
                subject, bodytext);
        sendEmail(service, "me", email);
        return "Email sent successfully!";

    }


    public ResponseEntity<List<UserHomeDTO>> getUsers(String cin) {
        List<User> users = userRepository.findAll();
        users.remove(userRepository.findById(Integer.parseInt(cin)).get());
        List<UserHomeDTO> usersDTO = new ArrayList<>();
        for (User user : users) {
            usersDTO.add(userMapper.toUserHomeDTO(user));
        }
        return ResponseEntity.ok(usersDTO);
    }


    public ResponseEntity<?> verifier_connection(String email, String password, HttpServletResponse response,HttpServletRequest request) {


            Optional<User> userdata = userRepository.findByEmail(email);
            if(userdata.isPresent()) {
                User user = userdata.get();
                if(user.getPassword().equals(password)) {
                    String clientIp = request.getRemoteAddr();
                    String accesstoken =jwtUtil.generateAccessToken(email, clientIp);
                    String refreshtoken=jwtUtil.generateRefreshToken(email);
                    user.setToken(refreshtoken);

                    LoginDTO loginDTO = new LoginDTO();
                    loginDTO.setToken(accesstoken);
                    loginDTO.setCin(user.getCin());
                    loginDTO.setRole(emploiRepository.findByCin(user.getCin()).get().getRole());

                    Cookie cookie0= new Cookie("role", loginDTO.getRole());
                    cookie0.setHttpOnly(true);
                    cookie0.setMaxAge( 60 * 60 * 24 * 30);
                    response.addCookie(cookie0);

                    Cookie cookie= new Cookie("token", refreshtoken);
                    cookie.setHttpOnly(true);
                    cookie.setMaxAge( 60* 60 * 24 * 30);
                    response.addCookie(cookie);
                    userRepository.save(user);
                    return ResponseEntity.ok(loginDTO);
                }else
                    return ResponseEntity.status(400).body("Mot de passe incorrect");
            }else
                return ResponseEntity.status(400).body("Email incorrect");

    }

    public String create(UserAndEmploiDto userandemploi) {


        if (userRepository.existsById(userandemploi.getCin())) {
            return "Erreur : Un utilisateur avec ce CIN existe déjà.";
        }


        User user = new User();
        user.setCin(userandemploi.getCin());
        user.setIdentifiant(userandemploi.getIdentifiant());
        user.setNom(userandemploi.getNom());
        user.setPrenom(userandemploi.getPrenom());
        user.setAdresse(userandemploi.getAdresse());
        user.setTelephone(userandemploi.getTelephone());
        user.setDatenaissance(userandemploi.getDatenaissance());
        user.setEmail(userandemploi.getEmail());
        user.setHandicape(userandemploi.getHandicape());
        user.setSituation(userandemploi.getSituation());
        user.setSexe(userandemploi.getSexe());
        user.setConge(true);

        userRepository.save(user);


        Emploi emploi = new Emploi();
        emploi.setUser(user);


        emploi.setGrade(userandemploi.getGrade());


        emploi.setAnciennete(userandemploi.getAnciennete());




        emploi.setRole(userandemploi.getRole());

        Optional<Quotas> foundQuotas=quotasRepository.findByTypeEmploye(emploi.getRole());

        if(foundQuotas.isPresent())
        {
            Quotas q=foundQuotas.get();
            emploi.setQuota(q);
            emploi.setSoldeConge(q.getQuota());
        }




        emploi.setSpecialite(userandemploi.getSpecialite());


        emploi.setDateDebut(userandemploi.getDateDebut());

        emploi.setPoste(userandemploi.getPoste());
        emploi.setDepartement(userandemploi.getDepartement());
        emploi.setHeuresSuppl(userandemploi.getHeuresSuppl());

        emploiRepository.save(emploi);


        String resetLink = "http://localhost:3000/set-password/" + user.getEmail();
        try {
            String subject = "Définir votre mot de passe";
            String body = "Cliquez sur ce lien pour définir votre mot de passe : " + resetLink;
            sendemail(user.getEmail(), subject, body);
        } catch (Exception e) {
            return "Erreur lors de l'envoi de l'email.";
        }

        return "Utilisateur créé avec succès.";
    }


    public String updateuser(UserAndEmploiDto userandemploi) {

        Optional<User> userOptional = userRepository.findById(userandemploi.getCin());

        if (userOptional.isPresent()) {

            User user = userOptional.get();
            user.setCin(userandemploi.getCin());

            if (userandemploi.getNom().length() > 20 || userandemploi.getNom().contains(" ")
                    || !userandemploi.getNom().matches("[a-zA-Z]+") || userandemploi.getNom().isEmpty()) {
                return "Error: Le nom doit être composé uniquement de lettres et ne doit pas dépasser 20 caractères.";
            }
            user.setNom(userandemploi.getNom());
            if (userandemploi.getPrenom().length() > 20 || userandemploi.getPrenom().contains(" ")
                    || !userandemploi.getPrenom().matches("[a-zA-Z]+") || userandemploi.getPrenom().isEmpty()) {
                return "Error: Le prénom doit être composé uniquement de lettres et ne doit pas dépasser 20 caractères.";
            }
            user.setPrenom(userandemploi.getPrenom());


            // Validation Email
            if (userandemploi.getEmail() == null || userandemploi.getEmail().isEmpty()
                    || !userandemploi.getEmail().matches("^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}$")) {
                return "Error: L'email doit être valide.";
            }


            user.setEmail(userandemploi.getEmail());
            String telephone = Integer.toString(userandemploi.getTelephone());
            if (telephone.length() != 8 || !telephone.matches("[0-9]+")
                    || !(telephone.startsWith("2") || telephone.startsWith("5") || telephone.startsWith("9"))) {
                return "Error: Le téléphone doit être composé de 8 chiffres et commencer par 2, 5 ou 9.";
            }
            user.setTelephone(userandemploi.getTelephone());
            if (userandemploi.getDatenaissance().after(new Date(System.currentTimeMillis()))) {
                return "Error: La date de naissance doit être inférieure à la date actuelle.";
            }
            user.setDatenaissance(userandemploi.getDatenaissance());
            user.setSituation(userandemploi.getSituation());
            user.setSexe(userandemploi.getSexe());
            user.setHandicape(userandemploi.getHandicape());
            user.setIdentifiant(userandemploi.getIdentifiant());
            if (userandemploi.getAdresse().length() > 50) {
                return "Error: L'adresse ne doit pas dépasser 50 caractères.";
            }
            user.setAdresse(userandemploi.getAdresse());
            userRepository.save(user);


            Emploi emploi = emploiRepository.findByUser(user).orElse(new Emploi());



            emploi.setUser(user);
            // Validation du poste
            if (userandemploi.getPoste().isEmpty() || userandemploi.getPoste().isBlank()) {
                return "Error: Le poste ne peut pas être vide.";
            }
            emploi.setPoste(userandemploi.getPoste());
            emploi.setDepartement(userandemploi.getDepartement());
            // Validation des heures supplémentaires
            if (userandemploi.getHeuresSuppl() < 0) {
                return "Error: Les heures supplémentaires sont invalides.";
            }
            emploi.setHeuresSuppl(userandemploi.getHeuresSuppl());
            // Validation de la date de début
            if (userandemploi.getDateDebut().after(new Date(System.currentTimeMillis()))
                    || userandemploi.getDateDebut().before(userandemploi.getDatenaissance())) {
                return "Error: La date de début est invalide.";
            }
            emploi.setDateDebut(userandemploi.getDateDebut());
            // Validation de la spécialité
            if (userandemploi.getSpecialite().isEmpty() || userandemploi.getSpecialite().isBlank()) {
                return "Error: La spécialité ne peut pas être vide.";
            }
            emploi.setSpecialite(userandemploi.getSpecialite());
            emploi.setRole(userandemploi.getRole());
            int quota = 0;
            if ("enseignant".equals(emploi.getRole())) {
                quota = 10;
            } else if ("administrateur".equals(emploi.getRole())) {
                quota = 15;
            }
            Quotas foundQuota = quotasRepository.findByQuota(quota);

            if (foundQuota != null) {
                emploi.setQuota(foundQuota);  // Assigner quota si trouvé
            } else {
                // Gestion du cas où le quota n'a pas été trouvé (par exemple, vous pouvez gérer cette situation ici)
                return "Quota non trouvé.";
            }
            if (userandemploi.getSoldeConge() < 0) {
                return "Error: Le solde de congé est invalide.";
            }
            emploi.setSoldeConge(userandemploi.getSoldeConge());
            if (userandemploi.getGrade().isEmpty() || userandemploi.getGrade().isBlank()) {
                return "Error: Le grade ne peut pas être vide.";
            }
            emploi.setGrade(userandemploi.getGrade());

            emploiRepository.save(emploi);
            return "Utilisateur mis à jour avec succès !";

        }
        return "Utilisateur non trouvé avec le CIN spécifié.";
    }


    public void deleteUserByCin(int cin) {
        // Vérifier si le CIN est null ou vide
        if (Integer.toString(cin) == null || Integer.toString(cin).trim().isEmpty()) {
            throw new IllegalArgumentException("Le CIN ne peut pas être vide");
        }

        // Vérifier si l'utilisateur existe
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le CIN: " + cin));


        try {
            Emploi emploi = emploiRepository.findByUser(user).orElse(new Emploi());
            emploiRepository.delete(emploi);

            userRepository.delete(user);
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors de la suppression de l'utilisateur: " + e.getMessage());
        }
    }





}
