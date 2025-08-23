# Onboarding-Spezifikation: Analyse-Dashboard mit Lizenzmodell
## Vollständiger Plan für EU/DSGVO-konformes Onboarding

### Dokumentenstatus
- **Version**: 1.0
- **Datum**: 23.08.2025
- **Status**: Genehmigt für Implementierung
- **Zielgruppe**: EU/DSGVO-konform, B2B-first, Self-Serve + Sales-Assist (Enterprise)

---

## 🎯 Übersicht und Abstimmung mit aktuellem Codebase

### Aktueller Zustand (Stand 23.08.2025)
- **Authentication**: Basis-React-App mit Supabase-Authentifizierung (nur E-Mail/Passwort)
- **SignUp.tsx**: Einfache Registrierung ohne E-Mail-Verifizierung oder 2FA
- **AuthContext.tsx**: Standard-Supabase-Auth ohne erweiterte Features
- **Billing.tsx**: Platzhalter-Seite ("under construction")
- **Fehlende Features**: Onboarding-Flows, Plan-Management, Feature-Gating

### Plan-Ansatz
- Erweiterung der bestehenden Authentifizierung um E-Mail-Verifizierung, 2FA und SSO
- Implementierung eines mehrstufigen Onboarding-Wizards als neue Komponenten
- Integration EU-konformen Billing-Systems (Stripe mit VAT-Unterstützung)
- Feature-Gating basierend auf Plan-Levels mit dynamischer UI-Anpassung
- Telemetrie-System für PLG-Metriken
- DSGVO-konforme Datenverarbeitung und Einwilligungsmanagement

---

## 🔄 Vollständiger User-Flow mit Zustandsdiagramm

### Zustände und Übergangslogik
```
[Initial] → registered → email_verified → profile_complete → billing_complete → activated → onboarded
     ↓           ↓            ↓              ↓                ↓            ↓
  [error]    [unverified]  [incomplete]   [unpaid]       [inactive]   [active]
```

### 1. Konto erstellt
**Screens**: Willkommen, E-Mail-Verifizierung, Sicherheitssetup
**Aktionen**: Link erneut senden, 2FA optional (TOTP/Authenticator)
**Validierung**: E-Mail-Format, Passwort-Stärke (8+ Zeichen)
**Edge-Case**: Unbestätigte E-Mail blockiert sensible Features

**Akzeptanzkriterien:**
- Given: Nutzer registriert sich
- When: E-Mail nicht verifiziert
- Then: Sensible Features blockiert, Fortschritt 0/5 sichtbar

### 2. Persönliche Daten (Profil)
**Pflichtfelder**: Vorname, Nachname, Land, Zeitzone, Sprache, Rolle
**Optionale**: Telefonnummer, Avatar/Logo
**Rechtliche**: AGB/Datenschutz-Checkbox, Marketing-Einwilligung
**Validierung**: Inline-Feedback, Datensparsamkeit

**Akzeptanzkriterien:**
- Given: Profil-Formular angezeigt
- When: Pflichtfelder unvollständig
- Then: Fortfahren blockiert, klare Fehlermeldungen

### 3. Unternehmens-/Rechnungsdaten
**Felder**: Firmenname, Rechtsform, Anschrift, USt-ID/VAT, Kostenstelle/PO, Rechnungs-E-Mail
**Validierung**: USt-ID-Format pro Land (VIES-API), Adress-Validierung
**Use-Case**: Teamgröße, Nutzeranzahl für Plan-Empfehlung

**Akzeptanzkriterien:**
- Given: EU-Land ausgewählt
- When: USt-ID eingegeben
- Then: Automatische Validierung via VIES-API

### 4. Lizenz-Auswahl
**Pläne**: Starter (1-2 Nutzer), Pro (5-10), Business (25+), Enterprise (vertraglich)
**Vergleich**: Nutzer, Datenquellen, API-Limits, Speicher, Historie, Features
**Enterprise**: "Kontakt anfordern" → Formular → Terminbuchung

