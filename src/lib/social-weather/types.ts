export type Platform = 'youtube' | 'instagram' | 'tiktok';

export type SocialWeather = {
  global: {
    engagementE: number; // 0–100
    feelsLikeE: number; // 0–100
    viralScore: number; // 0–100
    momentum: number; // -1..1
    viralChance12h: number; // 0–100
    buzzPressure: number; // 0–100
  };
  platforms: Array<{
    platform: Platform;
    engagementRate: number; // 0–100
    viralScore: number; // 0–100
    trendSlope: number; // -1..1
    views: number;
    shares: number;
  }>;
  timestamp: string;
};