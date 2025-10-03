// DateRangePicker.tsx
import * as React from "react";
import {
  format,
  subDays,
  startOfMonth,
  endOfMonth,
  startOfYear,
  endOfYear,
} from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";

export type DateRange = { from: Date | undefined; to: Date | undefined };

type Props = {
  value?: DateRange;
  onChange?: (range: DateRange | undefined) => void;
  disabled?: boolean;
  className?: string;
  align?: "start" | "center" | "end";
};

const isSameDay = (a?: Date, b?: Date) =>
  !!a &&
  !!b &&
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

export default function DateRangePicker({
  value,
  onChange,
  disabled,
  className,
  align = "start",
}: Props) {
  const [open, setOpen] = React.useState(false);
  const [range, setRange] = React.useState<DateRange | undefined>(value);

  React.useEffect(
    () => setRange(value),
    [value?.from?.getTime(), value?.to?.getTime()]
  );

  const setPreset = (from?: Date, to?: Date) => {
    const r = { from, to };
    setRange(r);
    onChange?.(r);
    setOpen(false);
  };

  const label =
    range?.from && range?.to
      ? `${format(range.from, "PP")} – ${format(range.to, "PP")}`
      : range?.from
      ? `${format(range.from, "PP")} – …`
      : "Select date range";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          disabled={disabled}
          className={`w-[280px] justify-start text-left font-normal ${
            className ?? ""
          }`}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {label}
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-auto p-3 bg-white" align={align}>
        <div className="flex flex-col md:flex-row gap-3">
          <Calendar
            mode="range"
            numberOfMonths={2}
            selected={range}
            onSelect={(r) => {
              // Normalize selection:
              // - First click -> { from: date, to: undefined }
              // - If react-day-picker gives same-day range, keep it "open" until second click
              if (!r) {
                setRange(undefined);
                onChange?.(undefined);
                return;
              }

              if (r.from && r.to && isSameDay(r.from, r.to)) {
                const next = { from: r.from, to: undefined };
                setRange(next);
                onChange?.(next);
                return;
              }

              setRange(r);
              onChange?.(r);

              // Close only when a full range is set
              if (r.from && r.to) setOpen(false);
            }}
            initialFocus
            disabled={(date) => date > new Date()} // keep your future-date rule
          />

          {/* Presets */}
          <div className="flex md:flex-col gap-2">
            <Button
              onClick={() => setPreset(subDays(new Date(), 6), new Date())}
            >
              Last 7 days
            </Button>
            <Button
              onClick={() => setPreset(subDays(new Date(), 29), new Date())}
            >
              Last 30 days
            </Button>
            <Button
              onClick={() =>
                setPreset(startOfMonth(new Date()), endOfMonth(new Date()))
              }
            >
              This month
            </Button>
            <Button
              onClick={() =>
                setPreset(startOfYear(new Date()), endOfYear(new Date()))
              }
            >
              This year
            </Button>
            <Button
              variant="ghost"
              onClick={() => setPreset(undefined, undefined)}
            >
              Clear
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
