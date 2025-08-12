import * as React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { getSocialWeather } from "@/lib/social-weather/adapters/mock";
import { formatEngagement } from "@/lib/social-weather/format";
import { getWeatherIcon, getMomentum, getViralChance } from "@/lib/social-weather/mapping";
import type { SocialWeather, Platform } from "@/lib/social-weather/types";
import { StatusIcon } from './StatusIcon';
import { PlatformMini } from './PlatformMini';
import { DetailDrawer } from './DetailDrawer';

const SocialWeatherWidget = () => {
  const [data, setData] = React.useState<SocialWeather | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [selectedPlatform, setSelectedPlatform] = React.useState<Platform | null>(null);

  React.useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const weatherData = await getSocialWeather(new Date().getDate());
      setData(weatherData);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handlePlatformClick = (platform: Platform) => {
    setSelectedPlatform(platform);
    setIsDrawerOpen(true);
  };

  if (isLoading || !data) {
    return <Skeleton className="bg-white/10 w-full h-[380px] rounded-2xl" />;
  }

  const weather = getWeatherIcon(data.global.viralScore);
  const momentum = getMomentum(data.global.momentum);
  const viralChance = getViralChance(data.global.viralChance12h);
  const MomentumIcon = momentum.icon;

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-white/90">Social Pulse</h3>
          <Badge variant="outline" className="border-white/20 text-white/80">Last 7 Days</Badge>
        </div>

        <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-center p-4 rounded-lg bg-white/5">
            <StatusIcon icon={weather.icon} color={weather.color} label={weather.label} />
          </div>
          <div className="space-y-3 flex flex-col justify-center">
            <div>
              <p className="text-4xl lg:text-5xl font-bold text-white">{formatEngagement(data.global.engagementE)}</p>
              <p className="text-xs text-white/70">Overall Engagement Rate</p>
            </div>
            <div className="space-y-2 text-xs">
              <div className="flex items-center">
                <span className="text-white/70 w-1/2">Momentum</span>
                <div className="flex items-center gap-1 font-medium w-1/2 justify-end">
                  <MomentumIcon className="h-4 w-4" /> {momentum.label}
                </div>
              </div>
              <div className="flex items-center">
                <span className="text-white/70 w-1/2">Virality Potential</span>
                <div className="flex items-center gap-1 w-1/2 justify-end">
                  {viralChance.count > 0 ? Array.from({ length: viralChance.count }).map((_, i) => (
                    <viralChance.icon key={i} className="h-4 w-4 text-blue-300" />
                  )) : <span className="font-medium">Low</span>}
                </div>
              </div>
              <div>
                 <span className="text-white/70 text-xs">Buzz Level</span>
                 <Progress value={data.global.buzzPressure} className="h-2 mt-1 bg-white/20" />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-2 pt-2 border-t border-white/15 flex justify-around items-center gap-2">
          {data.platforms.map(p => (
            <PlatformMini
              key={p.platform}
              platform={p.platform}
              engagementRate={p.engagementRate}
              trendSlope={p.trendSlope}
              onClick={() => handlePlatformClick(p.platform)}
            />
          ))}
        </div>
      </div>
      <DetailDrawer
        isOpen={isDrawerOpen}
        onOpenChange={setIsDrawerOpen}
        platform={selectedPlatform}
        data={data}
      />
    </>
  );
};

export default SocialWeatherWidget;