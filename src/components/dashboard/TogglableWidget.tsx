import * as React from 'react';
import SocialWeatherWidget from '@/components/social-weather/Widget';
import GenerationActivity from '@/components/dashboard/GenerationActivity';
import { Button } from '@/components/ui/button';
import { Sun, BarChartHorizontal } from 'lucide-react';

const TogglableWidget = () => {
  const [showWeather, setShowWeather] = React.useState(true);

  return (
    <div className="relative">
      {/* This container enforces a minimum height to prevent layout shifts */}
      <div className="relative min-h-[380px]">
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            showWeather ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <SocialWeatherWidget />
        </div>
        <div
          className={`absolute inset-0 transition-opacity duration-300 ease-in-out ${
            !showWeather ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <GenerationActivity />
        </div>
      </div>

      <div className="absolute top-2 left-2 z-20">
        <Button
          size="icon"
          variant="ghost"
          className="bg-black/20 hover:bg-black/30 backdrop-blur-sm rounded-full w-8 h-8"
          onClick={() => setShowWeather(prev => !prev)}
          aria-label="Toggle widget view"
        >
          {showWeather ? <BarChartHorizontal className="h-4 w-4 text-white/80" /> : <Sun className="h-4 w-4 text-white/80" />}
        </Button>
      </div>
    </div>
  );
};

export default TogglableWidget;