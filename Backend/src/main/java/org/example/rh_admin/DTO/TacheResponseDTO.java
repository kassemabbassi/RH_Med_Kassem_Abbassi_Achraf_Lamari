package org.example.rh_admin.DTO;



import org.example.rh_admin.entity.Tache;

import java.util.Date;

public class TacheResponseDTO {
    private int cin;
    private String titre;
    private String description;
    private String etat;
    private Date dateDebut;
    private Date dateFin;

    private int id_tache;

    private String responsable;
    public TacheResponseDTO()
    {

    }


    public TacheResponseDTO(Tache t)
    {
        this.cin=t.getUsertache().getCin();
        this.id_tache=t.getIdTache();
        this.titre=t.getTitre();
        this.description=t.getDescription();
        this.dateDebut=t.getDateDebut();
        this.dateFin=t.getDateFin();
        this.etat=t.getEtat();

    }

    public String getResponsable() {
        return responsable;
    }

    public void setResponsable(String responsable) {
        this.responsable = responsable;
    }

    public int getCin() {
        return cin;
    }

    public void setCin(int cin) {
        this.cin = cin;
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



    public int getId_tache() {
        return id_tache;
    }

    public void setId_tache(int id_tache) {
        this.id_tache = id_tache;
    }
}
