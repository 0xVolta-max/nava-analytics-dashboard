import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { platformData } from '@/lib/mockData';
import { doughnutChartOptions } from '@/lib/chart-configs';

ChartJS.register(ArcElement, Tooltip, Legend);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2 text-xs">
        <div className="w-3 h-3 rounded-sm border border-white/50" style={{ backgroundColor: color }}></div>
        <span>{label}</span>
    </div>
);

export function PlatformChart() {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/25 rounded-2xl p-6">
            <div className="mb-5">
                <div className="text-xs text-white/70 font-medium">Last 30 days</div>
                <div className="text-base font-semibold text-white/90 mt-1">Videos by Platform</div>
            </div>
            <div className="h-48 w-48 mx-auto">
                <Doughnut data={platformData} options={doughnutChartOptions} />
            </div>
            <div className="flex justify-center flex-wrap gap-4 mt-5">
                {platformData.labels.map((label, index) => (
                    <LegendItem key={label} label={label} color={platformData.datasets[0].backgroundColor[index]} />
                ))}
            </div>
        </div>
    );
}