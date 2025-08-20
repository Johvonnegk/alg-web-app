import React from "react";
import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  differenceInDays,
  differenceInMonths,
  differenceInHours,
  differenceInYears,
  format,
} from "date-fns";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import toast from "react-hot-toast";
import { UserProfile } from "@/types/UserProfile";
import { Button } from "@/components/ui/button";
import { UseUpdateUser } from "@/hooks/useUpdateUser";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";

function formatPhoneNumber(phone: string) {
  const cleaned = ("" + phone).replace(/\D/g, "");

  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);

  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }

  return phone;
}

interface ProfileProps {
  profile: UserProfile;
  edit: boolean;
}

const Profile: React.FC<ProfileProps> = ({ profile, edit }) => {
  const [updateBtn, setUpdateBtn] = useState<boolean>(false);
  const [editProfile, setEditProfile] = useState<boolean>(false);
  const formattedBirthDay = format(new Date(profile.birthday), "yyyy-MM-dd");
  const age = differenceInYears(new Date(), new Date(profile.birthday));
  const now = new Date();
  const createdAt = new Date(profile.created_at);
  let timeUnit;
  let memberSince = differenceInYears(new Date(), new Date(profile.created_at));
  timeUnit = "year";
  if ((memberSince = differenceInYears(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "year" : "years";
  } else if ((memberSince = differenceInMonths(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "month" : "months";
  } else if ((memberSince = differenceInDays(now, createdAt)) >= 1) {
    timeUnit = memberSince === 1 ? "day" : "days";
  } else {
    memberSince = differenceInHours(now, createdAt);
    timeUnit = memberSince === 1 ? "hour" : "hours";
  }

  const profileFormSchema = z.object({
    fname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." })
      .max(50, { message: "First name max of 50 characters." })
      .transform((val) => val.trim()),
    lname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." })
      .max(50, { message: "First name max of 50 characters." })
      .transform((val) => val.trim()),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .regex(/^[+0-9\s\-()]+$/, "Invalid phone number format"),
    address: z.string().max(100),
    birthday: z.date(),
  });

  const emailFormSchema = z.object({
    email: z
      .string()
      .email()
      .transform((val) => val.trim().toLowerCase()),
  });

  type emailFormInput = z.input<typeof emailFormSchema>;
  const emailForm = useForm<emailFormInput>({
    resolver: zodResolver(emailFormSchema),
    defaultValues: {
      email: "",
    },
  });
  type profileFormInput = z.input<typeof profileFormSchema>;
  const profileForm = useForm<profileFormInput>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      fname: profile.fname,
      lname: profile.lname,
      phone: profile.phone,
      address: profile.address,
      birthday: new Date(profile.birthday),
    },
  });
  const { updateUser, loading, error } = UseUpdateUser();

  const updateEmailReq = async (values: z.infer<typeof emailFormSchema>) => {
    const result = await updateUser(values.email);
    if (result) {
      toast.success("Successfully sent request to update email");
    } else {
      toast.error("Could not send email update request");
    }
  };
  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {profile.fname} {profile.lname}'s Profile
        </CardTitle>
        <CardDescription>Overview:</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>User information</CardDescription>
        {editProfile ? (
          <Form {...profileForm}>
            <form action="">
              <div className="flex flex-col gap-6">
                <div className="grid grid-cols-2 gap-2 items-stretch">
                  <FormField
                    control={profileForm.control}
                    name="fname"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          First Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border border-stone-300"
                            placeholder="First Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={profileForm.control}
                    name="lname"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel className="font-semibold">
                          Last Name
                        </FormLabel>
                        <FormControl>
                          <Input
                            className="border border-stone-300"
                            placeholder="Last Name"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={profileForm.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Phone</FormLabel>
                        <FormControl>
                          <Input
                            className="border border-stone-300"
                            placeholder="Phone Number"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={profileForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-semibold">Address</FormLabel>
                        <FormControl>
                          <Input
                            className="border border-stone-300"
                            placeholder="Address"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="grid gap-2">
                  <FormField
                    control={profileForm.control}
                    name="birthday"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel className="font-semibold">
                          Date of birth
                        </FormLabel>
                        <Popover>
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
                          Your date of birth is used to calculate your age.
                        </FormDescription>
                        <FormMessage className="text-sm text-red-500" />
                      </FormItem>
                    )}
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full border border-stone-300 hover:bg-accent hover:text-white"
                >
                  Update Profile
                </Button>
                {updateBtn && (
                  <div className="col-span-2">
                    <Form {...emailForm}>
                      <form onSubmit={emailForm.handleSubmit(updateEmailReq)}>
                        <div className="w-full flex items-end gap-5">
                          <FormField
                            name="email"
                            control={emailForm.control}
                            render={({ field }) => (
                              <FormItem className="w-2/3">
                                <FormLabel className="font-semibold">
                                  Email Address
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    type="email"
                                    className="w-full border border-stone-300"
                                    placeholder="New email address"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage className="text-sm text-red-500" />
                              </FormItem>
                            )}
                          />
                          <Button
                            type="submit"
                            className="hover:text-white hover:bg-accent"
                          >
                            Change Email
                          </Button>
                        </div>
                      </form>
                    </Form>
                  </div>
                )}
              </div>
            </form>
          </Form>
        ) : (
          <ul>
            <li key="email">Email: {profile.email}</li>
            <li key="phone">
              Phone Number: {formatPhoneNumber(profile.phone)}
            </li>
            <li key="address">Address: {profile.address}</li>
            <li key="birthday">Birthday: {formattedBirthDay}</li>
            <li key="age">Age: {age}</li>
            <li key="join date">
              Joined: {memberSince} {timeUnit} ago
            </li>
          </ul>
        )}
      </CardContent>
      <CardFooter>
        {edit && (
          <div className="w-full flex justify-around">
            <Button
              onClick={() => setEditProfile(!editProfile)}
              className={`hover:bg-accent hover:text-white ${
                editProfile ? "text-white bg-red-500" : ""
              }`}
            >
              {editProfile ? "Cancel Profile Update" : " Edit Profile"}
            </Button>
            {editProfile && (
              <Button
                onClick={() => setUpdateBtn(!updateBtn)}
                className={`hover:bg-accent hover:text-white ${
                  updateBtn ? "text-white bg-red-500" : ""
                }`}
              >
                {updateBtn ? "Cancel Email Update" : "Update Email Address"}
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Profile;
