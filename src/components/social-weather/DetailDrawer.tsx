import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { formatEngagement, formatNumber } from "@/lib/social-weather/format";
import { getMomentum, getWeatherIcon } from "@/lib/social-weather/mapping";
import type { SocialWeather, Platform } from "@/lib/social-weather/types";

interface DetailDrawerProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  platform: Platform | null;
  data: SocialWeather | null;
}

export const DetailDrawer = ({ isOpen, onOpenChange, platform, data }: DetailDrawerProps) => {
  if (!platform || !data) return null;

  const platformData = data.platforms.find(p => p.platform === platform);
  if (!platformData) return null;

  const weather = getWeatherIcon(platformData.viralScore);
  const momentum = getMomentum(platformData.trendSlope);
  const StatusIcon = weather.icon;
  const MomentumIcon = momentum.icon;

  return (
    <Sheet open={isOpen} onOpenChange={onOpenChange}>
      <SheetContent className="bg-background/[.05] backdrop-blur-xl border-border/10 text-white">
        <SheetHeader>
          <SheetTitle className="capitalize text-white/90">{platform} Details</SheetTitle>
          <SheetDescription className="text-white/70">Detailed metrics for the last 7 days.</SheetDescription>
        </SheetHeader>
        <div className="mt-6 space-y-6">
          <div className="flex items-center justify-between rounded-lg bg-white/10 p-4">
            <div className="flex items-center gap-4">
                <StatusIcon className={`h-10 w-10 ${weather.color}`} />
                <div>
                    <p className="text-sm text-white/70">Viral Score</p>
                    <p className="text-xl sm:text-2xl font-bold">{Math.round(platformData.viralScore)}</p>
                </div>
            </div>
            <div className="text-right">
                <p className="text-sm text-white/70">Engagement</p>
                <p className="text-xl sm:text-2xl font-bold">{formatEngagement(platformData.engagementRate)}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-white/80">Key Performance Indicators</h3>
            <div className="flex justify-between">
                <span className="text-white/70">Views</span>
                <span className="font-semibold">{formatNumber(platformData.views)}</span>
            </div>
             <div className="flex justify-between">
                <span className="text-white/70">Shares</span>
                <span className="font-semibold">{formatNumber(platformData.shares)}</span>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-white/70">Trend</span>
                <div className="flex items-center gap-2">
                    <MomentumIcon className="h-4 w-4" />
                    <span className="font-semibold">{momentum.label}</span>
                </div>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};