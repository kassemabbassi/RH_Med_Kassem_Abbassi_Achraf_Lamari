package org.example.rh_admin.DTO;


import org.example.rh_admin.entity.Quotas;

public class QuotasDTO {
    private int idQuota;



    private String typeEmploye;
    private int quota;


;

    public QuotasDTO(Quotas q)
    {
        this.idQuota=q.getId_quota();
        this.typeEmploye=q.getTypeEmploye();
        this.quota=q.getQuota();


    }


    public QuotasDTO()
    {

    }

    public String getTypeEmploye() {
        return typeEmploye;
    }

    public void setTypeEmploye(String typeEmploye) {
        this.typeEmploye = typeEmploye;
    }

    public int getQuota() {
        return quota;
    }

    public void setQuota(int quota) {
        this.quota = quota;
    }

    public int getIdQuota() {
        return idQuota;
    }

    public void setIdQuota(int idQuota) {
        this.idQuota = idQuota;
    }


}
