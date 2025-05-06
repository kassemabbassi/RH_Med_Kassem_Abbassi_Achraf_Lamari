package org.example.rh_admin;

import org.example.rh_admin.entity.*;
import org.example.rh_admin.repository.*;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ConfigurableApplicationContext;

import java.sql.Date;
import java.util.Optional;

@SpringBootApplication
public class RhAdminApplication {

    public static void main(String[] args) {
        ConfigurableApplicationContext ctx= SpringApplication.run(RhAdminApplication.class, args);


        }


}
