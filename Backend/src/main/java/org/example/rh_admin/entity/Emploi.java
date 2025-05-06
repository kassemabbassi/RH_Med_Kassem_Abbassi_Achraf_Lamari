package org.example.rh_admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;

@Entity
@Table(name = "emploi")
public class Emploi {

    @Id
    @GeneratedValue
    private int id_emploi;

    @OneToOne
    @JoinColumn(name = "cin",nullable = false,unique = true)
    @JsonIgnore
    private User user;
    private String grade;
    private String poste;
    private Date dateDebut;
    private String specialite;
    private String role;
    private String departement;
    private int anciennete;
    private int soldeConge;
    private int heuresSuppl;


    @ManyToOne
    @JoinColumn(name = "id_quota", referencedColumnName = "id_quota", nullable = false )
    private Quotas quota;

    public Emploi(String grade, String poste, Date dateDebut, String specialite, String role, String departement, int anciennete, int soldeConge, int heuresSuppl, Quotas quota, User user) {
        this.grade = grade;
        this.poste = poste;
        this.dateDebut = dateDebut;
        this.specialite = specialite;
        this.role = role;
        this.departement = departement;
        this.anciennete = anciennete;
        this.soldeConge = soldeConge;
        this.heuresSuppl = heuresSuppl;
        this.quota = quota;
        this.user = user;
    }
    public Emploi() {}

    public int getId_emploi() {
        return id_emploi;
    }

    public void setId_emploi(int id_emploi) {
        this.id_emploi = id_emploi;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public Quotas getQuota() {
        return quota;
    }

    public void setQuota(Quotas quota) {
        this.quota = quota;
    }
}
