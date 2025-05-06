package org.example.rh_admin.repository;


import org.example.rh_admin.entity.PdfFile;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PdfFileRepository extends JpaRepository<PdfFile,Integer> {


    @Query("select p from PdfFile p where p.type='rapport'")
    List<PdfFile> getRapports();


    List<PdfFile> findByCin(int cin);
}
