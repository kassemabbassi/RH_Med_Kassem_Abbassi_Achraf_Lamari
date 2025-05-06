package org.example.rh_admin.service;


import org.example.rh_admin.entity.Conge;
import org.example.rh_admin.repository.CongeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class CongeService {
    @Autowired
    private CongeRepository congeRepository;




    public void ValideConge(int id) {
        Conge conge = congeRepository.findById(id).get();
        conge.setValide(true);
        congeRepository.save(conge);
    }

    public Map<String,Object> getStatistique (Date debutDate , Date finDate)  {
        Map<String , Object> statistique = new HashMap<>();
        int total=congeRepository.CountAll(debutDate, finDate);
        int taux=(total==0?0:congeRepository.TauxValide(debutDate, finDate)*100/total);
        statistique.put("nbTotal",total);
        statistique.put("Moyen",congeRepository.MoyenConge(debutDate, finDate));
        statistique.put("types",congeRepository.CountByType(debutDate, finDate));
        statistique.put("taux",taux);

        return statistique;
    }
}
