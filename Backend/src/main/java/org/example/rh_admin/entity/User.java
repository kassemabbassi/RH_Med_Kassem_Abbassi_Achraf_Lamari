package org.example.rh_admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.io.Serializable;
import java.util.ArrayList;
import java.sql.Date;
import java.util.List;

@Entity
@Table(name = "\"user\"")
public class User implements Serializable {
    @Id
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
    @Column(unique=true)
    private String email;

    private boolean conge;

    public boolean isConge() {
        return conge;
    }

    public void setConge(boolean conge) {
        this.conge = conge;
    }

    @JsonIgnore
    private String password;

    @JsonIgnore
    private String token;


    @OneToMany(mappedBy = "user",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Conge> mesconges;

    @OneToMany(mappedBy = "usertache",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Tache> taches;

    @OneToMany(mappedBy = "userfiles",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<PdfFile> files;

    @OneToOne(mappedBy = "user",cascade = CascadeType.ALL)
    private Emploi emploi;

    @OneToMany(mappedBy = "recepteuruser",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Notification> notifications;

    @OneToMany(mappedBy = "expediteuruser",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Notification> notificationsenvoyees;

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    @OneToMany(mappedBy = "userAbsence",cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Absence> absences;


    public User(int cin, String identifiant, String nom, String prenom, String adresse, int telephone, String situation, String sexe, Date datenaissance, String handicape, String email, String password) {
        this.cin = cin;
        this.identifiant = identifiant;
        this.nom = nom;
        this.prenom = prenom;
        this.adresse = adresse;
        this.telephone = telephone;
        this.situation = situation;
        this.sexe = sexe;
        this.datenaissance = datenaissance;
        this.handicape = handicape;
        this.email = email;
        this.password = password;
    }

    public User() {
    }

    @Override
    public String toString() {
        return "User{" +
                "cin=" + cin +
                ", identifiant='" + identifiant + '\'' +
                ", nom='" + nom + '\'' +
                ", prenom='" + prenom + '\'' +
                ", adresse='" + adresse + '\'' +
                ", telephone=" + telephone +
                ", situation='" + situation + '\'' +
                ", sexe='" + sexe + '\'' +
                ", datenaissance=" + datenaissance +
                ", handicape='" + handicape + '\'' +
                ", email='" + email + '\'' +
                ", password='" + password + '\'' +
                '}';
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

    public List<Conge> getMesconges() {
        return mesconges;
    }

    public void setMesconges(List<Conge> mesconges) {
        this.mesconges = mesconges;
    }

    public List<Tache> getTaches() {
        return taches;
    }

    public void setTaches(List<Tache> taches) {
        this.taches = taches;
    }

    public List<PdfFile> getFiles() {
        return files;
    }

    public void setFiles(List<PdfFile> files) {
        this.files = files;
    }

    public Emploi getEmploi() {
        return emploi;
    }

    public void setEmploi(Emploi emploi) {
        this.emploi = emploi;
    }

    public List<Notification> getNotifications() {
        return notifications;
    }

    public void setNotifications(List<Notification> notifications) {
        this.notifications = notifications;
    }

    public List<Notification> getNotificationsenvoyees() {
        return notificationsenvoyees;
    }

    public void setNotificationsenvoyees(List<Notification> notificationsenvoyees) {
        this.notificationsenvoyees = notificationsenvoyees;
    }

    public List<Absence> getAbsences() {
        return absences;
    }

    public void setAbsences(List<Absence> absences) {
        this.absences = absences;
    }
}
