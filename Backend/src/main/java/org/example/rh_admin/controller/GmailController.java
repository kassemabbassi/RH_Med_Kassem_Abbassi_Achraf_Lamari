package org.example.rh_admin.controller;

import com.google.api.services.gmail.Gmail;
import com.google.api.services.gmail.model.Message;
import jakarta.mail.MessagingException;
import org.example.rh_admin.service.GmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;


import java.io.IOException;
import java.security.GeneralSecurityException;


@RestController
@RequestMapping("/sendemail")
public class GmailController {

    @Autowired
    private GmailService gmailService;

    @PostMapping("")
    public ResponseEntity<String> SendEmail() throws GeneralSecurityException, IOException, MessagingException {
        Gmail service = GmailService.getGmailService();
        Message email = GmailService.createEmail("achraaflaamari@gmail.com", "isimm.staff.zone@gmail.com",
                "Test Subject", "Hello, this is a test email!");
        GmailService.sendEmail(service, "me", email);
        return ResponseEntity.ok("Email sent successfully!");
    }
}
