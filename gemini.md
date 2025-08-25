# gemini.md
**Projekt:** [Projektname]  
**Autor:** [Dein Name/Team]  
**Version:** 1.0.0  
**Letzte Aktualisierung:** YYYY-MM-DD HH:MM

---

## 1. Dashboard (Context7)
* **1.1 Projekt-Zusammenfassung:** [Was ist der Kernzweck dieses Projekts?]
* **1.2 Aktuelles Hauptziel (Meilenstein):** [Welcher Meilenstein wird gerade angestrebt? → Siehe 4.2]
* **1.3 Letzte Commits/Änderungen:** `git log -3 --oneline`
* **1.4 Aktive Blocker/Issues:** [Gibt es Hindernisse? → Referenz auf #I-x aus 4.4]
* **1.5 Kritische Abhängigkeiten:** [Welche Systeme/Personen sind für den nächsten Schritt entscheidend?]
* **1.6 Nächste 3 Schritte (Plan):** [Konkrete, überschaubare nächste Aktionen]
* **1.7 Wichtige Entscheidungen/Kommunikation:** [Zuletzt getroffene Design-Entscheidungen oder wichtige Absprachen → Siehe 4.3]

---

## 2. Aktueller Arbeitsblock: [Name des Sprints/Features]
* Arbeite die Aufgaben strikt sequenziell ab. Erledigte Aufgaben werden mit `[x]` markiert und können archiviert werden.

### Aufgabe T-1: [Titel der ersten Aufgabe] (bezieht sich auf #I-x)
* **Status:** [ ] To-Do / [ ] In Bearbeitung / [ ] Erledigt / [ ] Blockiert
* **B (Background):** Warum ist diese Aufgabe notwendig? Welches Problem löst sie?
* **M (Method):** Welche Bibliotheken, Algorithmen oder Rezepte aus dem `universal.cookbook` werden verwendet? (z.B. Rezept `auth-001`)
* **A (Action):**
    * [ ] Schritt 1: ...
    * [ ] Schritt 2: ...
    * [ ] Schritt 3: ...
* **D (Documentation):** Fortschritt wird in `4.1` unter `T-1` protokolliert. Relevante Änderungen in `docs/` festhalten.

---

## 3. Definition of Done & Quality Gates
*Gilt für jede abgeschlossene Aufgabe (T-x).*

### 3.1 Korrektheit & Sicherheit
- [ ] Alle Unit- & Integration-Tests sind grün (`npm run test`).
- [ ] **Testabdeckung (Coverage)** liegt über dem Schwellenwert (z.B. > 80%).
- [ ] **Security-Audit** für Abhängigkeiten wurde durchgeführt und ist sauber (`npm audit --production`).
- [ ] Code wurde erfolgreich gebaut (`npm run build`).

### 3.2 Code-Qualität (Static Analysis)
- [ ] **Linting**-Regeln werden ohne Fehler erfüllt (`npm run lint`).
- [ ] **Formatierung** ist konsistent (`npm run format`).
- [ ] **Typensicherheit** ist gewährleistet (z.B. `tsc --noEmit` bei TypeScript).
- [ ] **Code-Komplexität** wurde geprüft und liegt im Rahmen.

### 3.3 Prozess
- [ ] Branch ist auf dem aktuellen Stand des Haupt-Branches (rebased).
- [ ] Pull/Merge-Request ist erstellt und verständlich beschrieben.
- [ ] Mindestens ein Code-Review (durch andere Person oder Self-Review) wurde durchgeführt.

### 3.4 E2E-Validierung (für Webprojekte mit Playwright)
- [ ] **Playwright E2E-Tests** für den kritischen User-Flow sind erfolgreich (`npm run test:e2e`).
- [ ] **Visuelle Regressionstests** zeigen keine unerwarteten Abweichungen (falls implementiert).
- [ ] Tests wurden erfolgreich in den Ziel-Browsern (z.B. Chromium, Firefox) ausgeführt.

---

## 4. Projekt-Logbuch

### 4.1 Fortschritte
| Datum      | Task | Was erledigt wurde                        | Commit-ID | Wer      |
|------------|------|-------------------------------------------|-----------|----------|
| YYYY-MM-DD | T-1  | "Login-Flow mit Altcha implementiert"     | `a1b2c3d` | DeinName |

### 4.2 Meilensteine
| Status    | Geplant bis | Abgeschlossen | Meilenstein                      |
|-----------|-------------|---------------|----------------------------------|
| [x]       | YYYY-MM-DD  | YYYY-MM-DD    | Auth-System mit Altcha           |
| [ ]       | YYYY-MM-DD  |               | UI-Integration in React          |

### 4.3 Wichtige Entscheidungen
| Datum      | Entscheidung                                     | Begründung                                     |
|------------|--------------------------------------------------|------------------------------------------------|
| YYYY-MM-DD | "Wir verwenden Altcha statt reCAPTCHA"           | "Besserer Datenschutz, kein Vendor-Lock-in"    |

### 4.4 Backlog & Issues
* `[Bug]` **#I-1:** Fehler bei ungültigem Altcha-Token (Status: Offen)
* `[Feature]` **#I-2:** Rate-Limiting für Login-Endpunkt (Status: To-Do)
* `[Chore]` **#I-3:** Dokumentation für Deployment fehlt (Status: To-Do)

---

## 5. Session-Protokoll
* **Session-ID:** YYYY-MM-DD_1
* **Start:** HH:MM
* **Ende:** HH:MM
* **Fokus:** Aufgabe T-1 abschließen.
* **Notizen/Erkenntnisse:** ...

---

## 6. Archiv
<details>
  <summary>Abgeschlossene Aufgaben & Sessions</summary>

  </details>

---

## 7. Werkzeuge & KI-Workflow

### 7.1 Temporäre Assets für die Analyse
- **Zweck:** Ablage von Artefakten (Screenshots, Traces, Logs), die zur Analyse oder zur Unterstützung durch eine Programmier-KI benötigt werden.
- **Speicherort:** Alle temporären Dateien werden im Ordner `/.temp/assets/` gespeichert.
- **Struktur:** Benennung nach Issue- oder Task-ID (z.B. `I-1-login-error.png`).
- **Wichtig:** Der `.temp` Ordner **muss** in der `.gitignore` eingetragen sein.

### 7.2 Playwright für die Entwicklung nutzen
- **Schnelle UI-Verifikation:** `npx playwright test --ui`
- **Screenshot-Erstellung für KI:** `npx playwright screenshot --selector="#id" --output=".temp/assets/T-x.png" https://localhost:3000`
- **Trace-Erstellung zum Debuggen:** `npx playwright test --trace on`

---

## 8. Anbindung an das Universal Cookbook 📚

### 8.1 Geltende Prinzipien
Dieses Projekt hält sich an die Grundprinzipien, die in der `README.md` des `universal.cookbook`-Repositorys definiert sind. Dies schließt insbesondere ein:
- **Prinzip #1:** Immer den offiziellen Client für BaaS-Dienste (Supabase, Firebase, etc.) verwenden.

### 8.2 Nutzung von Rezepten
Wiederverwendbare Logik, die im `universal.cookbook` existiert, **soll** genutzt werden, um Redundanz zu vermeiden und die Code-Qualität zu sichern. Die Nutzung wird im `Method`-Teil der jeweiligen Aufgabe vermerkt (z.B. "Verwende Rezept `database-002` für Supabase-Client").

## 9. Anleitung zur automatisierten Projekt- und Cookbook-Aktualisierung mit der Gemini API

Dieses Dokument dient als Leitfaden für die Nutzung und Aktualisierung von Projekten, die auf der Gemini API basieren. Das Gemini API Cookbook ist eine zentrale Ressource, die regelmäßig mit neuen Funktionen und Beispielen aktualisiert wird.  

### 9.1 Was ist neu? Aktuelle Updates im Gemini API Cookbook

Um stets auf dem neuesten Stand zu sein, findest du hier die jüngsten Ergänzungen und Aktualisierungen :  

  - **Gemini 1.5 Modelle:** Entdecke die Fähigkeiten der neuesten Modelle Gemini 1.5 Flash und Pro.
  - **Imagen und Veo:** Anleitungen für die Erstellung von Medien mit den neuen Modellen für Bild- (Imagen) und Videogenerierung (Veo).
  - **Lyria und TTS:** Erste Schritte zur Erstellung von Podcasts und Musik mit den Echtzeitmodellen für Text-to-Speech (TTS) und Lyria.
  - **LiveAPI:** Eine Einführung in die multimodale Live API, um neue interaktive Möglichkeiten mit Gemini zu erschließen.
  - **Grounding:** Lerne, wie du die Antworten von Gemini mithilfe verschiedener Tools wie Google Search, YouTube oder dem neuen URL-Kontext-Tool fundieren kannst.
  - **Batch-Modus:** Nutze den Batch-Modus, um eine große Anzahl nicht zeitkritischer Anfragen mit einem Rabatt von 50 % an das Modell zu senden.

### 9.2 Erste Schritte: Quick-Start-Anleitungen

Die Quick-Start-Anleitungen enthalten schrittweise Tutorials, um dich mit Gemini und seinen spezifischen Funktionen vertraut zu machen.

### Voraussetzungen :  
 - Ein Google-Konto.
 - Ein API-Schlüssel (diesen kannst du im Google AI Studio erstellen).

### Empfohlene Startpunkte :  
 - **Authentifizierung:** Richte deinen API-Schlüssel für den Zugriff ein.
 - **Erste Schritte mit Gemini:** Lerne die Grundlagen der Gemini-Modelle und der API kennen, einschließlich grundlegender Prompts und multimodaler Eingaben.
 - **Weitere Tutorials:** Vertiefe dein Wissen mit Anleitungen zu spezifischen Funktionen wie der Live API, Veo, Imagen, Grounding und Codeausführung.

### 9.3 Praktische Anwendungsfälle und Beispiele

Diese Beispiele zeigen, wie du mehrere Funktionen der Gemini API oder Tools von Drittanbietern kombinieren kannst, um komplexe Anwendungen zu erstellen :  

  - **Browser als Werkzeug:** Nutze einen Webbrowser für Live-Interaktionen im Internet und Intranet.
  - **Buchillustration:** Erstelle mit Gemini und Imagen Illustrationen für ein Open-Source-Buch.
  - **Generierung animierter Geschichten:** Kombiniere die Story-Generierung von Gemini mit Imagen und Audiosynthese, um animierte Videos zu erstellen.
  - **3D-Raumverständnis:** Nutze die räumlichen 3D-Fähigkeiten von Gemini, um 3D-Szenen zu verstehen.

### 9.4 Demos: End-to-End-Anwendungen

Diese voll funktionsfähigen End-to-End-Anwendungen demonstrieren die Leistungsfähigkeit von Gemini in realen Szenarien :  

  - **Gemini API Quickstart:** Eine Python-Flask-App, die die multimodalen Fähigkeiten der Gemini API demonstriert.
  - **Multimodal Live API Web Console:** Eine auf React basierende Starter-App zur Nutzung der Live API über einen Websocket.
  - **Google AI Studio Starter Applets:** Eine Sammlung kleiner Apps, die zeigen, wie Gemini zur Erstellung interaktiver Erlebnisse verwendet werden kann.

### 9.5 Offizielle SDKs

Die Gemini API ist eine REST-API. Du kannst sie direkt aufrufen oder eines der offiziellen SDKs verwenden, um die Integration zu vereinfachen :  

  - Python
  - Go
  - Node.js
  - Dart (Flutter)
  - Android
  - Swift