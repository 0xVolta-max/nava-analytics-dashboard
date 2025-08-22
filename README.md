# NAVA Analytics Dashboard

Willkommen zu Ihrem NAVA Analytics Dashboard, einer leistungsstarken und visuell ansprechenden Oberfläche zur Verfolgung wichtiger Metriken im Zusammenhang mit der Inhaltserstellung. Dieses Dashboard wurde mit React, TypeScript und Tailwind CSS erstellt und bietet interaktive Diagramme und ein responsives Design.

## Meilensteine & Todos

### Milestone 1: Initial UI & Responsiveness (Complete)
- [x] Set up the basic dashboard layout.
- [x] Created metric cards, charts, and activity heatmap using mock data.
- [x] Implemented a responsive header that adapts to different screen sizes.
- [x] Ensured a consistent and modern "glassmorphism" UI style, including refined transparency for overlays and drawers.
- [x] Adjusted component heights and spacing for a more polished and unified look.
- [x] Added custom branding with a new logo and favicon.
- [x] Integrated a togglable widget for Social Pulse and Generation Activity, allowing users to switch between views.
- [x] Developed the Social Pulse (SocialWeather) widget to display real-time social media insights, with initial Supabase integration and mock data fallback.
- [x] Fine-tuned widget layouts and component positioning for improved visual consistency.
- [x] Implemented user authentication (Login, Sign Up, Forgot/Reset Password) with Supabase.
- [x] Set up protected and public routes using React Router.
- [x] **Integrated Cloudflare Turnstile for enhanced security on Login/Signup.**
- [x] **Replaced Cloudflare Turnstile with Altcha for enhanced security on Login/Signup.**

### Next Steps (Todos)
- [ ] **Backend & Data Integration (High Priority)**:
    - [ ] **Supabase Configuration**: Ensure the `SITE_URL` in your Supabase `.env` is correctly set to your Vercel app's URL for proper authentication redirects (e.g., after email confirmation).
    - [x] **Vercel Environment Variables**: Add `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to your Vercel project's environment variables (Project Settings > Environment Variables). These are crucial for the app to connect to Supabase on Vercel.
    - [ ] Replace `mockData.ts` with live API calls for dashboard metrics.
    - [ ] Connect real user data to the `UserNav` component.
- [ ] **Implement Data Filtering**:
    - [ ] Connect the "Filter data" dropdown and the date picker to the data-fetching logic.
    - [ ] Ensure all charts and metric cards update dynamically based on the selected filters.
- [ ] **Build Out Core Pages**:
    - [ ] Implement full functionality for "Profile", "Billing", and "Settings" pages.
    - [ ] Design a consistent and reusable layout for these secondary pages.
- [ ] **Refine State Management & Error Handling**:
    - [ ] Evaluate and potentially implement a global state manager (e.g., Zustand) for shared state like filters and user info.
    - [ ] Add robust loading states and user-friendly error messages for all asynchronous operations.
- [ ] **Testing**:
    - [ ] Write unit and integration tests for critical components (e.g., charts, data fetching hooks).
    - [ ] Ensure the application is reliable and maintainable.

## Deployment

This project is configured for easy deployment on [Vercel](https://vercel.com/). The `vercel.json` file ensures that all routes are correctly handled.

To deploy, connect your Git repository to a Vercel project. Every push to the main branch will automatically trigger a new deployment.

**Wichtige Hinweise zur Altcha-Integration:**

*   **Umgebungsvariablen:** Für die Altcha-Integration musst du die folgenden Umgebungsvariablen in deinem Vercel-Projekt (Project Settings > Environment Variables) setzen:
    *   `VITE_ALTCHA_CHALLENGE_API_URL`: Setze diesen auf `/api/altcha-challenge`.
    *   `VITE_ALTCHA_VERIFY_API_URL`: Setze diesen auf `/api/verify-altcha`.
    *   `ALTCHA_SECRET_KEY`: Dies ist ein geheimer Schlüssel, der für die Generierung und Verifizierung von Altcha-Challenges verwendet wird. Er sollte ein langer, zufälliger String sein und nur serverseitig verwendet werden.
*   **Lokale Entwicklung:** Die `api/altcha-challenge.ts` und `api/verify-altcha.ts`-Dateien sind [Vercel Serverless Functions](https://vercel.com/docs/functions/serverless-functions). Sie werden **nicht** vom lokalen Vite-Entwicklungsserver ausgeführt. Daher wird die Altcha-Verifizierung nur funktionieren, wenn die Anwendung auf Vercel bereitgestellt wird. Bei lokaler Ausführung kann es zu `404 Not Found`-Fehlern für diese Endpunkte kommen.

## Database & SQL

All SQL scripts and database-related documentation can be found in the `supabase/sql` directory.