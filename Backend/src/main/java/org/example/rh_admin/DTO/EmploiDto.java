package org.example.rh_admin.DTO;

import java.util.Date;

public class EmploiDto {
    private Integer id;
    private int userCin;
    private String grade;
    private String poste;
    private Date dateDebut;
    private String specialite;
    private String role;
    private String departement;
    private int anciennete;
    private int soldeConge;
    private int heuresSuppl;

    public EmploiDto(Integer id, int userCin, String grade, String poste, Date dateDebut, String specialite,
                     String role, String departement, int anciennete, int soldeConge, int heuresSuppl) {
        this.id = id;
        this.userCin = userCin;
        this.grade = grade;
        this.poste = poste;
        this.dateDebut = dateDebut;
        this.specialite = specialite;
        this.role = role;
        this.departement = departement;
        this.anciennete = anciennete;
        this.soldeConge = soldeConge;
        this.heuresSuppl = heuresSuppl;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public int getUserCin() {
        return userCin;
    }

    public void setUserCin(int userCin) {
        this.userCin = userCin;
    }

    public String getGrade() {
        return grade;
    }

    public void setGrade(String grade) {
        this.grade = grade;
    }

    public String getPoste() {
        return poste;
    }

    public void setPoste(String poste) {
        this.poste = poste;
    }

    public Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public String getSpecialite() {
        return specialite;
    }

    public void setSpecialite(String specialite) {
        this.specialite = specialite;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public String getDepartement() {
        return departement;
    }

    public void setDepartement(String departement) {
        this.departement = departement;
    }

    public int getAnciennete() {
        return anciennete;
    }

    public void setAnciennete(int anciennete) {
        this.anciennete = anciennete;
    }

    public int getSoldeConge() {
        return soldeConge;
    }

    public void setSoldeConge(int soldeConge) {
        this.soldeConge = soldeConge;
    }

    public int getHeuresSuppl() {
        return heuresSuppl;
    }

    public void setHeuresSuppl(int heuresSuppl) {
        this.heuresSuppl = heuresSuppl;
    }
}
