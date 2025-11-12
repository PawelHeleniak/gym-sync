# GymSync – Aplikacja do planowania i realizacji treningów siłowych

Projekt rozpoczęty jako prywatna aplikacja do treningów w domu, a następnie rozwijana jako praca inżynierska:
**„Projektowanie i implementacja aplikacji webowej do planowania i realizacji treningów siłowych”**

---

## Opis projektu

GymSync pozwala na:

- Tworzenie i zarządzanie planami treningowymi
- Rejestrowanie sesji treningowych
- Generowanie raportów treningowych (Do zrobienia)

Frontend napisany w **Angular 20**, backend w **Express.js** z bazą danych **MongoDB**.

W przyszłości planowane są funkcje:

- Tworzenie użytkowników, logowanie i rejestracja
- Autoryzacja i role użytkowników

---

## Struktura projektu

### Frontend (`gym-sync-frontend`)

- **features/** – moduły funkcjonalne:
  - `training-session` – realizacja treningu
  - `training-plan-builder` – tworzenie planów treningowych
  - `training-report` – raporty i historia treningów
- **shared/** – komponenty, serwisy i modele wykorzystywane w wielu miejscach
- **layout/** – główne layouty aplikacji (UserLayout, Navbar itp.)

### Backend (`gym-sync-backend`)

- **Express.js** jako serwer API
- **MongoDB** jako baza danych

---

## Instalacja i uruchomienie

1. Zainstaluj zależności frontendu:

```bash
cd gym-sync-frontend
npm install
```

2. Uruchom frontend:

```bash
npm start
```

3. Zainstaluj zależności backendu i uruchom serwer:

```bash
cd gym-sync-backend
npm install
npm run dev
```

> Backend domyślnie nasłuchuje na porcie ustawionym w `.env`.

---

## Technologie

- Angular 20
- Angular Material (Do zrobienia)
- Express.js
- MongoDB

---

## Plany rozwoju

- Dodanie rejestracji i logowania użytkowników
- Autoryzacja i role
- Eksport/import planów treningowych
- Możliwość dzielenia planów między użytkownikami
