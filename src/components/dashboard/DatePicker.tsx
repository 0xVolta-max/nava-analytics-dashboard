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
            "w-[240px] justify-start text-left font-normal bg-input border-border hover:bg-accent text-foreground",
            !date && "text-muted-foreground"
          )}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 bg-popover border-border">
        <Calendar
          mode="single"
          selected={date}
          onSelect={setDate}
          initialFocus
          classNames={{
            day_selected:
              "bg-primary text-primary-foreground hover:bg-primary/90 focus:bg-primary",
            day_today: "bg-accent text-accent-foreground",
            day: "hover:bg-accent",
          }}
        />
      </PopoverContent>
    </Popover>
  )
}