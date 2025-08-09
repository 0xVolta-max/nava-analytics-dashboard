import { Sidebar } from "@/components/Sidebar";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/dashboard/DatePicker"
import { OverviewChart } from "@/components/dashboard/OverviewChart"
import { RecentSales } from "@/components/dashboard/RecentSales"
import { StatCard } from "@/components/dashboard/StatCard"
import { UserNav } from "@/components/dashboard/UserNav"
import { DollarSign, Users, CreditCard, Activity, Search } from "lucide-react"

const DashboardPage = () => {
  return (
    <>
      <div className="hidden md:flex h-screen w-full">
        <Sidebar className="w-64" />
        <div className="flex-1 flex flex-col">
          <header className="border-b">
            <div className="flex h-16 items-center px-8">
              <div className="ml-auto flex items-center space-x-4">
                <div className="relative ml-auto flex-1 md:grow-0">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    placeholder="Search..."
                    className="w-full rounded-lg bg-background pl-8 md:w-[200px] lg:w-[336px]"
                  />
                </div>
                <UserNav />
              </div>
            </div>
          </header>
          <main className="flex-1 space-y-4 p-8 pt-6 overflow-y-auto">
            <div className="flex items-center justify-between space-y-2">
              <div>
                <h2 className="text-3xl font-bold tracking-tight">Hello Shahrukh 👋</h2>
                <p className="text-muted-foreground">Here's a list of your stats for today!</p>
              </div>
              <div className="flex items-center space-x-2">
                <DatePicker />
                <Button>Download</Button>
              </div>
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                title="Total Revenue"
                value="$45,231.89"
                icon={DollarSign}
                description="+20.1% from last month"
              />
              <StatCard
                title="Subscriptions"
                value="+2350"
                icon={Users}
                description="+180.1% from last month"
              />
              <StatCard
                title="Sales"
                value="+12,234"
                icon={CreditCard}
                description="+19% from last month"
              />
              <StatCard
                title="Active Now"
                value="+573"
                icon={Activity}
                description="+201 since last hour"
              />
            </div>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <Card className="col-span-4">
                <CardHeader>
                  <CardTitle>Overview</CardTitle>
                </CardHeader>
                <CardContent className="pl-2">
                  <OverviewChart />
                </CardContent>
              </Card>
              <Card className="col-span-4 lg:col-span-3">
                <CardHeader>
                  <CardTitle>Recent Sales</CardTitle>
                  <CardDescription>
                    You made 265 sales this month.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RecentSales />
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
      <div className="md:hidden flex flex-col items-center justify-center h-screen text-center p-4">
        <h2 className="text-2xl font-bold">Dashboard not available on mobile</h2>
        <p className="text-muted-foreground">Please use a desktop device to view this page.</p>
      </div>
    </>
  )
}

export default DashboardPage