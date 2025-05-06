package org.example.rh_admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.sql.Date;
@Entity
@Table(name = "notification")
public class Notification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id;
    private String titre;
    private String contenu;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "recepteur", referencedColumnName = "cin")
    private User recepteuruser;
    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "expediteur", referencedColumnName = "cin")
    private User expediteuruser;
    private Boolean statut;
    private Date createdAt;
    private boolean type;

    public boolean isType() {
        return type;
    }

    public void setType(boolean type) {
        this.type = type;
    }

    public Notification() {
    }

    public Notification(String titre, String contenu, User recepteur, User expediteur, Boolean statut, Date createdAt) {
        this.titre = titre;
        this.contenu = contenu;
        this.recepteuruser = recepteur;
        this.expediteuruser = expediteur;
        this.statut = statut;
        this.createdAt = createdAt;
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

    public User getRecepteuruser() {
        return recepteuruser;
    }

    public void setRecepteuruser(User recepteuruser) {
        this.recepteuruser = recepteuruser;
    }

    public User getExpediteuruser() {
        return expediteuruser;
    }

    public void setExpediteuruser(User expediteuruser) {
        this.expediteuruser = expediteuruser;
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