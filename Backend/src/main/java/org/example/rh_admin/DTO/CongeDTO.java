package org.example.rh_admin.DTO;

import java.util.Date;

public class CongeDTO {


    private int cinExpediteur;


    private String type;


    private Date dateDebut;

    private Date dateFin;


    private int periode;

    private boolean valide;


    public CongeDTO()
    {

    }

    public int getCinExpediteur() {
        return cinExpediteur;
    }

    public void setCinExpediteur(int cinExpediteur) {
        this.cinExpediteur = cinExpediteur;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public java.sql.Date getDateDebut() {
        return (java.sql.Date) dateDebut;
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

    public int getPeriode() {
        return periode;
    }

    public void setPeriode(int periode) {
        this.periode = periode;
    }
}
