# 📊 Application de Gestion RH et Documents Administratifs


## 🌟 Présentation

Application web complète de gestion des ressources humaines et des documents administratifs développée pour l'Institut Supérieur d'Informatique et de Mathématiques de Monastir. Cette solution moderne centralise la gestion du personnel administratif et enseignant, automatise la génération de documents, et offre des fonctionnalités avancées pour améliorer l'efficacité administrative.

## ✨ Fonctionnalités

### 👥 Gestion des Utilisateurs
- Authentification sécurisée avec JWT
- Gestion des rôles et permissions
- Journal des activités utilisateurs

### 👨‍💼 Gestion du Personnel
- Fiches complètes pour employés et enseignants
- Recherche multicritères avancée
- Historique des modifications

### 📅 Gestion des Congés et Absences
- Demandes et validation de congés
- Suivi des soldes en temps réel
- Conversion des heures supplémentaires

### 📄 Génération de Documents
- Création automatique de documents administratifs
- Personnalisation des modèles
- Export en format PDF

### 📊 Statistiques et Rapports
- Tableaux de bord interactifs
- Analyse de l'assiduité et des congés
- Exportation des données

## 🛠️ Technologies Utilisées

### Backend
- Spring Boot
- Spring Security avec JWT
- Spring Data JPA
- iTextPDF (génération de documents)
- MySQL

### Frontend
- Next.js
- Tailwind CSS
- Framer Motion
- React Hook Form

## 🏗️ Architecture

L'application est basée sur une architecture client-serveur avec API REST:

- **Frontend**: Interface utilisateur responsive développée avec Next.js
- **Backend**: APIs RESTful développées avec Spring Boot
- **Base de données**: MySQL pour le stockage persistant des données

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│             │     │             │     │             │
│  Frontend   │────▶│   Backend   │────▶│  Database   │
│  (Next.js)  │     │(Spring Boot)│     │   (MySQL)   │
│             │◀────│             │◀────│             │
└─────────────┘     └─────────────┘     └─────────────┘
```

## 📋 Structure du Projet

### Backend
```
src/
├── main/
│   ├── java/
│   │   └── com/isimm/
│   │       ├── config/
│   │       ├── controller/
│   │       ├── dto/
│   │       ├── entity/
│   │       ├── filter/
│   │       ├── repository/
│   │       ├── service/
│   │       └── util/
│   └── resources/
└── test/
```

### Frontend
```
src/
├── components/
├── contexts/
├── hooks/
├── pages/
├── public/
├── services/
├── styles/
└── utils/
```

## 🚀 Installation et Démarrage

### Prérequis
- Java 17+
- Node.js 16+
- MySQL 8+

### Backend
```bash
# Cloner le repository
git clone https://github.com/kassemabbassi/RH_Med_Kassem_Abbassi_Achraf_Lamari.git

# Se déplacer dans le dossier backend
cd RH_Med_Kassem_Abbassi_Achraf_Lamari/Backend

# Installer les dépendances
./mvnw install

# Démarrer l'application
./mvnw spring-boot:run
```

### Frontend
```bash
# Se déplacer dans le dossier frontend
cd RH_Med_Kassem_Abbassi_Achraf_Lamari/Frontend

# Installer les dépendances
npm install

# Démarrer l'application en mode développement
npm run dev

```

## 🔒 Sécurité

- Authentification avec tokens JWT stockés dans des cookies HTTP-only
- Protection CSRF
- Validation des entrées côté client et serveur
- Chiffrement des mots de passe avec BCrypt
- Support HTTPS



## 👨‍💻 Auteurs

- Mohamed Kassem Abbassi
- Achraf Lamari


