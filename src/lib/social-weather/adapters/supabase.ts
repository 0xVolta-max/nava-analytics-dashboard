import { supabase } from "@/lib/supabaseClient";
import type { SocialWeather } from '../types';

/**
 * Fetches Social Weather data from a Supabase RPC function.
 * 
 * This function assumes you have a function in your Supabase database
 * named `nava_get_social_weather` that returns a JSON object
 * matching the `SocialWeather` type.
 */
export const getSocialWeatherFromSupabase = async (): Promise<SocialWeather> => {
  // use singleton supabase client

  // Call the server-side function in Supabase
  const { data, error } = await supabase.rpc('nava_get_social_weather');

  if (error) {
    console.error("Error fetching Social Weather data from Supabase:", error);
    throw new Error("Could not load Social Weather data.");
  }

  // Supabase RPC returns the data directly.
  // We ensure it matches the expected type.
  return data as SocialWeather;
};

/**
 * Fetches the aggregated "Overall Engagement Rate" from a Supabase RPC function.
 * 
 * This function assumes you have a function in your Supabase database
 * named `nava_calculate_overall_engagement_rate` that returns a single
 * number (percentage).
 */
export const getOverallEngagementRate = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_overall_engagement_rate');

  if (error) {
    console.error("Error fetching Overall Engagement Rate from Supabase:", error);
    throw new Error("Could not load Overall Engagement Rate.");
  }

  if (typeof data !== 'number') {
    console.error("Unexpected data type from nava_calculate_overall_engagement_rate:", typeof data);
    throw new Error("Invalid data format for Engagement Rate.");
  }

  return data;
};

/**
 * Fetches the Virality Score from a Supabase RPC function.
 * 
 * This function assumes you have a function in your Supabase database
 * named `nava_calculate_virality_metrics` that returns a single
 * number (score from 0.0 to 10.0).
 */
export const getViralityMetrics = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_virality_metrics');

  if (error) {
    console.error("Error fetching Virality Metrics from Supabase:", error);
    throw new Error("Could not load Virality Metrics.");
  }

  if (typeof data !== 'number') {
    console.error("Unexpected data type from nava_calculate_virality_metrics:", typeof data);
    throw new Error("Invalid data format for Virality Score.");
  }

  return data;
};

/**
 * Fetches the Buzz Score from a Supabase RPC function.
 * 
 * This function assumes you have a function in your Supabase database
 * named `nava_calculate_buzz_score` that returns a single
 * number (score from 0 to 100).
 */
export const getBuzzScore = async (): Promise<number> => {
  // use singleton supabase client

  const { data, error } = await supabase.rpc('nava_calculate_buzz_score');

  if (error) {
    console.error("Error fetching Buzz Score from Supabase:", error);
    throw new Error("Could not load Buzz Score.");
  }

  if (typeof data !== 'number') {
    console.error("Unexpected data type from nava_calculate_buzz_score:", typeof data);
    throw new Error("Invalid data format for Buzz Score.");
  }

  return data;
};