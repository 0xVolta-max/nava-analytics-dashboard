import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Package, Users, LineChart } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("w-64 bg-card text-card-foreground p-4 space-y-6", className)}>
      <h2 className="text-2xl font-bold px-4">Nava</h2>
      <div className="space-y-2">
        <Button variant="ghost" className="w-full justify-start space-x-3 bg-primary text-primary-foreground hover:bg-primary/90">
          <Home className="h-5 w-5" />
          <span>Dashboard</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <ShoppingCart className="h-5 w-5" />
          <span>Orders</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <Package className="h-5 w-5" />
          <span>Products</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <Users className="h-5 w-5" />
          <span>Customers</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start space-x-3 text-muted-foreground hover:bg-accent hover:text-accent-foreground">
          <LineChart className="h-5 w-5" />
          <span>Analytics</span>
        </Button>
      </div>
    </div>
  );
}