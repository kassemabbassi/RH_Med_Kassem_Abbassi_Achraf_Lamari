package org.example.rh_admin.DTO.User;

import com.fasterxml.jackson.annotation.JsonIgnore;

import java.sql.Date;

public class UserAbsenceDTO {
    private int cin;
    private String identifiant;
    private String nom;
    private String prenom;
    private boolean absent;
    @JsonIgnore
    private Date abs;

    public Date getAbs() {
        return abs;
    }

    public void setAbs(Date abs) {
        this.abs = abs;
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

    public boolean isAbsent() {
        return absent;
    }

    public void setAbsent(boolean absent) {
        this.absent = absent;
    }
}
