import * as React from "react"
import { addDays, format } from "date-fns"
import { Calendar as CalendarIcon } from "lucide-react"
import { DateRange } from "react-day-picker"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"

export function DateRangePicker() {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addDays(new Date(), -29),
    to: new Date(),
  })

  const setPreset = (days: number) => {
    setDate({
        from: addDays(new Date(), -days),
        to: new Date(),
    })
  }

  return (
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              "w-[260px] justify-start text-left font-normal bg-white/15 border border-white/20 text-white px-4 py-2 rounded-lg text-sm backdrop-blur-md hover:bg-white/20 transition-colors"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0 bg-background/80 backdrop-blur-lg border-border" align="end">
          <div className="flex items-start">
            <div className="flex flex-col space-y-1 p-2 border-r border-border">
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => setPreset(0)}>1 day</Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => setPreset(6)}>7 days</Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => setPreset(13)}>14 days</Button>
                <Button variant="ghost" className="w-full justify-start text-white/80 hover:text-white" onClick={() => setPreset(29)}>30 days</Button>
            </div>
            <Calendar
                initialFocus
                mode="range"
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={1}
            />
          </div>
        </PopoverContent>
      </Popover>
  )
}