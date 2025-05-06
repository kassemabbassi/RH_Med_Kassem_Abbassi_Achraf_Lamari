package org.example.rh_admin.service;


import com.itextpdf.layout.element.*;
import com.itextpdf.text.Font;
import com.itextpdf.text.Image;
import com.itextpdf.text.Paragraph;
import com.itextpdf.text.Rectangle;
import org.example.rh_admin.DTO.PdfFileDTO;
import org.example.rh_admin.entity.PdfFile;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.PdfFileRepository;
import org.example.rh_admin.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.*;
import java.sql.Date;
import java.util.List;

















import com.itextpdf.text.*;
import com.itextpdf.text.pdf.BaseFont;
import com.itextpdf.text.pdf.PdfPCell;
import com.itextpdf.text.pdf.PdfPTable;
import com.itextpdf.text.pdf.PdfWriter;
import org.example.rh_admin.entity.Conge;

import javax.sql.rowset.serial.SerialBlob;
import java.io.InputStream;
import java.sql.Blob;
import java.text.SimpleDateFormat;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class PdfGenerationService {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private PdfFileRepository pdfFileRepository;

    public byte[] generatePdf(int cin) throws IOException, DocumentException {
        Optional<User> userOptional = userRepository.findByCin(cin);
        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Créer un document PDF
            Document document = new Document(PageSize.A4,50,50,50,50);
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            PdfWriter.getInstance(document, baos);

            // Ouvrir le document
            document.open();

            // Définir les polices
            BaseFont baseFont = BaseFont.createFont(BaseFont.HELVETICA_BOLD, BaseFont.CP1252, BaseFont.EMBEDDED);
            Font titleFont = new Font(baseFont, 18, Font.BOLD, BaseColor.DARK_GRAY);
            Font headerFont = new Font(Font.FontFamily.HELVETICA, 12, Font.BOLD, BaseColor.WHITE);
            Font contentFont = new Font(Font.FontFamily.HELVETICA, 10, Font.NORMAL, BaseColor.BLACK);
            Image logo = Image.getInstance("C://Users/Kassem Abbessi/Desktop/rhadmin/src/main/java/backend/logo.png");
            logo.scaleToFit(60, 60);
            logo.setAbsolutePosition(
                    document.getPageSize().getWidth() - logo.getScaledWidth() - 50,
                    document.getPageSize().getHeight() - logo.getScaledHeight() - 50
            );
            document.add(logo);
            // Ajouter un titre
            Paragraph title = new Paragraph("Informations de l'utilisateur", titleFont);
            title.setAlignment(Element.ALIGN_CENTER);
            title.setSpacingAfter(20f);
            document.add(title);

            // Créer un tableau pour organiser les informations
            PdfPTable table = new PdfPTable(2); // 2 colonnes
            table.setWidthPercentage(100); // Largeur de 100%
            table.setSpacingBefore(10f);
            table.setSpacingAfter(10f);

            // Définir les styles des cellules
            PdfPCell cell;
            cell = new PdfPCell(new Phrase("Champ", headerFont));
            cell.setBackgroundColor(BaseColor.DARK_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(10f);
            table.addCell(cell);

            cell = new PdfPCell(new Phrase("Valeur", headerFont));
            cell.setBackgroundColor(BaseColor.DARK_GRAY);
            cell.setHorizontalAlignment(Element.ALIGN_CENTER);
            cell.setPadding(10f);
            table.addCell(cell);

            // Remplir le tableau avec les données de l'utilisateur
            addRow(table, "CIN", String.valueOf(user.getCin()), contentFont);
            addRow(table, "Nom", user.getNom(), contentFont);
            addRow(table, "Prénom", user.getPrenom(), contentFont);
            addRow(table, "Adresse", user.getAdresse(), contentFont);
            addRow(table, "Téléphone", String.valueOf(user.getTelephone()), contentFont);
            addRow(table, "Situation", user.getSituation(), contentFont);
            addRow(table, "Sexe", user.getSexe(), contentFont);
            addRow(table, "Date de Naissance", user.getDatenaissance().toString(), contentFont);
            addRow(table, "Handicapé", user.getHandicape(), contentFont);
            addRow(table, "Email", user.getEmail(), contentFont);
            addRow(table, "Rôle", user.getEmploi().getRole(), contentFont);

            // Ajouter le tableau au document
            document.add(table);



            // Fermer le document
            document.close();

            return baos.toByteArray();
        } else {
            throw new RuntimeException("User not found with CIN: " + cin);
        }
    }




    private static final String FONT_PATH = "src/main/resources/fonts/NotoNaskhArabic-Regular.ttf";
    private static final String LOGO = "src/main/resources/static/logo.png";
    String LOGO2 = "src/main/resources/static/logo2.png";
    private static final float MARGIN = 50f;
    private static final String COMPANY_ADDRESS = "Avenue de la Corniche, Monastir 5000 Tunisie";
    private static final String COMPANY_REGISTRATION = "9955112233";
    // Constantes pour les textes réutilisables
    private static final String CERTIFICATE_TITLE = "CERTIFICAT DE TRAVAIL";
    private static final String COMPANY_NAME = "ISIMM";
    private static final String SIGNATURE_TEXT = "Cachet et Signature";
    private static final String DATE_FORMAT = "dd/MM/yyyy";

    public byte[] generateCertificateOfWork(int cin) throws IOException, DocumentException {
        // Vérification de l'existence de l'utilisateur
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le CIN : " + cin));

        // Initialisation du document PDF
        Document document = new Document(PageSize.A4, MARGIN, MARGIN, MARGIN, MARGIN);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        // Configuration des polices
        BaseFont baseFont = BaseFont.createFont(FONT_PATH, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font titleFont = new Font(baseFont, 28, Font.BOLD);
        Font contentFont = new Font(baseFont, 12, Font.NORMAL);

        // Ajout du logo en haut
        addLogos(document);

        // Ajout du titre du certificat
        addCertificateTitle(document, titleFont,"Certificat de travail ");

        // Ajout du contenu principal et de la section de clôture en un seul paragraphe
        addCertificateContent(document, contentFont, user);

        // Ajout de la signature
        addSignatureSection(document, contentFont);

        document.close();
        return baos.toByteArray();
    }

    private void addLogos(Document document) throws DocumentException, IOException {
        float verticalOffset = 20; // Ajustement de la position verticale (en points)

        Image rightLogo = Image.getInstance(LOGO);
        rightLogo.scaleToFit(60, 60);
        rightLogo.setAbsolutePosition(
                document.getPageSize().getWidth() - MARGIN - 60,
                document.getPageSize().getHeight() - MARGIN - verticalOffset
        );
        document.add(rightLogo);

        Image leftLogo = Image.getInstance(LOGO2);
        leftLogo.scaleToFit(60, 60);
        leftLogo.setAbsolutePosition(
                MARGIN,
                document.getPageSize().getHeight() - MARGIN - verticalOffset
        );
        document.add(leftLogo);
    }

    // Méthode pour ajouter le titre du certificat
    private void addCertificateTitle(Document document, Font titleFont,String ch) throws DocumentException {
        PdfPTable titleTable = new PdfPTable(1);
        titleTable.setWidthPercentage(100);
        titleTable.setRunDirection(PdfWriter.RUN_DIRECTION_LTR);

        PdfPCell titleCell = new PdfPCell(new Phrase(ch, titleFont));
        titleCell.setBorder(Rectangle.NO_BORDER);
        titleCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        titleCell.setPaddingBottom(40f);
        titleTable.addCell(titleCell);
        document.add(titleTable);
    }

    public byte[] generateAttestationConge(int cin, Conge conge) throws IOException, DocumentException {
        // Vérification de l'existence de l'utilisateur
        User user = userRepository.findByCin(cin)
                .orElseThrow(() -> new RuntimeException("Utilisateur non trouvé avec le CIN : " + cin));

        // Initialisation du document PDF
        Document document = new Document(PageSize.A4, MARGIN, MARGIN, MARGIN, MARGIN);
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        PdfWriter writer = PdfWriter.getInstance(document, baos);
        document.open();

        // Configuration des polices
        BaseFont baseFont = BaseFont.createFont(FONT_PATH, BaseFont.IDENTITY_H, BaseFont.EMBEDDED);
        Font titleFont = new Font(baseFont, 28, Font.BOLD);
        Font contentFont = new Font(baseFont, 12, Font.NORMAL);

        // Ajout du logo en haut
        addLogos(document);

        addCertificateTitle(document, titleFont,"Attestation de congé ");

        // Ajout du titre du certificat
        addAttestationCongeContent(document, contentFont,user,conge);



        // Ajout de la signature
        addSignatureSection(document, contentFont);

        document.close();
        return baos.toByteArray();
    }
   private void addCertificateContent(Document document, Font contentFont, User user) throws DocumentException {
       PdfPTable contentTable = new PdfPTable(1);
       contentTable.setWidthPercentage(100);
       contentTable.setRunDirection(PdfWriter.RUN_DIRECTION_LTR);



       String content = String.format(
               "Je soussigné(e), Gazzoum, " +
                       "Directeur de  %s, " +
                       "Immatriculée sous le numéro\n\n%s, " +
                       "Dont le siège social est situé %s,\n\n\n" +
                       "CERTIFIE " +
                       "Que M./Mme %s %s " +
                       "Né(e) le %s " +
                       "Titulaire de la Carte Nationale\n\nd'Identité n° %s " +
                       "Domicilié(e) à : %s " +
                       "Est employé(e) au sein de notre\n\nentreprise en qualité de %s " +
                       "Depuis le %s .\n\n" +

                       "Le présent certificat est établi pour faire valoir ce que de droit.\n\n" +
                       "Fait à Monastir, le "+Date.valueOf(new java.util.Date().toString()),
               COMPANY_NAME,
               COMPANY_REGISTRATION,
               COMPANY_ADDRESS,
               user.getNom(),
               user.getPrenom(),
               formatDate(user.getDatenaissance()), // Ajout date de naissance
               user.getCin(),
               user.getAdresse(),
               user.getEmploi().getRole(),
               formatDate(user.getEmploi().getDateDebut()),
               user.getIdentifiant(),
               formatDate(Date.valueOf(new java.util.Date().toString()))
       );

       PdfPCell contentCell = new PdfPCell(new Phrase(content, contentFont));
       contentCell.setBorder(Rectangle.NO_BORDER);
       contentCell.setHorizontalAlignment(Element.ALIGN_JUSTIFIED);
       contentCell.setPaddingBottom(20f);
       contentTable.addCell(contentCell);
       document.add(contentTable);
   }

    private void addAttestationCongeContent(Document document , Font contentFont, User user, Conge conge) throws DocumentException {
        PdfPTable contentTable = new PdfPTable(1);
        contentTable.setWidthPercentage(100);
        contentTable.setRunDirection(PdfWriter.RUN_DIRECTION_LTR);



        String content = String.format(
                "Je soussigné(e), Gazzoum, " +
                        "Directeur de %s, " +
                        "Immatriculée sous le numéro %s, " +
                        "Dont le siège social est situé à %s,\n\n" +
                        "CERTIFIE " +
                        "Que M./Mme %s %s, " +
                        "Né(e) le %s, " +
                        "Titulaire de la Carte Nationale d'Identité n° %s, " +
                        "Domicilié(e) à : %s, " +
                        "Est en congé professionnel au sein de notre entreprise " +
                        "du %s au %s.\n\n" +

                        "Ce congé a été accordé pour la raison suivante : %s. " +
                        "Il s'inscrit dans le cadre de son évolution professionnelle, " +
                        "conformément aux dispositions légales et aux politiques internes de l'entreprise.\n\n" +

                        "Durant cette période, M./Mme %s " +
                        "sera exempté(e) de ses responsabilités habituelles, tout en restant " +
                        "disponible pour toute urgence nécessitant son intervention.\n\n" +

                        "Le présent certificat est délivré à l'intéressé(e) pour faire valoir ce que de droit, " +
                        "notamment auprès des institutions administratives et professionnelles.\n\n" +

                        "Fait à Monastir, le " + Date.valueOf(new java.util.Date().toString()),
                COMPANY_NAME,
                COMPANY_REGISTRATION,
                COMPANY_ADDRESS,
                user.getNom(),
                user.getPrenom(),
                formatDate(user.getDatenaissance()), // Date de naissance
                user.getCin(),
                user.getAdresse(),
                formatDate(conge.getDateDebut()), // Date de début du congé
                formatDate(conge.getDateFin()), // Date de fin du congé
                conge.getType(), // Cause du congé
                user.getNom() // Nom de l'employé
        );


        PdfPCell contentCell = new PdfPCell(new Phrase(content, contentFont));
        contentCell.setBorder(Rectangle.NO_BORDER);
        contentCell.setHorizontalAlignment(Element.ALIGN_JUSTIFIED);
        contentCell.setPaddingBottom(20f);
        contentTable.addCell(contentCell);
        document.add(contentTable);
    }
    // Méthode pour ajouter la signature
    private void addSignatureSection(Document document, Font contentFont) throws DocumentException {
        PdfPTable signatureTable = new PdfPTable(1);
        signatureTable.setWidthPercentage(30);
        signatureTable.setRunDirection(PdfWriter.RUN_DIRECTION_LTR);
        signatureTable.setHorizontalAlignment(Element.ALIGN_LEFT);
        signatureTable.setSpacingBefore(50f);

        PdfPCell signatureCell = new PdfPCell(new Phrase(SIGNATURE_TEXT, contentFont));
        signatureCell.setBorder(Rectangle.NO_BORDER);
        signatureCell.setHorizontalAlignment(Element.ALIGN_CENTER);
        signatureTable.addCell(signatureCell);
        document.add(signatureTable);
    }

    // Méthode pour formater la date
    private String formatDate(Date date) {
        if (date == null) {
            return "";
        }
        SimpleDateFormat formatter = new SimpleDateFormat(DATE_FORMAT);
        return formatter.format(date);
    }



    // Méthode utilitaire pour ajouter une ligne au tableau
    private void addRow(PdfPTable table, String header, String value, Font font) {
        PdfPCell cell;
        cell = new PdfPCell(new Phrase(header, font));
        cell.setPadding(5f);
        cell.setBackgroundColor(BaseColor.LIGHT_GRAY);
        table.addCell(cell);

        cell = new PdfPCell(new Phrase(value, font));
        cell.setPadding(5f);
        table.addCell(cell);
    }



    public List<PdfFileDTO> getPdfFilesByCin(int cin) {
        List<PdfFile> pdfFiles = pdfFileRepository.findByCin(cin); // Récupère les fichiers par CIN
        return pdfFiles.stream()
                .map(this::convertToDto) // Convertit chaque entité en DTO
                .collect(Collectors.toList());
    }

    private PdfFileDTO convertToDto(PdfFile pdfFile) {
        PdfFileDTO dto = new PdfFileDTO();
        dto.setId(pdfFile.getId());
        dto.setFileName(pdfFile.getFileName());
        dto.setFileType(pdfFile.getFileType());
        dto.setFileSize(pdfFile.getFileSize());
        dto.setCreatedAt(pdfFile.getCreatedAt());
        dto.setType(pdfFile.getType());
        dto.setPeriod(pdfFile.getPeriod());
        return dto;
    }

    public byte[] getPdfFileContent(Blob blob) {
        try (InputStream inputStream = blob.getBinaryStream();
             ByteArrayOutputStream outputStream = new ByteArrayOutputStream()) {
            byte[] buffer = new byte[4096];
            int bytesRead;
            while ((bytesRead = inputStream.read(buffer)) != -1) {
                outputStream.write(buffer, 0, bytesRead);
            }
            return outputStream.toByteArray();
        } catch (Exception e) {
            throw new RuntimeException("Failed to read PDF content from Blob", e);
        }
    }

    public String generate_certificat_travail(int cin) {
        try {

            byte[] pdfContent =generateCertificateOfWork(cin);

            PdfFile pdfFile = new PdfFile();
            pdfFile.setCin(cin);
            pdfFile.setFileName(" certificat_travail" + cin + ".pdf");
            pdfFile.setFileType("application/pdf");
            pdfFile.setFileSize((long) pdfContent.length);
            pdfFile.setContenu(new SerialBlob(pdfContent));
            pdfFile.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            pdfFile.setType("Certificat Travail");
            pdfFile.setPeriod("yearly");

            pdfFileRepository.save(pdfFile);

            return "PDF generated and stored successfully.";
        } catch (Exception e) {
            return "Error generating PDF: " + e.getMessage();
        }
    }
    public String generate_attestation_conge(int cin,Conge conge) {
        try {

            byte[] pdfContent =generateAttestationConge(cin,conge);

            PdfFile pdfFile = new PdfFile();
            pdfFile.setCin(cin);
            pdfFile.setFileName(" Attestation_Conge.pdf");
            pdfFile.setFileType("application/pdf");
            pdfFile.setFileSize((long) pdfContent.length);
            pdfFile.setContenu(new SerialBlob(pdfContent));
            pdfFile.setCreatedAt(Date.valueOf(new java.util.Date().toString()));
            pdfFile.setType("Attestation Conge");
            pdfFile.setPeriod(formatDate(conge.getDateDebut()) + " - " + formatDate(conge.getDateFin()));

            pdfFileRepository.save(pdfFile);

            return "PDF generated and stored successfully.";
        } catch (Exception e) {
            return "Error generating PDF: " + e.getMessage();
        }
    }
}