import { Sun, CloudSun, Cloudy, CloudRain, Zap, ArrowUp, ArrowDown, Minus, Droplets, Youtube, Instagram, type LucideIcon } from 'lucide-react';
import type { Platform } from './types';

export const getWeatherIcon = (viralScore: number): { icon: LucideIcon; color: string; label: string } => {
  if (viralScore > 85) return { icon: Zap, color: 'text-red-400', label: 'Storm' };
  if (viralScore > 65) return { icon: CloudRain, color: 'text-blue-400', label: 'Rainy' };
  if (viralScore > 40) return { icon: Cloudy, color: 'text-gray-400', label: 'Cloudy' };
  if (viralScore > 20) return { icon: CloudSun, color: 'text-yellow-400', label: 'Partly Cloudy' };
  return { icon: Sun, color: 'text-orange-400', label: 'Sunny' };
};

export const getMomentum = (slope: number): { icon: LucideIcon; label: string } => {
  if (slope > 0.1) return { icon: ArrowUp, label: 'Trending Up' };
  if (slope < -0.1) return { icon: ArrowDown, label: 'Trending Down' };
  return { icon: Minus, label: 'Stable' };
};

export const getViralChance = (chance: number): { count: number; icon: LucideIcon } => {
  if (chance > 75) return { count: 3, icon: Droplets };
  if (chance > 50) return { count: 2, icon: Droplets };
  if (chance > 25) return { count: 1, icon: Droplets };
  return { count: 0, icon: Droplets };
};

export const getPlatformIcon = (platform: Platform): LucideIcon | string => {
    switch (platform) {
        case 'youtube': return Youtube;
        case 'instagram': return Instagram;
        case 'tiktok': return 'TikTok';
    }
}