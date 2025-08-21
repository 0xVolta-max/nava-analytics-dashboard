// DIESE DATEI IST NUR EIN KONZEPTIONELLES BEISPIEL FÜR EINE NEXT.JS API-ROUTE.
// SIE KANN NICHT DIREKT IN IHR AKTUELLES VITE REACT PROJEKT EINGEFÜGT WERDEN.

import { NextResponse } from 'next/server';

// In einer echten Next.js-Anwendung würden Sie hier eine Datenbank oder einen Cache verwenden,
// um fehlgeschlagene Anmeldeversuche zu verfolgen.
const failedLoginAttempts = new Map<string, number>(); // Map<email, count>
const MAX_FAILED_ATTEMPTS = 3; // Beispielwert

export async function POST(request: Request) {
  const { token, email } = await request.json(); // 'email' ist optional für Rate-Limiting

  if (!token) {
    return NextResponse.json({ success: false, message: 'Turnstile token missing.' }, { status: 400 });
  }

  // Serverseitige Validierung des Turnstile-Tokens
  const secretKey = process.env.TURNSTILE_SECRET_KEY;

  if (!secretKey) {
    console.error('TURNSTILE_SECRET_KEY is not set in environment variables.');
    return NextResponse.json({ success: false, message: 'Server configuration error.' }, { status: 500 });
  }

  const formData = new FormData();
  formData.append('secret', secretKey);
  formData.append('response', token);

  const url = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  const data = await response.json();

  if (!data.success) {
    console.error('Turnstile verification failed:', data['error-codes']);
    // Hier könnte man auch die fehlgeschlagenen Versuche für Rate-Limiting erhöhen
    return NextResponse.json({ success: false, message: 'Bot verification failed. Please try again.' }, { status: 403 });
  }

  // Beispiel für Rate-Limiting-Logik (nur für Login relevant)
  if (email) {
    // Wenn die Verifizierung erfolgreich war, setzen wir die Zähler zurück
    failedLoginAttempts.set(email, 0);
  }

  return NextResponse.json({ success: true, message: 'Bot verification successful.' });
}

// Beispiel für eine Funktion, die die Notwendigkeit von Turnstile basierend auf Fehlversuchen prüft
// Diese Funktion würde in Ihrer Login-Logik aufgerufen werden, BEVOR Sie Turnstile anzeigen.
export function shouldShowTurnstile(email: string): boolean {
  const attempts = failedLoginAttempts.get(email) || 0;
  return attempts >= MAX_FAILED_ATTEMPTS;
}

// Beispiel für eine Funktion, die fehlgeschlagene Anmeldeversuche erhöht
export function incrementFailedLoginAttempts(email: string) {
  const attempts = failedLoginAttempts.get(email) || 0;
  failedLoginAttempts.set(email, attempts + 1);
}