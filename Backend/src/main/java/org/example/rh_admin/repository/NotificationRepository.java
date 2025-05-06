package org.example.rh_admin.repository;


import org.example.rh_admin.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification,Integer> {
    //List<Notification> findByRecepteuruserCin(int cin);
    List<Notification> findByRecepteuruserCinOrExpediteuruserCin(int cinDestinataire, int cinExpediteur);



    List<Notification> findByRecepteuruserCin(int destinataire);


    List<Notification> findByTypeTrue();

    List<Notification> findByRecepteuruserCinAndTypeTrue(int cin);

}
