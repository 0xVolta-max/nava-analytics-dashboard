import { Badge } from "@/components/ui/badge";

const ActivityHeatmap = () => {
  // Generate mock data for a year (52 weeks * 7 days)
  const data = Array.from({ length: 364 }).map(() => Math.floor(Math.random() * 5));

  const getColor = (value: number) => {
    switch (value) {
      case 0: return 'bg-white/5';
      case 1: return 'bg-orange-400/20';
      case 2: return 'bg-orange-400/40';
      case 3: return 'bg-orange-400/70';
      case 4: return 'bg-orange-400/90';
      default: return 'bg-white/5';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-5 flex flex-col h-full">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-semibold text-white/90">Activity Heatmap</h3>
        <Badge variant="outline" className="border-white/20 text-white/80">Last Year</Badge>
      </div>
      <div className="flex-grow flex items-center justify-center">
        <div className="grid grid-rows-7 grid-flow-col gap-1.5">
          {data.map((value, index) => (
            <div
              key={index}
              className={`w-3.5 h-3.5 rounded-sm ${getColor(value)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;