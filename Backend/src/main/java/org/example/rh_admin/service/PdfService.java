package org.example.rh_admin.service;


import com.itextpdf.io.font.constants.StandardFonts;
import com.itextpdf.io.image.ImageData;
import com.itextpdf.io.image.ImageDataFactory;
import com.itextpdf.kernel.colors.Color;
import com.itextpdf.kernel.colors.ColorConstants;
import com.itextpdf.kernel.colors.DeviceRgb;
import com.itextpdf.kernel.font.PdfFont;
import com.itextpdf.kernel.font.PdfFontFactory;
import com.itextpdf.kernel.geom.PageSize;
import com.itextpdf.kernel.pdf.PdfDocument;
import com.itextpdf.kernel.pdf.PdfPage;
import com.itextpdf.kernel.pdf.PdfWriter;
import com.itextpdf.kernel.pdf.action.PdfAction;
import com.itextpdf.kernel.pdf.canvas.PdfCanvas;
import com.itextpdf.layout.Document;
import com.itextpdf.layout.element.*;
import com.itextpdf.layout.element.Image;
import com.itextpdf.layout.properties.TextAlignment;
import com.itextpdf.layout.properties.UnitValue;
import org.example.rh_admin.entity.Emploi;
import org.example.rh_admin.entity.PdfFile;
import org.example.rh_admin.entity.User;
import org.example.rh_admin.repository.PdfFileRepository;
import org.example.rh_admin.repository.UserRepository;
import org.jfree.chart.ChartFactory;
import org.jfree.chart.ChartUtils;
import org.jfree.chart.JFreeChart;
import org.jfree.chart.plot.PlotOrientation;
import org.jfree.chart.renderer.category.BarRenderer;
import org.jfree.data.statistics.HistogramDataset;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.*;
import java.lang.reflect.Array;
import java.net.HttpURLConnection;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.sql.Date;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.net.URL;



@Service
public class PdfService {
    private static final String LOGO="src/main/resources/isimm_logo.png";
    @Autowired
    private EmploiService emploiService;
    @Autowired
    private AbsenceService absenceService;
    @Autowired
    private  UserRepository userRepository;
    @Autowired
    private TacheService tacheService;
    @Autowired
    private CongeService congeService;
    @Autowired
    private PdfFileRepository pdfFileRepository;


    public byte[] getRecherchePDF(List<User>users) throws FileNotFoundException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            Image image = new Image(ImageDataFactory.create(LOGO));
            image.setFixedPosition(1, 480, 760);
            image.scaleToFit(100, 100);
            document.add(image);

            Paragraph sousTitre = new Paragraph("Université de Monastir\n" +
                    "Institut Sup. d’Informatique et de \n Mathématiques")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(12);
            document.add(sousTitre.setFixedPosition(0, 770, 200));

            Paragraph titre = new Paragraph("Resultat De Recherche")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold();
            document.add(titre.setFixedPosition(185, 750, 250));

            Table table = new Table(5);
            String[] headers = {
                    "N° Carte ID", "Identifiant", "Nom", "Prenom", ""
            };

            for (String header : headers) {
                table.addHeaderCell(createCell(header, true));
            }


