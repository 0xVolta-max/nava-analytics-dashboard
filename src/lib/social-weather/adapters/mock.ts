import type { SocialWeather } from '../types';

// Simple pseudo-random generator for deterministic results
const seededRandom = (seed: number) => {
  let s = seed;
  return () => {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
};

export const getSocialWeather = async (seed = 1): Promise<SocialWeather> => {
  const random = seededRandom(seed);

  const globalViralScore = random() * 100;
  const globalEngagement = random() * 80 + 10;

  const data: SocialWeather = {
    global: {
      engagementE: globalEngagement,
      feelsLikeE: globalEngagement + (random() - 0.5) * 10,
      viralScore: globalViralScore,
      momentum: (random() - 0.5) * 2,
      viralChance12h: random() * 100,
      buzzPressure: random() * 100,
    },
    platforms: [
      {
        platform: 'youtube',
        engagementRate: random() * 100,
        viralScore: random() * 100,
        trendSlope: (random() - 0.5) * 2,
        views: random() * 5000000,
        shares: random() * 10000,
      },
      {
        platform: 'instagram',
        engagementRate: random() * 100,
        viralScore: random() * 100,
        trendSlope: (random() - 0.5) * 2,
        views: random() * 2000000,
        shares: random() * 25000,
      },
      {
        platform: 'tiktok',
        engagementRate: random() * 100,
        viralScore: random() * 100,
        trendSlope: (random() - 0.5) * 2,
        views: random() * 10000000,
        shares: random() * 50000,
      },
    ],
    timestamp: new Date().toISOString(),
  };

  // Simulate network delay
  await new Promise(res => setTimeout(res, 500));

  return data;
};