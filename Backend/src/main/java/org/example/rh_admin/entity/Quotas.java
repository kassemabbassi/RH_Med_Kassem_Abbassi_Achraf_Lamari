package org.example.rh_admin.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "quotas")
public class Quotas {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int id_quota;


    private String typeEmploye;


    private int quota;

    @OneToMany(mappedBy = "quota")
    @JsonIgnore
    private List<Emploi> emplois;

    public Quotas() {

    }
    public Quotas(String typeEmploye, int quota) {
        this.typeEmploye = typeEmploye;
        this.quota = quota;
    }
    public int getId_quota() {
        return id_quota;
    }

    public void setId_quota(int id_quota) {
        this.id_quota = id_quota;
    }

    public String getTypeEmploye() {
        return typeEmploye;
    }

    public void setTypeEmploye(String type_employe) {
        this.typeEmploye = type_employe;
    }

    public int getQuota() {
        return quota;
    }

    public void setQuota(int quota) {
        this.quota = quota;
    }

    public List<Emploi> getEmplois() {
        return emplois;
    }

    public void setEmplois(ArrayList<Emploi> emplois) {
        this.emplois = emplois;
    }
}