            int i=1;
            List<Table> tables = new ArrayList<Table>();
            for (User user : users) {
                Table table1 = new Table(2);
                table1.setMarginBottom(50.0F);
                table1.setWidth(UnitValue.createPercentValue(100));

                table1.addCell(createCell("N° Carte ID",true));
                table1.addCell(createCell(String.valueOf(user.getCin())));

                table1.addCell(createCell("Identifiant",true));
                table1.addCell(createCell(user.getIdentifiant()));

                table1.addCell(createCell("Nom",true));
                table1.addCell(createCell(user.getNom()));

                table1.addCell(createCell("Prenom",true));
                table1.addCell(createCell(user.getPrenom()));

                table1.addCell(createCell("Adresse",true));
                table1.addCell(createCell(user.getAdresse()));

                table1.addCell(createCell("Telephone",true));
                table1.addCell(createCell(String.valueOf(user.getTelephone())));

                table1.addCell(createCell("Situation",true));
                table1.addCell(createCell(user.getSituation()));

                table1.addCell(createCell("Sexe",true));
                table1.addCell(createCell(user.getSexe()));

                table1.addCell(createCell("Date Naissance",true));
                table1.addCell(createCell(user.getDatenaissance().toString()));

                table1.addCell(createCell("Handicape",true));
                table1.addCell(createCell(user.getHandicape()));


                table1.addCell(createCell("Email",true));
                table1.addCell(createCell(user.getEmail()));

                Emploi emploi = user.getEmploi();

                table1.addCell(createCell("Role",true));
                table1.addCell(createCell(emploi.getRole()));

                table1.addCell(createCell("Grade",true));
                table1.addCell(createCell(emploi.getGrade()));

                table1.addCell(createCell("Ancienneté",true));
                table1.addCell(createCell(String.valueOf(emploi.getAnciennete())));

                table1.addCell(createCell("Poste",true));
                table1.addCell(createCell(emploi.getPoste()));

                table1.addCell(createCell("Departement",true));
                table1.addCell(createCell(emploi.getDepartement()));

                table1.addCell(createCell("Specialite",true));
                table1.addCell(createCell(emploi.getSpecialite()));

                table1.addCell(createCell("Date Debut ",true));
                table1.addCell(createCell(String.valueOf(emploi.getDateDebut())));

                table1.addCell(createCell("Solde Congé",true));
                table1.addCell(createCell(String.valueOf(emploi.getSoldeConge())));

                table1.addCell(createCell("Heure Supplementaire",true));
                table1.addCell(createCell(String.valueOf(emploi.getHeuresSuppl())));

                table1.addCell(createCell("Quota",true));
                table1.addCell(createCell(String.valueOf(emploi.getQuota().getQuota())));








                table1.setKeepTogether(true);
                table1.setDestination("table"+i);
                tables.add(table1);






                table.addCell(createCell(String.valueOf(user.getCin())));
                table.addCell(createCell(user.getIdentifiant()));
                table.addCell(createCell(user.getNom()));
                table.addCell(createCell(user.getPrenom()));
                table.addCell(new Cell().add(new Paragraph().add(new Link("Detail",PdfAction.createGoTo("table"+i)).setUnderline().setFontColor(ColorConstants.BLUE))));


                i++;
            }
            table.setWidth(UnitValue.createPercentValue(100));
            table.setMarginTop(100.0F);
            table.setMarginBottom(50.0F);



            document.add(table);

            for(Table table1 : tables) {
                document.add(table1);
            }

            document.close();


            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    private Cell createCell(String content) {
        return createCell(content, false);
    }

    private Cell createCell(String content, boolean isHeader) {
        Cell cell = new Cell();
        cell.add(new Paragraph(content));
        cell.setTextAlignment(TextAlignment.LEFT);
        cell.setFontSize(10);
        return cell;
    }

