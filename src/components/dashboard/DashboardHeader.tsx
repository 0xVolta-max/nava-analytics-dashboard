import { UserNav } from "./UserNav";
import { DateRangePicker } from "./DateRangePicker";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import { platformData, nicheData } from "@/lib/mockData";

export function DashboardHeader() {
    return (
        <div className="flex flex-col md:flex-row items-center justify-between mb-5 gap-4">
            <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center font-bold text-white">📊</div>
                <h1 className="text-lg font-semibold text-white">NAVA Analytics Dashboard</h1>
            </div>
            <div className="flex items-center flex-wrap justify-center md:justify-end gap-4">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="outline" className="bg-white/15 border border-white/20 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-md hover:bg-white/20 transition-colors flex items-center">
                            Filter data
                            <ChevronDown className="ml-2 h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-background/[.35] backdrop-blur-xl border-border/25 text-white">
                        <DropdownMenuItem>All Data</DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-white/20" />
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Filter by Platform</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background/[.35] backdrop-blur-xl border-border/25 text-white">
                                    {platformData.labels.map(platform => <DropdownMenuItem key={platform}>{platform}</DropdownMenuItem>)}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSub>
                            <DropdownMenuSubTrigger>Filter by Niche</DropdownMenuSubTrigger>
                            <DropdownMenuPortal>
                                <DropdownMenuSubContent className="bg-background/[.35] backdrop-blur-xl border-border/25 text-white">
                                    {nicheData.labels.map(niche => <DropdownMenuItem key={niche}>{niche}</DropdownMenuItem>)}
                                </DropdownMenuSubContent>
                            </DropdownMenuPortal>
                        </DropdownMenuSub>
                    </DropdownMenuContent>
                </DropdownMenu>
                <DateRangePicker />
                <div className="text-xs text-white/80">11 min ago</div>
                <UserNav />
            </div>
        </div>
    );
}