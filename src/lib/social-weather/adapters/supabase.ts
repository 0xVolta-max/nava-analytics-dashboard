import { createClient } from "@/lib/supabaseClient";
import type { SocialWeather } from '../types';

/**
 * Ruft Social-Weather-Daten von einer Supabase RPC-Funktion ab.
 * 
 * Diese Funktion geht davon aus, dass Sie eine Funktion in Ihrer Supabase-Datenbank
 * mit dem Namen `nava_get_social_weather` haben, die ein JSON-Objekt zurückgibt,
 * das mit dem `SocialWeather`-Typ übereinstimmt.
 */
export const getSocialWeatherFromSupabase = async (): Promise<SocialWeather> => {
  const supabase = createClient();

  // Rufen Sie die serverseitige Funktion in Supabase auf
  const { data, error } = await supabase.rpc('nava_get_social_weather');

  if (error) {
    console.error("Fehler beim Abrufen der Social-Weather-Daten von Supabase:", error);
    throw new Error("Konnte Social-Weather-Daten nicht laden.");
  }

  // Supabase RPC gibt die Daten direkt zurück.
  // Wir stellen sicher, dass sie dem erwarteten Typ entsprechen.
  return data as SocialWeather;
};