    public byte[] getStat(Date debutDate, Date finDate) throws FileNotFoundException {
        try (ByteArrayOutputStream baos = new ByteArrayOutputStream()) {

            PdfWriter writer = new PdfWriter(baos);
            PdfDocument pdf = new PdfDocument(writer);
            Document document = new Document(pdf);

            Image image = new Image(ImageDataFactory.create(LOGO));
            image.setFixedPosition(1, 480, 760);
            image.scaleToFit(100, 100);
            document.add(image);

            Paragraph sousTitre = new Paragraph("Université de Monastir\n" +
                    "Institut Sup. d’Informatique et de \n Mathématiques")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(12);
            document.add(sousTitre.setFixedPosition(0, 770, 200));

            Paragraph titre = new Paragraph("Rapport")
                    .setTextAlignment(TextAlignment.CENTER)
                    .setFontSize(20)
                    .setBold();
            document.add(titre.setFixedPosition(185, 750, 250));

//********************************************************************************************************************

            Map<String,Object> emplois = emploiService.getStatistique();
            System.out.println(emplois);

            Table table = new Table(3);
            table.addCell(createCell("Nombre Total D'utlisateur",true));
            table.addCell(createCell("Moyen De Jours De Congé",true));
            table.addCell(createCell("Somme D\'heure Supplementaire" ,true));
            table.addCell(createCell(emplois.get("nbTotal").toString(),false));
            table.addCell(createCell(emplois.get("congeMoyen").toString(),false));
            table.addCell(createCell(emplois.get("sommeHeureSupp").toString() ,false));


            table.setWidth(UnitValue.createPercentValue(100));
            table.setMarginTop(100.0F);

            document.add(table);


            List<Map<String,Object>> departments = (List<Map<String,Object>>) emplois.get("departements");
            List<Map<String,Object>> grades = (List<Map<String,Object>>) emplois.get("grades");
            List<Map<String,Object>> poste = (List<Map<String,Object>>) emplois.get("postes");
            List<Map<String,Object>> anciennetes = (List<Map<String,Object>>) emplois.get("anciennetes");


            if(!departments.isEmpty())
                document.add(getImage("'Nombre Des Enseignants Par Departement' },","departement","nb",departments));

            if(!grades.isEmpty())
                document.add(getImage("'Nombre Des Enseignants Par Grade' },","grade","nb",grades));

            if(!poste.isEmpty())
                document.add(getImage("'Nombre Des Enseignants Par Poste' },","poste","nb",poste));

            if(!anciennetes.isEmpty())
                document.add(getImage("'Nombre Des Enseignants Par Anciennete' },","anciennete","nb",anciennetes));

//*********************************************************************************************************

            Map<String,Object> absences = absenceService.getStatistique(debutDate, finDate);

            Table table1 = new Table(2);
            table1.addCell(createCell("Nombre Total D'absence",true));
            table1.addCell(createCell(absences.get("nbTotal").toString() ,false));
            table1.setWidth(UnitValue.createPercentValue(100));
            table1.setMarginTop(100.0F);

            document.add(table1);


            List<Map<String,Object>> dates = (List<Map<String,Object>>) absences.get("AbsenceByDate");
            List<Map<String,Object>> cins = (List<Map<String,Object>>) absences.get("AbsenceByCin");
            Table table2 = new Table(4);
            table2.addCell(createCell("Carte Cin",true));
            table2.addCell(createCell("Nom",true));
            table2.addCell(createCell("Prenom",true));
            table2.addCell(createCell("Total D'absence",true));

            for(Map<String,Object> map : cins) {
                int cin = Integer.parseInt(String.valueOf(map.get("cin")));
                User user = userRepository.findById(cin).get();
                table2.addCell(createCell(String.valueOf(cin),false));
                table2.addCell(createCell(user.getNom() ,false));
                table2.addCell(createCell(user.getPrenom() ,false));
                table2.addCell(createCell(map.get("nb").toString() ,false));

            }

            table2.setWidth(UnitValue.createPercentValue(100));
            table2.setKeepTogether(true);
            table2.setMarginTop(10.0F);
            document.add(table2);



            if(!dates.isEmpty())
                document.add(getImage("'Nombre Des absences Par Date'","date","nb",dates));

//*******************************************************************************************************************


            Map<String,Object> taches = tacheService.getStatistique(debutDate, finDate);

            Table table3 = new Table(2);
            table3.addCell(createCell("Nombre Total De Tache",true));
            table3.addCell(createCell(taches.get("nbTotal").toString() ,false));
            table3.addCell(createCell("Moyen De Nombre De Tache Par Utilisateur",true));
            table3.addCell(createCell(taches.get("tacheParEns").toString() ,false));

            table3.setWidth(UnitValue.createPercentValue(100));
            table3.setMarginTop(10.0F);
            document.add(table3);


            List<Map<String,Object>> tachesUser = (List<Map<String,Object>>) taches.get("etats");

            if(!tachesUser.isEmpty())
                document.add(getImage("'Nombre Des Taches Par Etat' },","etat","nb",tachesUser));



//*******************************************************************************************************************

            Map<String,Object> conges = congeService.getStatistique(debutDate, finDate);

            Table table4 = new Table(2);
            table4.addCell(createCell("Nombre Total De Congé",true));
            table4.addCell(createCell(conges.get("nbTotal").toString() ,false));
            table4.addCell(createCell("Moyen De Jours De Congé Demandé",true));
            table4.addCell(createCell(conges.get("Moyen").toString() ,false));


            table4.setWidth(UnitValue.createPercentValue(100));
            table4.setMarginTop(10.0F);
            document.add(table4);

            List<Map<String,Object>> congesEtat = (List<Map<String,Object>>) conges.get("types");


            if(!congesEtat.isEmpty())
                document.add(getImage("'Nombre Des Congés Par Types' },","type","nb",congesEtat));

            document.add(getImage3("'Taux De Validation De Congé' },", (Integer) conges.get("taux")));






            document.close();
            return baos.toByteArray();

        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }

    public Image getImage(String titre , String key1 , String key2,List<Map<String,Object>> data){
        String key1String = "[";
        String key2String = "[";
        for(Map<String,Object> map : data){
            key1String+="\""+map.get(key1)+"\",";
            key2String+=map.get(key2)+",";
        }

        key1String=key1String.substring(0,key1String.length()-1)+"],";
        key2String=key2String.substring(0,key2String.length()-1)+"],";


        String chartUrl;
        if(titre.equals("'Nombre Des absences Par Date'"))
            chartUrl = getChartUrl2(key1String,key2String,titre);
        else
            chartUrl = getChartUrl(key1String,key2String,titre);
        byte[] imageBytes = downloadImage(chartUrl);
        ImageData imageData = ImageDataFactory.create(imageBytes);
        Image chartImage = new Image(imageData);
        chartImage.setMarginTop(50);
        chartImage.setAutoScaleHeight(true);
        return chartImage;
    }
    public Image getImage3(String titre ,int data){

        String chartUrl = getChartUrl3(String.valueOf(data),titre);
        byte[] imageBytes = downloadImage(chartUrl);
        ImageData imageData = ImageDataFactory.create(imageBytes);
        Image chartImage = new Image(imageData);
        chartImage.setMarginTop(50);
        chartImage.setAutoScaleHeight(true);
        return chartImage;
    }



    public static String getChartUrl(String label , String data, String titre ) {
        String chartConfig = """
        {
          "type": "bar",
          "data": {
            "labels": """+label+"""
            "datasets": [{
              "data":"""+data+"""
              "backgroundColor": "blue"
            }]
          },
          "options": {
            legend: { display: false },
            title: { display: true, text: """+titre+"""
          }
        }
        """;

        return "https://quickchart.io/chart?c=" + URLEncoder.encode(chartConfig, StandardCharsets.UTF_8);
    }
    public static String getChartUrl2(String label , String data, String titre ) {
        String chartConfig = """
        {
          "type": "line",
          data: {
          "labels": """+label+"""
          "datasets": [{
              "data":"""+data+"""
              backgroundColor: 'blue',
              borderColor: 'blue',
              fill: false,
              label: """+titre+"""
           }],
          }
        }
        """;
       return "https://quickchart.io/chart?c=" + URLEncoder.encode(chartConfig, StandardCharsets.UTF_8);
    }
    public static String getChartUrl3( String data, String titre ) {
        String chartConfig = """
        {
                     type: 'radialGauge',
                     data: {
                       datasets: [{
                         data: ["""+data+"""
                         ],
                         backgroundColor: getGradientFillHelper('horizontal', ['red', 'blue']),
                       }]
                     },
                     options: {
                       domain: [0, 100],
                       trackColor: '#f0f8ff',
                       centerPercentage: 90,
                       centerArea: {
                         text: (val) => val + '%',
                       },
                       title: { display: true, text: """+titre+"""
                     }
        }
        """;
        return "https://quickchart.io/chart?c=" + URLEncoder.encode(chartConfig, StandardCharsets.UTF_8);
    }


    private static byte[] downloadImage(String imageUrl) {
        try {
            URL url = new URL(imageUrl);
            HttpURLConnection connection = null;

            connection = (HttpURLConnection) url.openConnection();

            connection.setRequestMethod("GET");

            try (InputStream inputStream = connection.getInputStream();
                 ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream()) {

                byte[] buffer = new byte[1024];
                int bytesRead;
                while ((bytesRead = inputStream.read(buffer)) != -1) {
                    byteArrayOutputStream.write(buffer, 0, bytesRead);
                }

                return byteArrayOutputStream.toByteArray();
            }
        }   catch (IOException e) {
            throw new RuntimeException(e);
        }
    }


    public List<PdfFile> getRapports() {
        return pdfFileRepository.getRapports();
    }
}
