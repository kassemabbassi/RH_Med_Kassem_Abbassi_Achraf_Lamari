package org.example.rh_admin.repository;


import org.example.rh_admin.entity.Absence;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.sql.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Repository
public interface AbsenceRepository extends JpaRepository<Absence,Integer> {


    @Modifying
    @Transactional
    @Query("delete from Absence a where a.userAbsence.cin=:x and a.date =:y")
    public int removeAbsenceBycinDate(@Param("x") int cin , @Param("y") Date date );

    @Query("select count(a) from Absence a where a.date>= :dd and a.date<=:df")
    int CountAll(@Param("dd") Date dd, @Param("df") Date df);

    @Query("select count( a.userAbsence.cin) as nb, a.userAbsence.cin as cin from Absence a where a.date>= :dd and a.date<=:df group by a.userAbsence.cin")
    List<Map<String, Object>> CountByCin(@Param("dd") Date dd, @Param("df") Date df);

    @Query("select count( a.date) as nb, a.date as date from Absence a where a.date>= :dd and a.date<=:df group by a.date")
    List<Map<String, Object>> CountByDate(@Param("dd") Date dd, @Param("df") Date df);

}
