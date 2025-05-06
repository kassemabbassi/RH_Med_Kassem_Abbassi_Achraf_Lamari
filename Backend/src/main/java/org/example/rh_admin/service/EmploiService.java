package org.example.rh_admin.service;

import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.Quotas;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.EmploiRepository;
import org.example.rh_admin.repository.QuotasRepository;
import org.example.rh_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EmploiService {
    @Autowired
    private EmploiRepository emploiRepository;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private QuotasRepository quotasRepository;

    public List<String> getGrade(){
        return emploiRepository.getGrades();
    }

    public List<String> getPostes(){
        return emploiRepository.getPostes();
    }

    public List<String> getSpecialites(){
        return emploiRepository.getSpecialites();
    }
    public List<String> getAnciennites(){
        return emploiRepository.getAnciennites();
    }
    public List<User> Recherche(String mot, List<String> grades, List<String> postes, List<String> specialites,
                                List<Integer> anciennites, String sexe, String handicape,
                                List<String> roles, List<String> departements){

        Set<User> set = new HashSet<>(userRepository.findAll());
        if(!mot.isEmpty()) {
            Set<User> userSet= new HashSet<User>();
            userSet.addAll(userRepository.rechercheintelligent(mot));
            List<Emploi> userEM = emploiRepository.rechercheintelligent(mot);
            for (Emploi emploi : userEM) {
                userSet.add(emploi.getUser());
            }
            set.retainAll(userSet);
        }else if (grades.isEmpty()&&postes.isEmpty()&&specialites.isEmpty()&&anciennites.isEmpty()
                &&sexe.isEmpty()&&handicape.isEmpty()&&roles.isEmpty()&&departements.isEmpty()) {
            return new ArrayList<>(set);
        }


        if(!sexe.isEmpty()){
            set.retainAll(userRepository.findBySexe(sexe.toLowerCase()));
        }
        if(!handicape.isEmpty()){
            set.retainAll(userRepository.findByHandicape(handicape));
        }



        Set userSet= new HashSet<User>();

        if(!roles.isEmpty()) {
            for (String role : roles) {
                List<Emploi> emploiList = emploiRepository.findByRole(role.toLowerCase());
                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());
                }
            }
            set.retainAll(userSet);
            userSet = new HashSet<User>();
        }

        if(!grades.isEmpty()) {
            for (String grade : grades) {
                List<Emploi> emploiList = emploiRepository.findByGrade(grade.toLowerCase());
                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());

                }
            }
            set.retainAll(userSet);
            userSet = new HashSet<User>();
        }

        if(!postes.isEmpty()) {
            for (String poste : postes) {
                List<Emploi> emploiList = emploiRepository.findByPoste(poste.toLowerCase());
                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());
                }

            }
            set.retainAll(userSet);
            userSet = new HashSet<User>();
        }
        if(!specialites.isEmpty()) {
            for (String specialite : specialites) {
                List<Emploi> emploiList = emploiRepository.findBySpecialite(specialite.toLowerCase());
                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());
                }

            }
            set.retainAll(userSet);

            userSet = new HashSet<User>();
        }

        if(!anciennites.isEmpty()) {
            for (int anciennete : anciennites) {
                List<Emploi> emploiList = emploiRepository.findByAnciennete(anciennete);
                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());
                }
            }

            set.retainAll(userSet);

            userSet = new HashSet<User>();
        }

        if(!departements.isEmpty()) {
            for (String departement : departements) {
                List<Emploi> emploiList = emploiRepository.findByDepartement(departement.toLowerCase());

                for (Emploi emploi : emploiList) {
                    userSet.add(emploi.getUser());
                }

            }
            set.retainAll(userSet);
        }



        return new ArrayList<>(set);





    }


    public Map<String,Object> getStatistique (){
        Map<String , Object> statistique = new HashMap<>();
        statistique.put("nbTotal",emploiRepository.CountAll());
        statistique.put("grades",emploiRepository.CountByGrade());
        statistique.put("departements",emploiRepository.CountByDepartement());
        statistique.put("postes",emploiRepository.CountByPoste());
        statistique.put("anciennetes",emploiRepository.CountByAnciennete());

        statistique.put("sommeHeureSupp",emploiRepository.SommeHeuresSuppl());
        statistique.put("congeMoyen",emploiRepository.MoyenSoldeConge());



        return statistique;
    }





    public Emploi find(int cin)
    {
        Optional<Emploi> e= emploiRepository.findByCin(cin);
        if(e.isEmpty())
        {
            return null;
        }
        Emploi emp = e.get();
        System.out.println(e);
        return emp;

    }
    public Quotas findQuotas(String role)
    {
        int quota=0;
        if("enseignant".equals(role))
        {
            quota=10;
        }
        else if("administrateur".equals(role))
        {
            quota=15;
        }
        return quotasRepository.findByQuota(quota);

    }



}
