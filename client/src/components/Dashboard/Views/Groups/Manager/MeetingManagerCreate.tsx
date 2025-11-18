import React from "react";
import { useState } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { record, z } from "zod";
import { TimePicker12h } from "@/components/TimePicker12h/TimePicker12h";
import { zodResolver } from "@hookform/resolvers/zod";
import { GroupMember, Attendee } from "@/types/Group";
import { Button } from "@/components/ui/button";
import { FaPlusCircle } from "react-icons/fa";
import { useForm } from "react-hook-form";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useRecordMeeting } from "@/hooks/groups/useRecordMeeting";
import toast from "react-hot-toast";

interface MeetingManagerProps {
  group: GroupMember[];
}

const attendance = ["present", "absent", "late", "excused"];
const attendanceStatusZ = z.enum(["present", "absent", "late", "excused"]);
const attendanceZ = z.object({
  user_id: z.string(),
  email: z.string().email("invalid email"),
  attendance: attendanceStatusZ,
});
type AttendanceStatus = z.infer<typeof attendanceStatusZ>;
export const meetingBaseSchema = z.object({
  date: z.date(),
  time: z
    .string()
    .regex(/^([01]\d|2[0-3]):([0-5]\d)$/, "Invalid time format (HH:mm)"),
  title: z.string().max(50),
  notes: z.string().max(500).optional(),
  location: z.string().optional(),
  attendances: z.array(attendanceZ),
});
export type MeetingFormValues = z.infer<typeof meetingBaseSchema>;
const makeMeetingSchema = (len: number) =>
  meetingBaseSchema.extend({
    attendances: meetingBaseSchema.shape.attendances.length(len, {
      message: `Expecting ${len} group members`,
    }),
  });

