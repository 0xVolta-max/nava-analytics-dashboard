import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home, ShoppingCart, Package, Users, LineChart } from "lucide-react";

export function Sidebar({ className }: { className?: string }) {
  return (
    <div className={cn("pb-12 border-r", className)}>
      <div className="space-y-4 py-4">
        <div className="px-3 py-2">
          <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
            Nava
          </h2>
          <div className="space-y-1">
            <Button variant="secondary" className="w-full justify-start">
              <Home className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Orders
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Package className="mr-2 h-4 w-4" />
              Products
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <Users className="mr-2 h-4 w-4" />
              Customers
            </Button>
            <Button variant="ghost" className="w-full justify-start">
              <LineChart className="mr-2 h-4 w-4" />
              Analytics
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}