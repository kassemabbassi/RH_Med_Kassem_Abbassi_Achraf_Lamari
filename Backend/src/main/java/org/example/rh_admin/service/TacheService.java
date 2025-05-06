package org.example.rh_admin.service;

import jakarta.persistence.EntityNotFoundException;
import org.example.rh_admin.entity.Tache;
import org.example.rh_admin.repository.TacheRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.sql.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class TacheService {
    @Autowired
    private TacheRepository tacheRepository;

    public Map<String,Object> getStatistique (Date debutDate , Date finDate)  {
        Map<String , Object> statistique = new HashMap<>();
        statistique.put("nbTotal",tacheRepository.CountAll(debutDate, finDate));
        statistique.put("etats",tacheRepository.CountByEtat(debutDate, finDate));
        statistique.put("tacheParEns",tacheRepository.CountByCin(debutDate, finDate));

        return statistique;
    }

    public List<Tache> findAll()
    {
        return tacheRepository.findAll();
    }
    public Tache save(Tache tache)
    {
        if(tache.getEtat()==null)
        {
            tache.setEtat("A-FAIRE");
        }
        tache.setDateDebut(new java.util.Date());

        return tacheRepository.save(tache);
    }


    public Tache update(Integer id, Tache tachedetails)
    {
        Tache existingTache=tacheRepository.findById(id).
                orElseThrow(() -> new EntityNotFoundException("Tâche non trouvée"));
        existingTache.setTitre(tachedetails.getTitre());
        existingTache.setDescription(tachedetails.getDescription());
        existingTache.setEtat(tachedetails.getEtat());
        existingTache.setDateFin(tachedetails.getDateFin());
        existingTache.setValide(tachedetails.getValide());

        return tacheRepository.save(existingTache);
    }

    public void delete(Integer id) {
        Tache tache = tacheRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Tâche non trouvée"));
        tacheRepository.delete(tache);
    }


}