const MeetingManager = ({ group }: MeetingManagerProps) => {
  const [value, setValue] = useState("");
  const [recordMeeting, setRecordMeeting] = useState(false);
  const [calenOpen, setCalenOpen] = useState(false);
  const { recordMeeting: record, loading } = useRecordMeeting();
  function toAttendeesFromGroupMembers(group: GroupMember[]): Attendee[] {
    const rows = group.map((g): Attendee => {
      const { fname, lname, email, user_id } = g.users;
      return {
        id: user_id ?? "",
        email: email ?? "",
        fname: fname,
        lname: lname,
        defaultAttendance: "present",
      };
    });
    return rows;
  }
  const attendees = React.useMemo(
    () => toAttendeesFromGroupMembers(group),
    group
  );
  const meetingFormSchema = React.useMemo(
    () => makeMeetingSchema(attendees.length),
    [attendees.length]
  );
  const getDefaultValues = () => ({
    date: undefined,
    time: format(new Date(), "HH:mm"),
    location: "",
    title: "",
    notes: "",
    attendances: attendees.map((a) => ({
      user_id: a.id,
      email: a.email,
      attendance: (a.defaultAttendance ?? "present") as AttendanceStatus,
    })),
  });
  const meetingForm = useForm<MeetingFormValues>({
    resolver: zodResolver(meetingFormSchema),
    defaultValues: getDefaultValues(),
    mode: "onSubmit",
  });
  const markAll = (val: AttendanceStatus) => {
    attendees.forEach((_, idx) => {
      meetingForm.setValue(`attendances.${idx}.attendance`, val, {
        shouldDirty: true,
        shouldTouch: true,
      });
    });
  };
  const submitMeeting = async (values: z.infer<typeof meetingFormSchema>) => {
    const result = await record(values, group[0].groups.id || 0);
    if (result.success) {
      toast.success("Recorded meeting");
      meetingForm.reset({
        date: undefined,
        time: "",
        location: "",
        title: "",
        notes: "",
        attendances: attendees.map((a) => ({
          user_id: a.id,
          email: a.email,
          attendance: "present",
        })),
      });
    }
  };

  return (
    <div>
      <Card className="border-stone-300">
        <CardHeader>
          <CardTitle>Meeting Manager</CardTitle>
          <CardDescription className="font-semibold text-stone-500">
            Record your meeting details here.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-y-5">
          <Button
            onClick={() => setRecordMeeting(!recordMeeting)}
            className="w-full bg-transparent border-1 border-stone-300 shadow-sm"
          >
            <div>Record New Meeting</div>
            <FaPlusCircle className="text-green-600" />
          </Button>
          <Card
            className={`${
              recordMeeting ? "flex" : "hidden"
            } w-full py-5 justify-center gap-x-2 border-2 border-stone-300`}
          >
            <Form {...meetingForm}>
              <form
                className="w-full"
                onSubmit={meetingForm.handleSubmit(submitMeeting)}
              >
                <CardContent>
                  <div className="flex flex-col gap-y-5 mb-5">
                    <FormField
                      control={meetingForm.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col w-full">
                          <FormLabel
                            htmlFor="date"
                            className="font-semibold gap-x-0.5"
                          >
                            <span className="font-bold text-red-500 p-0 m-0">
                              *
                            </span>
                            Meeting date
                          </FormLabel>
                          <Popover open={calenOpen} onOpenChange={setCalenOpen}>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  className={cn(
                                    "pl-3 text-left font-normal w-full border border-stone-300",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>Pick a date</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-full p-0 bg-stone-200 border-stone-300 border shadow-lg"
                              align="center"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                captionLayout="dropdown"
                              />
                            </PopoverContent>
                          </Popover>
                          <FormDescription>
                            Please enter the date the meeting took place
                          </FormDescription>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={meetingForm.control}
                      name="time"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="time"
                            className="font-semibold flex flex-col items-start"
                          >
                            <span>Meeting Time</span>
                            <span className="text-xs text-stone-500">
                              *Hours:Minutes*
                            </span>
                          </FormLabel>
                          <FormControl>
                            <TimePicker12h
                              value={field.value}
                              onChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={meetingForm.control}
                      name="location"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="location"
                            className="font-semibold"
                          >
                            Location
                          </FormLabel>
                          <FormMessage className="text-sm text-red-500" />
                          <FormControl>
                            <Input
                              placeholder="Location"
                              className="border-stone-300"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={meetingForm.control}
                      name="title"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel
                            htmlFor="title"
                            className="font-semibold gap-x-0.5"
                          >
                            <span className="font-bold text-red-500 p-0 m-0">
                              *
                            </span>
                            Meeting Title
                          </FormLabel>
                          <FormMessage className="text-sm text-red-500" />
                          <FormControl>
                            <Input
                              placeholder="Title"
                              className="border-stone-300"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={meetingForm.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel htmlFor="notes" className="font-semibold">
                            Meeting Notes
                          </FormLabel>
                          <FormMessage className="text-sm text-red-500" />
                          <FormControl>
                            <Textarea
                              className="border-stone-300"
                              placeholder="Notes"
                              {...field}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex flex-col">
                    <label className="font-semibold" htmlFor="attendance">
                      Attendance
                    </label>
                    <hr className="border-1 text-stone-200 w-9/10 self-center mb-2" />
                    <Label
                      htmlFor="markAllAs"
                      className="font-semibold text-xs"
                    >
                      Mark all as
                    </Label>
                    <Select
                      value={value}
                      onValueChange={(v: AttendanceStatus) => {
                        setValue(v);
                        markAll(v);
                      }}
                    >
                      <SelectTrigger
                        className={`border-gray-300 ${
                          value ? "text-black" : "text-stone-500"
                        }`}
                        id="markAllAs"
                      >
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent className="bg-white border-gray-300">
                        {attendance.map((a) => (
                          <SelectItem key={a} value={a}>
                            {a.charAt(0).toUpperCase() + a.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <h3 className="mt-2 mb-1 text-stone-500">
                      Your group members
                    </h3>
                    {attendees.map((a, idx) => (
                      <div
                        key={a.id ?? idx}
                        id="attendance"
                        className="flex flex-col mb-3"
                      >
                        <FormField
                          control={meetingForm.control}
                          name={`attendances.${idx}.attendance` as any}
                          render={({ field, fieldState }) => (
                            <FormItem className="flex items-center justify-between">
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <div className="flex flex-col w-full">
                                  <span>
                                    {a.fname} {a.lname}
                                  </span>
                                  <FormDescription className="font-semibold text-xs text-stone-600">
                                    {a.email}
                                  </FormDescription>
                                </div>
                                <FormControl>
                                  <SelectTrigger
                                    className={`
                                      border-gray-300 ${
                                        fieldState.invalid
                                          ? "border-red-500"
                                          : ""
                                      }
                                    `}
                                  >
                                    <SelectValue placeholder="Select course" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent className="bg-white border-gray-300">
                                  {attendance.map((a) => (
                                    <SelectItem key={a} value={a}>
                                      {a.charAt(0).toUpperCase() + a.slice(1)}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </FormItem>
                          )}
                        />
                        <hr className="border-1 text-stone-200 w-9/10 self-center mt-1" />
                      </div>
                    ))}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit">Submit</Button>
                </CardFooter>
              </form>
            </Form>
          </Card>
        </CardContent>
      </Card>
    </div>
  );
};

export default MeetingManager;
