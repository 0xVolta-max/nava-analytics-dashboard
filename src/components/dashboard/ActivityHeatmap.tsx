import { Badge } from "@/components/ui/badge";

const ActivityHeatmap = () => {
  // Simple pseudo-random generator for deterministic results
  const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };
  const random = seededRandom(123); // Use a fixed seed for consistency

  // Generate mock data for a year (52 weeks * 7 days)
  const data = Array.from({ length: 364 }).map(() => Math.floor(random() * 5));

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
        <div className="grid grid-cols-53 grid-rows-7 gap-1 w-full">
          {data.map((value, index) => (
            <div
              key={index}
              className={`aspect-square rounded-sm ${getColor(value)}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityHeatmap;