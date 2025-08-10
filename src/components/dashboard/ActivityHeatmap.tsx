const HeatmapCell = ({ intensity }: { intensity: number }) => {
    const opacity = 0.2 + intensity * 0.8; // Erhöhte Grund-Deckkraft
    return (
        <div
            className="aspect-square rounded-md border border-white/10" // Rahmen hinzugefügt
            style={{ backgroundColor: `rgba(204, 86, 42, ${opacity})` }}
            title={`${Math.floor(1400 + intensity * 4800)} generations`}
        />
    );
};

const ScaleItem = ({ opacity }: { opacity: number }) => (
    <div className="w-3 h-3 rounded-sm border border-white/10" style={{ backgroundColor: `rgba(204, 86, 42, ${opacity})` }} />
);

export function ActivityHeatmap() {
    const days = Array.from({ length: 35 }, () => Math.random());
    const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6">
            <div className="mb-5">
                <div className="text-xs text-white/70 font-medium">Last 30 days</div>
                <div className="text-base font-semibold text-white/90 mt-1">Generation Activity</div>
            </div>
            <div className="grid grid-cols-7 gap-2 mb-2 text-center text-xs text-white/70">
                {weekDays.map(day => <div key={day}>{day}</div>)}
            </div>
            <div className="grid grid-cols-7 gap-1">
                {days.map((intensity, i) => <HeatmapCell key={i} intensity={intensity} />)}
            </div>
            <div className="flex justify-between items-center mt-4 text-xs text-white/70">
                <span>Less</span>
                <div className="flex gap-1">
                    <ScaleItem opacity={0.2} />
                    <ScaleItem opacity={0.4} />
                    <ScaleItem opacity={0.6} />
                    <ScaleItem opacity={0.8} />
                    <ScaleItem opacity={1.0} />
                </div>
                <span>More</span>
            </div>
        </div>
    );
}