package org.example.rh_admin.repository;

import org.example.rh_admin.entity.Conge;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;
import java.util.Map;

@Repository
public interface CongeRepository extends JpaRepository<Conge, Integer> {

    @Query("select c from Conge c where c.user.cin != :cin and c.valide = false ")
    public List<Conge> findInvalide(@Param("cin") Integer cin);


    @Query("select count(c) from Conge c where (c.dateDebut>= :dd and c.dateDebut<=:dd) or (c.dateFin<=:df and c.dateFin>=:dd)")
    int CountAll(@Param("dd") Date dd, @Param("df") Date df);

    @Query("select count(c.type) as nb , c.type  as type  from Conge c where (c.dateDebut>= :dd and c.dateDebut<=:dd) or (c.dateFin<=:df and c.dateFin>=:dd) group by c.type  ")
    List<Map<String, Object>> CountByType(@Param("dd") Date dd, @Param("df") Date df);

    @Query("select CASE WHEN count(*) = 0 THEN 0  ELSE sum(c.periode)/count(*)" +
            "       END  from  Conge c where (c.dateDebut>= :dd and c.dateDebut<=:dd) or (c.dateFin<=:df and c.dateFin>=:dd)")
    int MoyenConge(@Param("dd") Date dd, @Param("df") Date df);

    @Query("select count(*)   from  Conge c where c.valide=true and ((c.dateDebut>= :dd and c.dateDebut<=:dd) or (c.dateFin<=:df and c.dateFin>=:dd))")
    int TauxValide(@Param("dd") Date dd, @Param("df") Date df);


}