**Akzeptanzkriterien:**
- Given: Teamgröße 8 angegeben
- When: Pläne angezeigt
- Then: Pro-Plan als Empfehlung markiert

### 5. Zahlung & Vertrag
**Zahlungsarten**: Kreditkarte, SEPA, Rechnung (ab Business)
**Steuern**: Automatische VAT-Berechnung basierend auf Land/USt-ID
**Vertrag**: AGB, DPA/AVV, SLA pro Plan (PDF-Download)
**Bestätigung**: E-Mail-Beleg mit allen Details

**Akzeptanzkriterien:**
- Given: Zahlung erfolgreich
- When: System verarbeitet
- Then: Rechnung per E-Mail generiert

### 6. Produktaktivierung (First Run)
**Quickstart**: 3-5 Schritte (Datenquelle verbinden, Template wählen, Team einladen)
**Templates**: Branchen-spezifisch mit KPI-Vorschau
**Datenquellen**: OAuth/API-Keys für GA4, Shopify, HubSpot, Snowflake

**Akzeptanzkriterien:**
- Given: Nutzer aktiviert
- When: Erste Datenquelle verbunden
- Then: Dashboard funktional ohne weitere Konfiguration

### 7. In-Product Onboarding
**Guided Tours**: Dashboard, Explorer, Reports mit "Später"/"Nie wieder"
**Kontextsensitive Hilfe**: Tooltips, Kurzvideos, Suche
**Checkliste**: E-Mail bestätigt, Datenquelle aktiv, Dashboard live

**Akzeptanzkriterien:**
- Given: Tour abgeschlossen
- When: Checkliste persistiert
- Then: Synchron über Geräte hinweg

### 8. Kommunikation
**Transaktional**: Willkommen, Verifizierung, Zahlungsbestätigung, Rechnung
**Lifecycle**: Woche 1 Quick Wins, Woche 2-4 Advanced Features

### 9. Governance, Sicherheit, Compliance
**Datenschutz**: DPA/AVV, Datenminimierung, EU-Storage
**Sicherheit**: 2FA, SSO/SAML (ab Business), Audit Logs

### 10. Metriken (PLG)
**Aktivierung**: Zeit bis 1. Datenquelle, Zeit bis 1. Dashboard
**Konversion**: Trial → Paid, Self-Serve vs. Sales-Assist

### 11. Edge Cases & Wiederaufnahme
**Zahlungsabbruch**: Reminder + Deep-Link
**Unbestätigte E-Mail**: Eingeschränkter Zugriff bis Verifizierung

---

## 🏗️ Technische Architektur und High-Level Vorgaben

### Zustände
- `registered` → `email_verified` → `profile_complete` → `billing_complete` → `activated`

### Gates
- `plan_level`: starter, pro, business, enterprise
- `seat_limit`: Max. Nutzer pro Plan
- `usage_quota`: API-Calls, Speicher, Datenquellen
- `sso_enabled`: Ab Business/Enterprise

### Sicherheits-Integrationen
- **Altcha reCAPTCHA**: Bot-Schutz für Registrierung und Login (bietet bereits 2FA-ähnliche Sicherheit)
- **API-Endpoint**: `/api/verify-altcha` für serverseitige Validierung
- **Client-Widget**: `AltchaWidget.tsx` Komponente für alle Auth-Formulare
- **Fallback**: Automatische Aktivierung bei verdächtigen Mustern
- **Zusätzliche 2FA**: Optionale TOTP/Authenticator-Setup für Enterprise-Nutzer

### Abrechnung
- Stripe-Integration mit EU-VAT, Proration, Webhooks
- Plan-Wechsel mit sofortiger Aktivierung

### Feature-Flags
- Plan-basierte UI-Komponenten (Conditional Rendering)
- API-Limits und Quota-Checks

### Telemetrie
- Event-Tracking mit Segment/Mixpanel für PLG-Metriken
- A/B-Test-Hooks für Touren/Checklisten

---

## 🎨 UI/UX-Spezifikationen und Wireframes

