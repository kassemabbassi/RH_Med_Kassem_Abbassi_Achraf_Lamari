package org.example.rh_admin.repository;


import org.example.rh_admin.entity.Tache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@Repository
public interface TacheRepository extends JpaRepository<Tache,Integer> {

    @Query("select count(t) from Tache t where (t.dateDebut<=:df and t.dateDebut>=:dd)or (t.dateFin>=:dd and t.dateFin<=:dd)")
    int CountAll(@Param("dd") Date dd, @Param("df") Date df);;

    @Query("select count(t.etat) as nb , t.etat as etat  from Tache t  where (t.dateDebut<=:df and t.dateDebut>=:dd)or (t.dateFin>=:dd and t.dateFin<=:dd) group by t.etat ")
    List<Map<String, Object>> CountByEtat(@Param("dd") Date dd, @Param("df") Date df);;

    @Query("select IFNULL(count(distinct (t.usertache.cin))/count(*),0)  from Tache t  where (t.dateDebut<=:df and t.dateDebut>=:dd)or (t.dateFin>=:dd and t.dateFin<=:dd)")
    int CountByCin(@Param("dd") Date dd, @Param("df") Date df);;
}
