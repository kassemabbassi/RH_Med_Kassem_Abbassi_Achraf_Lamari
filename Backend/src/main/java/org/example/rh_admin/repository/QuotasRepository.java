package org.example.rh_admin.repository;


import org.example.rh_admin.entity.Quotas;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface    QuotasRepository extends JpaRepository<Quotas,Integer> {
    Quotas findByQuota(int quota);


    Optional<Quotas> findByTypeEmploye(String typeEmploye);



}
