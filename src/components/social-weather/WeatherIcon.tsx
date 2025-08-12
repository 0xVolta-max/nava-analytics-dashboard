import type { LucideIcon } from 'lucide-react';

interface WeatherIconProps {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const WeatherIcon = ({ icon: Icon, color, label }: WeatherIconProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Icon className={`h-20 w-20 md:h-24 md:w-24 ${color}`} />
      <p className="text-sm font-medium text-white/80">{label}</p>
    </div>
  );
};