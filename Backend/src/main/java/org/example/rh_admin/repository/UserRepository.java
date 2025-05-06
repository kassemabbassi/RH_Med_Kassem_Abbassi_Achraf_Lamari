package org.example.rh_admin.repository;

import org.example.rh_admin.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    @Query("select u from User u where u.email=:email")
    public Optional<User> findByEmail(@Param("email") String email);

    @Query("select u from User u where u.sexe=:sexe")
    public List<User> findBySexe(@Param("sexe") String sexe);

    @Query("select u from User u where u.handicape=:handicape")
    public List<User> findByHandicape(@Param("handicape") String handicape);


    @Query("SELECT u FROM User u WHERE " +
            "u.adresse LIKE %:mc% OR " +
            "CAST(u.cin AS string) LIKE %:mc% OR " +
            "u.identifiant LIKE %:mc% OR " +
            "u.nom LIKE %:mc% OR " +
            "u.prenom LIKE %:mc% OR " +
            "CAST(u.telephone AS string) LIKE %:mc% OR " +
            "u.situation LIKE %:mc% OR " +
            "u.sexe LIKE %:mc% OR " +
            "CAST(u.datenaissance AS string) LIKE %:mc% OR " +
            "u.handicape LIKE %:mc% OR " +
            "u.email LIKE %:mc%")
    public List<User> rechercheintelligent(@Param("mc") String mc);



    Optional<User> findByCin(int cin);


    @Transactional
    @Modifying
    @Query("UPDATE User u SET u.conge = false WHERE u.cin = :cin")
    void markUserAsNotOnLeave(@Param("cin") int cin);
}
