import * as React from 'react';
import { HelpCircle } from 'lucide-react';
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { getSocialWeather } from "@/lib/social-weather/adapters/mock";
import { formatEngagement } from "@/lib/social-weather/format";
import { getWeatherIcon, getMomentum, getViralChance, viralityLevels, momentumLevels } from "@/lib/social-weather/mapping";
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

  return (
    <>
      <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 flex flex-col h-full">
        <div className="flex justify-between items-center mb-4 pr-10">
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
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 w-24">
                    <span className="text-white/70">Momentum</span>
                    <Popover>
                        <PopoverTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-white/50 hover:text-white/80 transition-colors cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent side="right" className="w-60 bg-background/[.35] backdrop-blur-xl border-border/25 text-white p-3">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold mb-2">Momentum Legend</p>
                            {momentumLevels.map((level) => (
                            <div key={level.label} className="flex items-center justify-between text-xs">
                                <span className="text-white/80">{level.label}</span>
                                <div className="flex items-center gap-1">
                                    {Array.from({ length: level.count }).map((_, i) => (
                                        <level.icon key={i} className={`h-3.5 w-3.5 ${level.color}`} />
                                    ))}
                                </div>
                            </div>
                            ))}
                        </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: momentum.count }).map((_, i) => (
                    <momentum.icon key={i} className={`h-4 w-4 ${momentum.color}`} />
                  ))}
                </div>
              </div>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 w-24">
                    <span className="text-white/70">Virality</span>
                    <Popover>
                        <PopoverTrigger>
                        <HelpCircle className="h-3.5 w-3.5 text-white/50 hover:text-white/80 transition-colors cursor-pointer" />
                        </PopoverTrigger>
                        <PopoverContent side="right" className="w-60 bg-background/[.35] backdrop-blur-xl border-border/25 text-white p-3">
                        <div className="space-y-2">
                            <p className="text-sm font-semibold mb-2">Virality Legend</p>
                            {viralityLevels.map((level, index) => (
                            <div key={level.label} className="flex items-center justify-between text-xs">
                                <span className="text-white/80">{level.label}</span>
                                <div className="flex items-center gap-1">
                                {index < 3 ? (
                                    Array.from({ length: 3 - index }).map((_, i) => (
                                    <level.icon key={i} className={`h-3.5 w-3.5 ${level.color}`} />
                                    ))
                                ) : (
                                    <level.icon className={`h-3.5 w-3.5 ${level.color}`} />
                                )}
                                </div>
                            </div>
                            ))}
                        </div>
                        </PopoverContent>
                    </Popover>
                </div>
                <div className="flex items-center gap-0.5">
                  {viralChance.count > 0 ? (
                    Array.from({ length: viralChance.count }).map((_, i) => (
                      <viralChance.icon key={i} className={`h-4 w-4 ${viralChance.color}`} />
                    ))
                  ) : (
                    <viralChance.icon className={`h-4 w-4 ${viralChance.color}`} />
                  )}
                </div>
              </div>
              <div>
                 <div className="flex items-center gap-1.5 mb-1">
                    <span className="text-white/70 text-xs">Buzz Level</span>
                 </div>
                 <Progress value={data.global.buzzPressure} className="h-2 bg-white/20" />
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