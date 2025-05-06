package org.example.rh_admin.DTO.User;

import org.example.rh_admin.entity.Absence;
import org.example.rh_admin.entity.Conge;
import org.example.rh_admin.entity.User;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;


import java.sql.Date;
import java.util.List;

@Mapper(componentModel = "spring")
public interface UserMapper {

    @Mapping(target = "status", source = "mesconges", qualifiedByName = "UserStatus")
    UserHomeDTO toUserHomeDTO(User user) ;
    @Named("UserStatus")
    default String mapMescongesToStatus(List<Conge> mesconges){
        Date currentdate = new Date(new java.util.Date().getTime());
        for(Conge conge : mesconges){
            if(currentdate.after(conge.getDateDebut()) && currentdate.before(conge.getDateFin())){
                return "unactif";
            }
        }
        return "actif";
    }




    @Mapping(target = "absent", expression = "java(mapAbsenceToAbsent(user.getAbsences(), abs))")
    UserAbsenceDTO toUserAbsenceDTO(User user,Date abs) ;

    default boolean mapAbsenceToAbsent(List<Absence> absences,Date abs) {

        for (Absence absence : absences) {
            System.out.println(absence.getDate());
            System.out.println(abs.getMonth());
            if (absence.getDate().equals(abs)) {
                return true;
            }
        }
        return false;
    }



}
