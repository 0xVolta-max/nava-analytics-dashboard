import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { nicheData } from '@/lib/mockData';
import { barChartOptions } from '@/lib/chart-configs';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const LegendItem = ({ color, label }: { color: string, label: string }) => (
    <div className="flex items-center gap-2 text-sm">
        <div className="w-3.5 h-3.5 rounded-sm border border-white/50" style={{ backgroundColor: color }}></div>
        <span>{label}</span>
    </div>
);

export function NicheChart() {
    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-7 h-full flex flex-col">
            <div className="mb-6">
                <div className="text-sm text-white/70 font-medium">Last 30 days</div>
                <div className="text-lg font-semibold text-white/90 mt-1">Performance by Niche</div>
            </div>
            <div className="flex-grow relative">
                <Bar data={nicheData} options={barChartOptions} />
            </div>
            <div className="flex justify-center flex-wrap gap-5 mt-6">
                <LegendItem color="#4ade80" label="High Performing" />
                <LegendItem color="#fbbf24" label="Average" />
            </div>
        </div>
    );
}