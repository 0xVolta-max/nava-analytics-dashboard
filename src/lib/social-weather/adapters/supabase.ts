import { supabase } from "@/lib/supabaseClient";
import type { SocialWeather } from '../types';

/**
 * Ruft Social-Weather-Daten von einer Supabase RPC-Funktion ab.
 * 
 * Diese Funktion geht davon aus, dass Sie eine Funktion in Ihrer Supabase-Datenbank
 * mit dem Namen `nava_get_social_weather` haben, die ein JSON-Objekt zurückgibt,
 * das mit dem `SocialWeather`-Typ übereinstimmt.
 */
export const getSocialWeatherFromSupabase = async (): Promise<SocialWeather> => {
  // use singleton supabase client

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

/**
 * Ruft die aggregierte "Overall Engagement Rate" von einer Supabase RPC-Funktion ab.
 * 
 * Diese Funktion geht davon aus, dass Sie eine Funktion in Ihrer Supabase-Datenbank
 * mit dem Namen `nava_calculate_overall_engagement_rate` haben, die eine einzelne
 * Zahl (Prozentsatz) zurückgibt.
 */
export const getOverallEngagementRate = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_overall_engagement_rate');

  if (error) {
    console.error("Fehler beim Abrufen der Overall Engagement Rate von Supabase:", error);
    throw new Error("Konnte Overall Engagement Rate nicht laden.");
  }

  if (typeof data !== 'number') {
    console.error("Unerwarteter Datentyp von nava_calculate_overall_engagement_rate:", typeof data);
    throw new Error("Ungültiges Datenformat für Engagement Rate.");
  }

  return data;
};

/**
 * Ruft den Virality Score von einer Supabase RPC-Funktion ab.
 * 
 * Diese Funktion geht davon aus, dass Sie eine Funktion in Ihrer Supabase-Datenbank
 * mit dem Namen `nava_calculate_virality_metrics` haben, die eine einzelne
 * Zahl (Score von 0.0 bis 10.0) zurückgibt.
 */
export const getViralityMetrics = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_virality_metrics');

  if (error) {
    console.error("Fehler beim Abrufen der Virality Metrics von Supabase:", error);
    throw new Error("Konnte Virality Metrics nicht laden.");
  }

  if (typeof data !== 'number') {
    console.error("Unerwarteter Datentyp von nava_calculate_virality_metrics:", typeof data);
    throw new Error("Ungültiges Datenformat für Virality Score.");
  }

  return data;
};

/**
 * Ruft den Buzz Score von einer Supabase RPC-Funktion ab.
 * 
 * Diese Funktion geht davon aus, dass Sie eine Funktion in Ihrer Supabase-Datenbank
 * mit dem Namen `nava_calculate_buzz_score` haben, die eine einzelne
 * Zahl (Score von 0 bis 100) zurückgibt.
 */
export const getBuzzScore = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_buzz_score');

  if (error) {
    console.error("Fehler beim Abrufen des Buzz Score von Supabase:", error);
    throw new Error("Konnte Buzz Score nicht laden.");
  }

  if (typeof data !== 'number') {
    console.error("Unerwarteter Datentyp von nava_calculate_buzz_score:", typeof data);
    throw new Error("Ungültiges Datenformat für Buzz Score.");
  }

  return data;
};