package org.example.rh_admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.Date;

@Entity
@Table(name = "tache")
public class Tache {

    @Id
    @GeneratedValue
    @Column(name = "id_tache", nullable = false)
    private Integer idTache;

    @ManyToOne
    @JoinColumn(name = "cin",referencedColumnName = "cin",nullable = false)
    @JsonIgnore
    private User usertache;
    private String titre;
    private String description;
    private String etat;
    private java.util.Date dateDebut;
    private java.util.Date dateFin;
    private Boolean valide;



    public Tache(Boolean valide, java.util.Date dateFin, java.util.Date dateDebut, String etat, String description, String titre, User usertache) {
        this.valide = valide;
        this.dateFin = dateFin;
        this.dateDebut = dateDebut;
        this.etat = etat;
        this.description = description;
        this.titre = titre;
        this.usertache = usertache;
    }

    public Tache() {

    }

    public Integer getIdTache() {
        return idTache;
    }

    public void setIdTache(Integer idTache) {
        this.idTache = idTache;
    }

    public User getUsertache() {
        return usertache;
    }

    public void setUsertache(User usertache) {
        this.usertache = usertache;
    }

    public String getTitre() {
        return titre;
    }

    public void setTitre(String titre) {
        this.titre = titre;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getEtat() {
        return etat;
    }

    public void setEtat(String etat) {
        this.etat = etat;
    }

    public java.util.Date getDateDebut() {
        return dateDebut;
    }

    public void setDateDebut(java.util.Date dateDebut) {
        this.dateDebut = dateDebut;
    }

    public java.util.Date getDateFin() {
        return dateFin;
    }

    public void setDateFin(Date dateFin) {
        this.dateFin = dateFin;
    }

    public Boolean getValide() {
        return valide;
    }

    public void setValide(Boolean valide) {
        this.valide = valide;
    }
}
