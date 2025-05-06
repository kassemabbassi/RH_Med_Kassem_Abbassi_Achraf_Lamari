package org.example.rh_admin.DTO;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.User;

import java.sql.Date;


public class UserDTO {
    private int cin;
    private String identifiant;
    private String nom;
    private String prenom;
    private String adresse;
    private int telephone;
    private String situation;
    private String sexe;
    private Date datenaissance;
    private String handicape;
    private String email;
    private String password;

    private int heuresSupp;

    private boolean conge;
    @JsonIgnore
    private Emploi e;

    private String role;



    public UserDTO()
    {

    }

    public UserDTO(User user) {
        this.cin = user.getCin();
        this.identifiant = user.getIdentifiant();
        this.nom = user.getNom();
        this.prenom = user.getPrenom();
        this.adresse = user.getAdresse();
        this.telephone = user.getTelephone();
        this.situation = user.getSituation();
        this.sexe = user.getSexe();
        this.datenaissance = user.getDatenaissance();
        this.handicape = user.getHandicape();
        this.email = user.getEmail();
       Emploi emploi=user.getEmploi();
       this.heuresSupp=emploi.getHeuresSuppl();
       this.conge=user.isConge();
        this.e=user.getEmploi();
        this.role=e.getRole();

    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public Emploi getE() {
        return e;
    }

    public void setE(Emploi e) {
        this.e = e;
    }

    public boolean isConge() {
        return conge;
    }

    public void setConge(boolean conge) {
        this.conge = conge;
    }

    public int getCin() {
        return cin;
    }

    public void setCin(int cin) {
        this.cin = cin;
    }

    public String getIdentifiant() {
        return identifiant;
    }

    public void setIdentifiant(String identifiant) {
        this.identifiant = identifiant;
    }

    public String getNom() {
        return nom;
    }

    public void setNom(String nom) {
        this.nom = nom;
    }

    public String getPrenom() {
        return prenom;
    }

    public void setPrenom(String prenom) {
        this.prenom = prenom;
    }

    public String getAdresse() {
        return adresse;
    }

    public void setAdresse(String adresse) {
        this.adresse = adresse;
    }

    public int getTelephone() {
        return telephone;
    }

    public void setTelephone(int telephone) {
        this.telephone = telephone;
    }

    public String getSituation() {
        return situation;
    }

    public void setSituation(String situation) {
        this.situation = situation;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public Date getDatenaissance() {
        return datenaissance;
    }

    public void setDatenaissance(Date datenaissance) {
        this.datenaissance = datenaissance;
    }

    public String getHandicape() {
        return handicape;
    }

    public void setHandicape(String handicape) {
        this.handicape = handicape;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public int getHeuresSupp() {
        return heuresSupp;
    }

    public void setHeuresSupp(int heuresSupp) {
        this.heuresSupp = heuresSupp;
    }
}
