import { getPlatformIcon, getMomentum } from "@/lib/social-weather/mapping";
import { formatEngagement } from "@/lib/social-weather/format";
import type { Platform } from "@/lib/social-weather/types";
import { Button } from "@/components/ui/button";

interface PlatformMiniProps {
  platform: Platform;
  engagementRate: number;
  trendSlope: number;
  onClick: () => void;
}

export const PlatformMini = ({ platform, engagementRate, trendSlope, onClick }: PlatformMiniProps) => {
  const Icon = getPlatformIcon(platform);
  const { icon: TrendIcon } = getMomentum(trendSlope);

  return (
    <Button
      variant="ghost"
      className="flex-1 flex flex-col items-center justify-center h-auto p-1.5 space-y-1 rounded-lg hover:bg-white/10 transition-colors"
      onClick={onClick}
    >
      {typeof Icon === 'string' ? (
        <span className="font-bold text-base">{Icon}</span>
      ) : (
        <Icon className="h-4 w-4 text-white/80" />
      )}
      <span className="text-[11px] font-bold leading-none">{formatEngagement(engagementRate)}</span>
      <TrendIcon className="h-3.5 w-3.5 text-white/60" />
    </Button>
  );
};