### Allgemeine Prinzipien
- Progressiver, unterbrechungsfester Flow mit Auto-Save
- Mobile-responsive Design
- Barrierefreiheit (WCAG 2.1)

### Screen-Layouts (Beispiele)

#### Onboarding-Wizard
```
┌─────────────────────────────────────────────────────────┐
│ Progress Bar: [●○○○○] Schritt 1/5                      │
├─────────────────────────────────────────────────────────┤
│ Willkommen!                                             │
│ Verifizieren Sie Ihre E-Mail-Adresse.                   │
│                                                         │
│ [ ] Ich habe den Bestätigungslink erhalten             │
│ [Link erneut senden]                                    │
│                                                         │
│ Primär-CTA: [Weiter]    Sekundär-CTA: [Überspringen]    │
└─────────────────────────────────────────────────────────┘
```

#### Lizenz-Auswahl
```
┌─────────────────────────────────────────────────────────┐
│ Progress Bar: [●●●○○] Schritt 4/5                      │
├─────────────────────────────────────────────────────────┤
│ Wählen Sie Ihren Plan                                   │
│                                                         │
│ ┌─────────┬─────────┬─────────┬─────────┐            │
│ │ Starter │   Pro   │Business │Enterprise│            │
│ │ €29/M   │ €99/M   │ €299/M  │Kontakt   │            │
│ │ 1-2     │ 5-10    │ 25+     │          │            │
│ │ Nutzer  │ Nutzer  │ Nutzer  │          │            │
│ └─────────┴─────────┴─────────┴─────────┘            │
│                                                         │
│ Empfohlen: Pro (basierend auf Teamgröße 8)             │
│                                                         │
│ Primär-CTA: [Plan auswählen]                            │
└─────────────────────────────────────────────────────────┘
```

### Feldlisten mit Validierung

| Screen | Feld | Typ | Pflicht | Validierung | Fehlermeldung |
|--------|------|-----|---------|-------------|---------------|
| Profil | Vorname | Text | Ja | 2-50 Zeichen | "Vorname ist erforderlich" |
| Profil | E-Mail | Email | Ja | Format + Unique | "Bitte gültige E-Mail eingeben" |
| Unternehmen | USt-ID | Text | Ja (EU) | Länder-spezifisch | "Ungültige USt-ID-Nummer" |
| Unternehmen | Teamgröße | Number | Ja | 1-1000 | "Bitte gültige Teamgröße eingeben" |

---

## 💳 Abrechnung, Steuer und Vertrag

### Integration
- Stripe Checkout für sichere Zahlungsabwicklung
- VAT-Berechnung über Stripe Tax oder eigenes System
- Automatische Rechnungsgenerierung (PDF)

### E-Mail-Templates (Beispiele)

#### Zahlungsbestätigung
**Betreff:** Ihre Zahlungsbestätigung - NAVA Analytics
**Kernbausteine:**
- Rechnungsnr., Betrag, Laufzeit
- Download-Links für Rechnung und Vertrag
- Support-Kontakt bei Fragen

#### Fehlerszenarien
- Ungültige Zahlungsdaten → Retry mit verbesserter UX
- VAT-Fehler → Manuelle Korrektur durch Support

---

## 🚪 Feature-Gates je Plan

| Feature | Starter | Pro | Business | Enterprise |
|---------|---------|-----|----------|------------|
| Nutzer | 1-2 | 5-10 | 25+ | Unbegrenzt |
| Datenquellen | 2 | 10 | 50 | Unbegrenzt |
| API-Limits | 1k/Monat | 100k/Monat | 1M/Monat | Unbegrenzt |
| Custom Dashboards | Nein | Ja | Ja | Ja |
| SSO/SAML | Nein | Nein | Ja | Ja |
| Support | E-Mail | Chat | Priorität | Dedicated CSM |

---

## 📊 Telemetrie-Ereigniskatalog

