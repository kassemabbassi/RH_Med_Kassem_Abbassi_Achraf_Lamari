package org.example.rh_admin.DTO.User;

import java.sql.Date;
import javax.annotation.processing.Generated;
import org.example.rh_admin.entity.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2025-05-06T13:42:29+0100",
    comments = "version: 1.5.5.Final, compiler: javac, environment: Java 23.0.1 (Oracle Corporation)"
)
@Component
public class UserMapperImpl implements UserMapper {

    @Override
    public UserHomeDTO toUserHomeDTO(User user) {
        if ( user == null ) {
            return null;
        }

        UserHomeDTO userHomeDTO = new UserHomeDTO();

        userHomeDTO.setStatus( mapMescongesToStatus( user.getMesconges() ) );
        userHomeDTO.setCin( user.getCin() );
        userHomeDTO.setIdentifiant( user.getIdentifiant() );
        userHomeDTO.setNom( user.getNom() );
        userHomeDTO.setPrenom( user.getPrenom() );
        userHomeDTO.setAdresse( user.getAdresse() );
        userHomeDTO.setTelephone( user.getTelephone() );
        userHomeDTO.setSituation( user.getSituation() );
        userHomeDTO.setSexe( user.getSexe() );
        userHomeDTO.setDatenaissance( user.getDatenaissance() );
        userHomeDTO.setHandicape( user.getHandicape() );
        userHomeDTO.setEmail( user.getEmail() );

        return userHomeDTO;
    }

    @Override
    public UserAbsenceDTO toUserAbsenceDTO(User user, Date abs) {
        if ( user == null && abs == null ) {
            return null;
        }

        UserAbsenceDTO userAbsenceDTO = new UserAbsenceDTO();

        if ( user != null ) {
            userAbsenceDTO.setCin( user.getCin() );
            userAbsenceDTO.setIdentifiant( user.getIdentifiant() );
            userAbsenceDTO.setNom( user.getNom() );
            userAbsenceDTO.setPrenom( user.getPrenom() );
        }
        userAbsenceDTO.setAbs( abs );
        userAbsenceDTO.setAbsent( mapAbsenceToAbsent(user.getAbsences(), abs) );

        return userAbsenceDTO;
    }
}
