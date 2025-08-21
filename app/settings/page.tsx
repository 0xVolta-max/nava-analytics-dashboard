import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";

const SettingsPage = () => {
  return (
    <div className="p-5 min-h-screen flex flex-col">
      <div className="dashboard-container max-w-7xl mx-auto w-full flex-grow mb-10">
        <DashboardHeader />
        <main className="grid flex-1 items-start gap-4 md:gap-8">
          <Tabs defaultValue="account">
            <div className="flex items-center mb-4">
              <TabsList className="bg-white/10 border-white/15">
                <TabsTrigger value="account">Account</TabsTrigger>
                <TabsTrigger value="password">Password</TabsTrigger>
                <TabsTrigger value="notifications">Notifications</TabsTrigger>
                <TabsTrigger value="billing">Billing</TabsTrigger>
              </TabsList>
            </div>
            <TabsContent value="account">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/15 text-white">
                <CardHeader>
                  <CardTitle>Account Settings</CardTitle>
                  <CardDescription>
                    Manage your account settings and set your e-mail preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input id="name" placeholder="Your Name" className="bg-white/5 border-white/20 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input id="email" type="email" placeholder="your@email.com" disabled className="bg-white/5 border-white/20" />
                  </div>
                  <Button>Save Changes</Button>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="password">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/15 text-white">
                <CardHeader>
                  <CardTitle>Password</CardTitle>
                  <CardDescription>
                    Change your password here. After saving, you'll be logged out.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="current-password">Current Password</Label>
                    <Input id="current-password" type="password" className="bg-white/5 border-white/20 focus:ring-primary" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">New Password</Label>
                    <Input id="new-password" type="password" className="bg-white/5 border-white/20 focus:ring-primary" />
                  </div>
                  <Button>Save Password</Button>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="notifications">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/15 text-white">
                <CardHeader>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>
                    Manage your notification preferences.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Notification settings coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
             <TabsContent value="billing">
              <Card className="bg-white/10 backdrop-blur-xl border border-white/15 text-white">
                <CardHeader>
                  <CardTitle>Billing</CardTitle>
                  <CardDescription>
                    Manage your billing information and view your invoices.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p>Billing management coming soon.</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  );
};

export default SettingsPage;