| Event-Name | Trigger | Properties | Beispiel-Payload |
|------------|---------|------------|------------------|
| `onboarding_step_completed` | Schritt abgeschlossen | step_id, time_spent | `{step: "profile_complete", duration: 120}` |
| `plan_selected` | Plan gewählt | plan_type, source | `{plan: "pro", source: "recommendation"}` |
| `activation_completed` | Erste Datenquelle | data_source_type | `{source: "google_analytics"}` |
| `payment_completed` | Zahlung erfolgreich | amount, currency, plan | `{amount: 99, currency: "EUR", plan: "pro"}` |
| `altcha_validated` | Bot-Schutz bestanden | form_type, validation_time | `{form: "signup", duration: 2.5}` |
| `bot_detected` | Bot-Aktivität erkannt | form_type, block_reason | `{form: "login", reason: "suspicious_pattern"}` |

---

## ⚠️ Edge-Case-Katalog

| Szenario | Systemverhalten | Nutzerfeedback |
|----------|-----------------|----------------|
| Zahlungsabbruch | Reminder-E-Mail nach 24h, Deep-Link | "Zahlung fortsetzen" Banner |
| Downgrade | Feature-Verlust-Warnung, 30-Tage-Grace | Checkliste verlorener Features |
| Unbestätigte E-Mail | Blockierte Features, täglicher Reminder | "E-Mail bestätigen" Modal |
| Enterprise in Verhandlung | Temporäre Pro-Freischaltung | "Upgrade in Bearbeitung" Status |

---

## ✅ Implementierungsphasen (ToDos)

### Phase 1: Erweiterte Authentifizierung
- [ ] E-Mail-Verifizierung implementieren
- [ ] 2FA (TOTP) hinzufügen
- [ ] Altcha reCAPTCHA in alle Auth-Formulare integrieren
- [ ] AuthContext erweitern um neue Zustände

### Phase 2: Onboarding-Wizard Grundstruktur
- [ ] Wizard-Komponente erstellen
- [ ] Schritt-Navigation implementieren
- [ ] Auto-Save Funktionalität

### Phase 3: Billing-Integration und Plan-Management
- [ ] Stripe-Integration aufbauen
- [ ] VAT-Berechnung implementieren
- [ ] Plan-Models definieren

### Phase 4: Feature-Gating und UI-Anpassung
- [ ] Conditional Rendering basierend auf Plan
- [ ] Quota-System implementieren
- [ ] UI-Komponenten anpassen

### Phase 5: Telemetrie und Metriken
- [ ] Event-Tracking aufbauen
- [ ] Analytics-Dashboard integrieren
- [ ] A/B-Test-Framework

### Phase 6: Edge-Cases und Polishing
- [ ] Error-Handling verbessern
- [ ] Wiederaufnahme-Logik implementieren
- [ ] Mobile-Optimierung finalisieren

---

## 📋 Akzeptanzkriterien (Given-When-Then)

### Schritt 1: Konto erstellt
- Given: Nutzer registriert sich
- When: E-Mail nicht verifiziert
- Then: Sensible Features blockiert, Fortschritt 0/5 sichtbar
- And: 2FA-Setup optional verfügbar
- And: Altcha reCAPTCHA erfolgreich validiert (Bot-Schutz aktiv)

### Schritt 4: Lizenz-Auswahl
- Given: Teamgröße 8 angegeben
- When: Pläne angezeigt
- Then: Pro-Plan als Empfehlung markiert
- And: Plan-Wechsel zeigt Feature-Änderungen dynamisch

### Schritt 6: Produktaktivierung
- Given: Nutzer aktiviert
- When: Erste Datenquelle verbunden
- Then: Mindestens ein Dashboard funktional ohne weitere Konfiguration
- And: Erfolgsmetriken ausgelöst

---

## 🎯 Nächste Schritte für Implementierung

1. **Phase 1 beginnen**: Erweiterte Authentifizierung implementieren
2. **Testing**: Jede Phase mit Akzeptanzkriterien testen
3. **Feedback-Schleife**: Regelmäßige Reviews mit Stakeholdern
4. **Dokumentation**: Implementierungsfortschritte aktualisieren

**Status**: Bereit für Implementierung - Alle Spezifikationen definiert und genehmigt.
