package org.example.rh_admin.entity;

import jakarta.persistence.*;

import java.io.Serializable;
import java.sql.Date;

@Entity
public class Conge implements Serializable {
    @Id
    @GeneratedValue
    private int idconge;
    private Date dateDebut;
    private Date dateFin;
    private String type;
    private int periode;
    private boolean valide;

    @ManyToOne
    @JoinColumn(name = "cin", referencedColumnName = "cin", nullable = false)
    private User user;

    public Conge(Date dateDebut, Date dateFin, String type, int periode, User user) {
        this.dateDebut = dateDebut;
        this.dateFin = dateFin;
        this.type = type;
        this.periode = periode;
        this.user = user;
    }
    public Conge() {}

    public int getIdconge() {
        return idconge;
    }

    public void setIdconge(int idconge) {
        this.idconge = idconge;
    }

    public Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public Date getDateFin() {
        return dateFin;
    }

    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public int getPeriode() {
        return periode;
    }

    public void setPeriode(int periode) {
        this.periode = periode;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public boolean isValide() {
        return valide;
    }

    public void setValide(boolean valide) {
        this.valide = valide;
    }
}