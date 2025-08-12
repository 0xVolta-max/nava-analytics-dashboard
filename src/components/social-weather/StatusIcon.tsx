import type { LucideIcon } from 'lucide-react';

interface StatusIconProps {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const StatusIcon = ({ icon: Icon, color, label }: StatusIconProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <Icon className={`h-20 w-20 md:h-24 md:w-24 ${color}`} />
      <p className="text-sm font-medium text-white/80">{label}</p>
    </div>
  );
};