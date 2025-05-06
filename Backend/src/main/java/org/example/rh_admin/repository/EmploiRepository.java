package org.example.rh_admin.repository;

import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.Optional;

public interface EmploiRepository extends JpaRepository<Emploi,Integer> {
    @Query("select e from Emploi e where e.user.cin=:cin")
    public Optional<Emploi> findByCin(@Param("cin") int cin);

    @Query("select distinct(e.grade) from Emploi e")
    public List<String> getGrades();

    @Query("select distinct(e.poste) from Emploi e")
    public List<String> getPostes();

    @Query("select distinct(e.specialite) from Emploi e")
    public List<String> getSpecialites();

    @Query("select distinct(e.anciennete) from Emploi e")
    public List<String> getAnciennites();

    @Query("SELECT e FROM Emploi e WHERE " +
            "e.grade LIKE %:mc% OR " +
            "e.poste LIKE %:mc% OR " +
            "CAST(e.dateDebut AS string) LIKE %:mc% OR " +
            "e.specialite LIKE %:mc% OR " +
            "e.role LIKE %:mc% OR " +
            "e.departement LIKE %:mc% OR " +
            "CAST(e.anciennete AS string) LIKE %:mc% OR " +
            "CAST(e.soldeConge AS string) LIKE %:mc% OR " +
            "CAST(e.heuresSuppl AS string) LIKE %:mc%")
    public List<Emploi> rechercheintelligent(@Param("mc") String mc);

    @Query("select e from Emploi e where e.role=:role")
    List<Emploi> findByRole(@Param("role") String role);

    @Query("select e from Emploi e where e.anciennete=:anciennete")
    List<Emploi> findByAnciennete(@Param("anciennete") int anciennete);


    @Query("select e from Emploi e where e.grade=:grade")
    List<Emploi> findByGrade(@Param("grade")String grade);


    @Query("select e from Emploi e where e.poste=:poste")
    List<Emploi> findByPoste(@Param("poste")String poste);


    @Query("select e from Emploi e where e.specialite=:specialite")
    List<Emploi> findBySpecialite(@Param("specialite")String specialite);


    @Query("select e from Emploi e where e.departement=:departement")
    List<Emploi> findByDepartement(@Param("departement")String departement);

    @Query("select count(e) from Emploi e where e.role!='admin'")
    int CountAll();

    @Query("select count(*) as nb,e.grade as grade  from Emploi e where e.role!='admin' group by e.grade")
    List<Map<String, Object>> CountByGrade();

    @Query("select count(*) as nb,e.poste as poste  from Emploi e  where e.role!='admin' group by e.poste")
    List<Map<String, Object>> CountByPoste();

    @Query("select count(*) as nb,e.departement as departement  from Emploi e  where e.role!='admin' group by e.departement")
    List<Map<String, Object>> CountByDepartement();

    @Query("select e.anciennete as anciennete,count(*) as nb  from Emploi e  where e.role!='admin' group by e.anciennete ")
    List<Map<String, Object>> CountByAnciennete();

    @Query("select  sum(e.heuresSuppl)from Emploi e  where e.role!='admin' ")
    int SommeHeuresSuppl();

    @Query("select  sum(e.soldeConge)/count(*) from Emploi e  where e.role!='admin' ")
    int MoyenSoldeConge();



    Optional<Emploi> findByUser(User user);
}
