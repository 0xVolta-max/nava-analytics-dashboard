import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { PlatformChart } from "@/components/dashboard/PlatformChart";
import { NicheChart } from "@/components/dashboard/NicheChart";
import { ActivityHeatmap } from "@/components/dashboard/ActivityHeatmap";
import { mockData } from "@/lib/mockData";
import safyLogoUrl from '../assets/safy-logo.svg?url';

const formatNumber = (num: number) => {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
};

const DashboardPage = () => {
  return (
    <div className="p-5 min-h-screen flex flex-col">
        <div className="dashboard-container max-w-7xl mx-auto w-full flex-grow">
            <DashboardHeader />

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-5">
                <MetricCard
                    period="Last 30 days (Jul 6 - Aug 4)"
                    title="Analyses"
                    value={formatNumber(mockData.analyses.current)}
                    change={8}
                    changeText="8% vs previous period (11.6k)"
                    trendData={mockData.analyses.trend}
                    chartColor="#ffffff"
                />
                <MetricCard
                    period="Last 30 days (Jul 6 - Aug 4)"
                    title="Generated Videos"
                    value={formatNumber(mockData.videos.current)}
                    change={22}
                    changeText="22% vs previous period (1.47k)"
                    trendData={mockData.videos.trend}
                    chartColor="#4ade80"
                />
                <MetricCard
                    period="Last 30 days (Jul 6 - Aug 4)"
                    title="Scripts"
                    value={formatNumber(mockData.scripts.current)}
                    change={-3}
                    changeText="3% vs previous period (9.1k)"
                    trendData={mockData.scripts.trend}
                    chartColor="#fbbf24"
                />
                <div className="bg-white/10 backdrop-blur-xl border border-white/15 rounded-2xl p-6 flex flex-col justify-between">
                     <div>
                        <div className="text-xs text-white/70 font-medium">Last 30 days</div>
                        <div className="text-sm text-white/90 mt-1">Quality Metrics</div>
                    </div>
                    <div className="flex justify-between gap-4 items-start">
                        <div>
                            <div className="text-sm text-white/90 whitespace-nowrap">Avg Quality Score</div>
                            <div className="text-2xl font-bold text-white mt-1">85.2</div>
                            <div className="text-xs text-green-400">▲ 2% vs previous period</div>
                        </div>
                        <div>
                            <div className="text-sm text-white/90 whitespace-nowrap">Success Rate</div>
                            <div className="text-2xl font-bold text-white mt-1">78.6%</div>
                            <div className="text-xs text-green-400">▲ 5% vs previous period</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-5">
                <div className="xl:col-span-1">
                    <PlatformChart />
                </div>
                <div className="xl:col-span-2">
                    <NicheChart />
                </div>
                <div className="xl:col-span-1">
                    <ActivityHeatmap />
                </div>
            </div>
        </div>
        <footer className="pt-10 pb-4 flex justify-center items-center">
            <img src={safyLogoUrl} alt="SAFY Logo" className="w-[150px] h-auto" />
        </footer>
    </div>
  );
};

export default DashboardPage;