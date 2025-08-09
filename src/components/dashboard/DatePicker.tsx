"use client"

import * as React from "react"
import { format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DatePicker() {
  const [date, setDate] = React.useState<Date>()

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-[240px] justify-start text-left font-normal bg-black/20 backdrop-blur-lg border border-white/20 hover:bg-black/30 text-white",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-black/20 backdrop-blur-lg border border-white/20">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          classNames={{
            day_selected:
              "bg-orange-600 text-primary-foreground hover:bg-orange-600/90 focus:bg-orange-600",
            day_today: "bg-accent text-accent-foreground",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}