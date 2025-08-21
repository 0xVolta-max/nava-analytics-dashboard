import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ProfilePage = () => {
  return (
    <div className="p-5 min-h-screen flex flex-col">
      <div className="dashboard-container max-w-7xl mx-auto w-full flex-grow mb-10">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 md:gap-8">
          <Card className="bg-white/10 backdrop-blur-xl border border-white/15 text-white">
            <CardHeader>
              <CardTitle>Profile</CardTitle>
            </CardHeader>
            <CardContent>
              <p>Profile page is under construction.</p>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  );
};

export default ProfilePage;