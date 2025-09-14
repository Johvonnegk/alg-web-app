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
  parse,
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
import { UseUpdateUserEmail } from "@/hooks/profile/useUpdateUserEmail";
import { Label } from "@/components/ui/label";
4;
import { UseUpdateIcon } from "@/hooks/profile/useUpdateIcon";
import ProfilePill from "./UserProfilePill";
import { UseUpdateUserProfile } from "@/hooks/profile/useUpdateUserProfile";

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
  const [preview, setPreview] = useState<string | null>(null);

  const { updateIcon } = UseUpdateIcon();
  const {
    updateUser: updateUserProfile,
    loading: loadingUpdateUser,
    error: updateUserErr,
  } = UseUpdateUserProfile();

  const parsed = parse(profile.birthday, "yyyy-MM-dd", new Date());
  const formattedBirthday = format(parsed, "MMMM d, yyyy");
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

  const imageFieldSchema = z
    .object({
      file: z
        .instanceof(File)
        .refine((file) => file.size <= 5 * 1024 * 1024, "Max file size is 5MB")
        .refine(
          (file) =>
            ["image/jpeg", "image/png", "image/webp"].includes(file.type),
          "Only .jpg, .png, .webp formats are supported"
        )
        .optional(),

      url: z.union([
        z.literal(""), // allow empty string
        z
          .string()
          .url("Must be a valid URL")
          .refine(
            (url) => /\.(jpg|jpeg|png|webp|gif)$/i.test(url),
            "URL must point to an image"
          ),
      ]),
    })
    .refine((data) => !(data.file && data.url && data.url !== ""), {
      message: "Provide either a file OR a URL, not both",
      path: ["url"],
    })
    .refine((data) => data.file || (data.url && data.url !== ""), {
      message: "Provide a file OR a URL",
      path: ["url"],
    });

  const imageFormSchema = z.object({
    image: imageFieldSchema,
  });

  const imageForm = useForm<z.infer<typeof imageFormSchema>>({
    resolver: zodResolver(imageFormSchema),
    defaultValues: {
      image: {
        file: undefined,
        url: "",
      },
    },
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
      birthday: new Date(formattedBirthday),
    },
  });

  const watchFname = profileForm.watch("fname");
  const watchLname = profileForm.watch("lname");
  const watchEmail = emailForm.watch("email");
  const watchImage = imageForm.watch("image");

  const liveProfile: UserProfile = {
    ...profile,
    fname: watchFname,
    lname: watchLname,
    email: watchEmail === "" ? profile.email : watchEmail,
    profile_icon:
      preview ||
      (typeof watchImage === "string" ? watchImage : profile.profile_icon),
  };

  const uploadImage = async (values: z.infer<typeof imageFormSchema>) => {
    const result = await updateIcon(values.image.url, values.image.file);
    if (result) {
      toast.success("Successfully updated profile icon");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else toast.error("Cold not upload image");
  };

  const { updateUser } = UseUpdateUserEmail();

  const updateEmailReq = async (values: z.infer<typeof emailFormSchema>) => {
    const result = await updateUser(values.email);
    if (result) {
      toast.success("Successfully sent request to update email");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      toast.error("Could not send email update request");
    }
  };
  const updateProfileReq = async (
    values: z.infer<typeof profileFormSchema>
  ) => {
    const { fname, lname, phone, address, birthday } = values;
    const userData = { fname, lname, phone, address, birthday };
    const result = await updateUserProfile(userData);
    if (result) {
      toast.success("Successfully updated user data");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      toast.error("Could not update user data");
    }
  };
  return (
    <Card className="border-stone-300 shadow-xl">
      <CardHeader>
        <CardTitle>
          {profile.fname} {profile.lname}'s Profile
        </CardTitle>
        <CardDescription>Overview:</CardDescription>
      </CardHeader>
      <CardContent>
        <CardDescription>User information</CardDescription>
        {editProfile ? (
          <div>
            <Form {...profileForm}>
              <form onSubmit={profileForm.handleSubmit(updateProfileReq)}>
                <div className="flex flex-col gap-6">
                  <div className="flex flex-col gap-6 2xl:grid 2xl:grid-cols-2 2xl:gap-2 2xl:items-stretch">
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
                          <FormLabel className="font-semibold">
                            Address
                          </FormLabel>
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
                  <Button type="submit" className="w-full border btn-primary">
                    Update Profile
                  </Button>
                </div>
              </form>
            </Form>
            <div className="mt-5 w-full flex flex-col items-center gap-3">
              <Label className="font-semibold">Profile Preview</Label>
              <ProfilePill profile={liveProfile} />
            </div>
            <Form {...imageForm}>
              <form
                className="w-full flex flex-col items-center gap-y-2"
                onSubmit={imageForm.handleSubmit(uploadImage)}
              >
                <FormField
                  control={imageForm.control}
                  name="image.file"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-semibold">
                        Upload image
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="border-stone-300 shadow-sm text-stone-500"
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              field.onChange(file);
                              imageForm.setValue("image.url", "");
                              setPreview(URL.createObjectURL(file));
                            }
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <span className="text-center text-stone-400">— OR —</span>

                <FormField
                  control={imageForm.control}
                  name="image.url"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel className="font-semibold">
                        Paste image URL
                      </FormLabel>
                      <FormControl>
                        <Input
                          className="w-full border-stone-300 shadow-sm"
                          type="url"
                          placeholder="https://example.com/image.jpg"
                          {...field} // ✅ updates image.url only
                          onChange={(e) => {
                            const url = e.target.value;
                            field.onChange(url);
                            imageForm.setValue("image.file", undefined); // clear file
                            setPreview(url);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" className="btn-primary">
                  Upload Image
                </Button>
              </form>
            </Form>
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
        ) : (
          <ul>
            <li key="email">Email: {profile.email}</li>
            <li key="phone">
              Phone Number: {formatPhoneNumber(profile.phone)}
            </li>
            <li key="address">Address: {profile.address}</li>
            <li key="birthday">Birthday: {formattedBirthday}</li>
            <li key="age">Age: {age}</li>
            <li key="join date">
              Joined: {memberSince} {timeUnit} ago
            </li>
          </ul>
        )}
      </CardContent>
      <CardFooter>
        {edit && (
          <div className="w-full flex flex-col gap-y-5 md:flex-row justify-around">
            {editProfile && (
              <Button
                onClick={() => setUpdateBtn(!updateBtn)}
                className={`hover:bg-accent hover:text-white sm:w-1/2 sm:self-center md:w-auto ${
                  updateBtn ? "btn-danger" : ""
                }`}
              >
                {updateBtn ? "Cancel Email Update" : "Update Email Address"}
              </Button>
            )}
            <Button
              onClick={() => setEditProfile(!editProfile)}
              className={`hover:bg-accent hover:text-white sm:w-1/2 sm:self-center md:w-auto ${
                editProfile ? "btn-danger" : ""
              }`}
            >
              {editProfile ? "Cancel Profile Update" : " Edit Profile"}
            </Button>
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default Profile;
