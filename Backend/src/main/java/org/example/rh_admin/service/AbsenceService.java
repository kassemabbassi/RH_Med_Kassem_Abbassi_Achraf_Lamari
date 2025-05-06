package org.example.rh_admin.service;

import org.example.rh_admin.DTO.User.UserAbsenceDTO;
import org.example.rh_admin.DTO.User.UserMapper;
import org.example.rh_admin.entity.Absence;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.AbsenceRepository;
import org.example.rh_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;
import java.sql.Date;

@Service
public class AbsenceService {
    @Autowired
    private AbsenceRepository absenceRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserMapper userMapper;

    public List<UserAbsenceDTO> getAbsence(String cin,String date)  {
        List<User> users = userRepository.findAll();
        users.remove(userRepository.findById(Integer.parseInt(cin)).get());
        List<UserAbsenceDTO> usersAbsence= new ArrayList<>();
        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");

        for (User user : users) {
            try {
                usersAbsence.add(userMapper.toUserAbsenceDTO(user, new Date(formatter.parse(date).getTime())));
            } catch (ParseException e) {
                throw new RuntimeException(e);
            }
        }

        return usersAbsence;
    }

    public void changeAbsence(String cin , String date, boolean absent)  {

        SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd");
        Date dateObj = null;
        try {
            dateObj = new Date(formatter.parse(date).getTime());
        } catch (ParseException e) {
            throw new RuntimeException(e);
        }
        if(absent==false){
            absenceRepository.removeAbsenceBycinDate(Integer.parseInt(cin),dateObj);
        }
        else{
            Absence absence = new Absence();
            absence.setUserAbsence(userRepository.findById(Integer.parseInt(cin)).get());
            absence.setDate(dateObj);
            absenceRepository.save(absence);
        }
    }

    public Map<String,Object> getStatistique (Date debutDate , Date finDate)  {
        Map<String , Object> statistique = new HashMap<>();
        statistique.put("nbTotal",absenceRepository.CountAll(debutDate, finDate));

        statistique.put("AbsenceByCin",absenceRepository.CountByCin(debutDate, finDate));
        statistique.put("AbsenceByDate",absenceRepository.CountByDate(debutDate, finDate));
        return statistique;
    }
}
