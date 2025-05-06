package org.example.rh_admin.DTO;

import java.util.List;

public class RequeteRechercherDTO {
    private String motCle;
    private List<String> grades;
    private List<String> postes;
    private List<String> specialites;
    private List<Integer> anciennites;
    private String sexe;
    private String handicape;
    private List<String> roles;
    private List<String> departements;

    // Getters and Setters
    public String getMotCle() {
        return motCle;
    }

    public void setMotCle(String motCle) {
        this.motCle = motCle;
    }

    public List<String> getGrades() {
        return grades;
    }

    public void setGrades(List<String> grades) {
        this.grades = grades;
    }

    public List<String> getPostes() {
        return postes;
    }

    public void setPostes(List<String> postes) {
        this.postes = postes;
    }

    public List<String> getSpecialites() {
        return specialites;
    }

    public void setSpecialites(List<String> specialites) {
        this.specialites = specialites;
    }

    public List<Integer> getAnciennites() {
        return anciennites;
    }

    public void setAnciennites(List<Integer> anciennites) {
        this.anciennites = anciennites;
    }

    public String getSexe() {
        return sexe;
    }

    public void setSexe(String sexe) {
        this.sexe = sexe;
    }

    public String getHandicape() {
        return handicape;
    }

    public void setHandicape(String handicape) {
        this.handicape = handicape;
    }

    public List<String> getRoles() {
        return roles;
    }

    public void setRoles(List<String> roles) {
        this.roles = roles;
    }

    public List<String> getDepartements() {
        return departements;
    }

    public void setDepartements(List<String> departements) {
        this.departements = departements;
    }

    @Override
    public String toString() {
        return "\n\nExampleDTO{" +
                "motCle='" + motCle + '\'' +
                ", grades=" + grades +
                ", postes=" + postes +
                ", specialites=" + specialites +
                ", anciennites=" + anciennites +
                ", sexe='" + sexe + '\'' +
                ", handicape='" + handicape + '\'' +
                ", roles=" + roles +
                ", departements=" + departements +
                "}\n\n ";
    }
}

