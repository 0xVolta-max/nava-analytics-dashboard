import { UserNav } from "./UserNav";
import { DateRangePicker } from "./DateRangePicker";

const GlassButton = ({ children }: { children: React.ReactNode }) => (
    <button className="bg-white/15 border border-white/20 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-md hover:bg-white/20 transition-colors">
        {children}
    </button>
);

export function DashboardHeader() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white">📊</div>
                <h1 className="text-lg font-semibold text-white">NAVA Analytics Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
                <GlassButton>🔽 Filter data</GlassButton>
                <DateRangePicker />
                <div className="text-xs text-white/80">11 min ago</div>
                <UserNav />
            </div>
        </div>
    );
}