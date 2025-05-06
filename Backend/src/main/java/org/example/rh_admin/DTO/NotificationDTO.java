package org.example.rh_admin.DTO;


import org.example.rh_admin.entity.Notification;

import java.sql.Date;

public class NotificationDTO {
    private String titre;
    private String contenu;
    private int cinrecepteur;

    private int cinexpediteur;
    private Boolean statut;
    private Date createdAt;

    private int id;
    private String nomexpediteur;

    private String type;


    private int congeId;

    public int getCongeId() {
        return congeId;
    }

    public void setCongeId(int congeId) {
        this.congeId = congeId;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public NotificationDTO()
    {

    }
    public NotificationDTO(Notification n)
    {
        this.id=n.getId();
        this.titre=n.getTitre();
        this.contenu=n.getContenu();
        this.createdAt=n.getCreatedAt();
        this.cinrecepteur=n.getRecepteuruser().getCin();
        this.cinexpediteur=n.getExpediteuruser().getCin();
        this.statut=n.getStatut();

    }

    public String getNomexpediteur() {
        return nomexpediteur;
    }

    public void setNomexpediteur(String nomexpediteur) {
        this.nomexpediteur = nomexpediteur;
    }

    public int getCinexpediteur() {
        return cinexpediteur;
    }

    public void setCinexpediteur(int cinexpediteur) {
        this.cinexpediteur = cinexpediteur;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getContenu() {
        return contenu;
    }

    public void setContenu(String contenu) {
        this.contenu = contenu;
    }

    public int getCinrecepteur() {
        return cinrecepteur;
    }

    public void setCinrecepteur(int cinrecepteur) {
        this.cinrecepteur = cinrecepteur;
    }

    public int getExpediteurcin() {
        return cinexpediteur;
    }

    public void setExpediteurcin(int expediteurcin) {
        this.cinexpediteur = expediteurcin;
    }

    public Boolean getStatut() {
        return statut;
    }

    public void setStatut(Boolean statut) {
        this.statut = statut;
    }

    public Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }
}
