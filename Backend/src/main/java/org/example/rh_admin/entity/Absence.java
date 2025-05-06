package org.example.rh_admin.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.springframework.context.annotation.DependsOn;


import java.sql.Date;

@Entity
@Table(name = "absence")

public class Absence {
    @Id
    @GeneratedValue
    private int absence_id;

    @ManyToOne
    @JoinColumn(name = "cin", referencedColumnName = "cin", nullable = false )
    private User userAbsence;


    @Column(name = "date", nullable = false)
    private Date date;


    public Absence() {}

    public int getAbsence_id() {
        return absence_id;
    }

    public void setAbsence_id(int absence_id) {
        this.absence_id = absence_id;
    }

    public User getUserAbsence() {
        return userAbsence;
    }

    public void setUserAbsence(User userAbsence) {
        this.userAbsence = userAbsence;
    }

    public Date getDate() {
        return date;
    }

    public void setDate(Date date) {
        this.date = date;
    }


}
