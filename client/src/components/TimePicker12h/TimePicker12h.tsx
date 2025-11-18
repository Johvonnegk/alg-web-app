// TimePicker12h.tsx
import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

const HOURS = Array.from({ length: 12 }, (_, i) =>
  String(i + 1).padStart(2, "0")
);

const MINUTES = Array.from({ length: 60 }, (_, i) =>
  String(i).padStart(2, "0")
);

type TimePicker12hProps = {
  value?: string; // "HH:MM" in 24h format, e.g. "13:27"
  onChange?: (value: string) => void; // emits "HH:MM" 24h
  className?: string;
};

function parse24To12(value?: string) {
  if (!value) {
    return {
      hour12: "",
      minute: "",
      meridiem: "AM" as "AM" | "PM",
    };
  }

  const [hStr, mStr = "00"] = value.split(":");
  const h24 = Number(hStr);
  const isPM = h24 >= 12;
  const h12 = h24 % 12 || 12;

  return {
    hour12: String(h12).padStart(2, "0"),
    minute: String(mStr).padStart(2, "0"),
    meridiem: isPM ? ("PM" as const) : ("AM" as const),
  };
}

function build24From12(opts: {
  hour12?: string;
  minute?: string;
  meridiem?: "AM" | "PM";
}) {
  const hour12 = opts.hour12 && opts.hour12 !== "" ? opts.hour12 : "12";
  const minute = opts.minute && opts.minute !== "" ? opts.minute : "00";
  const meridiem = opts.meridiem ?? "AM";

  const base = Number(hour12) % 12; // 12 -> 0, 01–11 -> 1–11
  let h24 = base;

  if (meridiem === "PM") {
    h24 = base + 12; // 0 + 12 -> 12 PM, 1 + 12 -> 13, etc.
  }

  return `${String(h24).padStart(2, "0")}:${minute}`;
}

export function TimePicker12h({
  value,
  onChange,
  className,
}: TimePicker12hProps) {
  const { hour12, minute, meridiem } = React.useMemo(
    () => parse24To12(value),
    [value]
  );

  const emitChange = React.useCallback(
    (next: { hour12?: string; minute?: string; meridiem?: "AM" | "PM" }) => {
      const result = build24From12({
        hour12: next.hour12 ?? hour12,
        minute: next.minute ?? minute,
        meridiem: next.meridiem ?? meridiem,
      });
      onChange?.(result);
    },
    [onChange, hour12, minute, meridiem]
  );

  return (
    <div
      className={cn("flex items-center gap-2 bg-background py-1", className)}
    >
      {/* Hour */}
      <Select value={hour12} onValueChange={(h) => emitChange({ hour12: h })}>
        <SelectTrigger className="min-w-16 px-2 border-gray-300 shadow-sm justify-center">
          <SelectValue placeholder="HH" />
        </SelectTrigger>
        <SelectContent className="max-h-60 bg-white border-gray-200">
          {HOURS.map((h) => (
            <SelectItem key={h} value={h}>
              {h}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <span className="text-lg font-semibold">:</span>

      {/* Minute */}
      <Select value={minute} onValueChange={(m) => emitChange({ minute: m })}>
        <SelectTrigger className="min-w-16 px-2 border-gray-300 shadow-sm justify-center">
          <SelectValue placeholder="MM" />
        </SelectTrigger>
        <SelectContent className="max-h-60 bg-white border-gray-200">
          {MINUTES.map((m) => (
            <SelectItem key={m} value={m}>
              {m}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {/* AM / PM */}
      <Select
        value={meridiem}
        onValueChange={(v: "AM" | "PM") => emitChange({ meridiem: v })}
      >
        <SelectTrigger className="min-w-16 px-2 border-gray-300 shadow-sm justify-center">
          <SelectValue />
        </SelectTrigger>
        <SelectContent className="bg-white border-gray-200">
          <SelectItem value="AM">AM</SelectItem>
          <SelectItem value="PM">PM</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
