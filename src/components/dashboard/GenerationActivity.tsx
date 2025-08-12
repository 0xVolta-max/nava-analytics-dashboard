import { Badge } from "@/components/ui/badge";

const GenerationActivity = () => {
  // Simple pseudo-random generator for deterministic results
  const seededRandom = (seed: number) => {
    let s = seed;
    return () => {
      s = Math.sin(s) * 10000;
      return s - Math.floor(s);
    };
  };
  const random = seededRandom(42); // Use a fixed seed for consistency

  // Generate mock data for 5 weeks (35 days)
  const data = Array.from({ length: 35 }).map(() => Math.floor(random() * 5));

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
      <div className="flex justify-between items-center mb-2">
        <h3 className="font-semibold text-white/90">Generation Activity</h3>
        <Badge variant="outline" className="border-white/20 text-white/80">Last 30 Days</Badge>
      </div>
      
      <div className="flex-grow flex flex-col justify-center">
        <div className="flex gap-3">
          <div className="flex flex-col justify-between text-xs text-white/50 py-1">
            <span>Mon</span>
            <span>Wed</span>
            <span>Fri</span>
          </div>
          <div className="grid grid-flow-col grid-rows-7 grid-cols-5 gap-2 w-full">
            {data.map((value, index) => (
              <div
                key={index}
                className={`aspect-square rounded-sm ${getColor(value)}`}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 mt-4 text-xs text-white/50">
        <span>Less</span>
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={`w-3 h-3 rounded-sm ${getColor(i)}`} />
            ))}
        </div>
        <span>More</span>
      </div>
    </div>
  );
};

export default GenerationActivity;