package org.example.rh_admin.entity;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonProperty;
import jakarta.persistence.*;


import java.sql.Blob;
import java.sql.Date;
import java.sql.SQLException;

@Entity
@Table(name = "pdf_files")
public class PdfFile {

    @Id
    @GeneratedValue
    @Column(name = "id", nullable = false)
    private int id;

    @ManyToOne
    @JsonIgnore
    @JoinColumn(name = "cin", referencedColumnName = "cin", nullable = false,insertable = false,updatable = false)
    private User userfiles;
    int cin;


    private String fileName;


    private String fileType;


    private Long fileSize;

    @Lob
    @JsonIgnore
    private Blob contenu;

    @Transient
    @JsonProperty("contenuBytes")
    private byte[] contenuBytes;


    private java.util.Date createdAt;


    private String type;


    private String period;


    public User getUserfiles() {
        return userfiles;
    }

    public void setUserfiles(User userfiles) {
        this.userfiles = userfiles;
    }

    public int getCin() {
        return cin;
    }

    public void setCin(int cin) {
        this.cin = cin;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }


    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }

    public String getFileType() {
        return fileType;
    }

    public void setFileType(String fileType) {
        this.fileType = fileType;
    }

    public Long getFileSize() {
        return fileSize;
    }

    public void setFileSize(Long fileSize) {
        this.fileSize = fileSize;
    }

    public Blob getContenu() {
        return contenu;
    }

    public void setContenu(Blob contenu) {
        this.contenu = contenu;
    }

    public java.util.Date getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Date createdAt) {
        this.createdAt = createdAt;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getPeriod() {
        return period;
    }

    public void setPeriod(String period) {
        this.period = period;
    }

    public byte[] getContenuBytes() {
        if (contenu == null) return null;
        try {
            return contenu.getBytes(1, (int) contenu.length());
        } catch (SQLException e) {
            e.printStackTrace();
            return null;
        }
    }

    public void setContenuBytes(byte[] contenuBytes) {
        this.contenuBytes = contenuBytes;
    }
}
