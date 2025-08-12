import type { LucideIcon } from 'lucide-react';

interface StatusIconProps {
  icon: LucideIcon;
  color: string;
  label: string;
}

export const StatusIcon = ({ icon: Icon, color, label }: StatusIconProps) => {
  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <Icon className={`h-24 w-24 md:h-28 md:w-28 ${color}`} />
      <p className="text-base font-medium text-white/80">{label}</p>
    </div>
  );
};