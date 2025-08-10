import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler } from 'chart.js';
import { lineChartOptions } from '@/lib/chart-configs';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Tooltip, Filler);

interface MetricCardProps {
    period: string;
    title: string;
    value: string;
    change: number;
    changeText: string;
    trendData: number[];
    chartColor: string;
}

export function MetricCard({ period, title, value, change, changeText, trendData, chartColor }: MetricCardProps) {
    const changeIsPositive = change >= 0;
    const chartData = {
        labels: Array.from({ length: 30 }, (_, i) => `Day ${i + 1}`),
        datasets: [{
            data: trendData,
            borderColor: chartColor,
            backgroundColor: `${chartColor}20`,
            borderWidth: 2,
            fill: true,
            tension: 0.4,
            pointRadius: 0,
        }]
    };

    return (
        <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 relative overflow-hidden">
            <div className="flex justify-between items-start mb-5">
                <div>
                    <div className="text-xs text-white/70 font-medium">{period}</div>
                    <div className="text-sm text-white/90 mt-1">{title}</div>
                </div>
            </div>
            <div className="text-4xl font-bold text-white mb-2">{value}</div>
            <div className={`flex items-center gap-1 text-xs ${changeIsPositive ? 'text-green-400' : 'text-red-400'}`}>
                {changeIsPositive ? '▲' : '▼'} {changeText}
            </div>
            <div className="h-32 mt-5">
                <Line data={chartData} options={lineChartOptions} />
            </div>
        </div>
    );
}