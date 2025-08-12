import * as React from 'react';
import SocialWeatherWidget from '@/components/social-weather/Widget';
import ActivityHeatmap from '@/components/dashboard/ActivityHeatmap';
import { Button } from '@/components/ui/button';
import { Sun, BarChartHorizontal } from 'lucide-react';

const TogglableWidget = () => {
  const [showWeather, setShowWeather] = React.useState(true);

  const commonClasses = 'absolute inset-0 transition-all duration-300 ease-in-out';

  return (
    <div className="relative h-full">
      <div className="relative h-full overflow-hidden rounded-2xl">
        <div
          className={`${commonClasses} ${
            showWeather ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <SocialWeatherWidget />
        </div>
        <div
          className={`${commonClasses} ${
            !showWeather ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'
          }`}
        >
          <ActivityHeatmap />
        </div>
      </div>

      <div className="absolute top-5 right-5 z-20">
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