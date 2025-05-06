package org.example.rh_admin.repository;


import org.example.rh_admin.entity.Journal;
import org.springframework.data.jpa.repository.JpaRepository;

public interface JournalRepository extends JpaRepository<Journal,Integer> {
}
