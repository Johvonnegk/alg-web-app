"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

const formSchema = z
  .object({
    fname: z
      .string()
      .min(2, { message: "First name must be at least 2 characters." })
      .max(50, { message: "First name max of 50 characters." }),
    lname: z
      .string()
      .min(2, { message: "Last name must be at least 2 characters." })
      .max(50, { message: "First name max of 50 characters." }),
    email: z.string().email(),
    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(50, { message: "Maximum password length is 50 characters." }),
    confirmPassword: z
      .string()
      .min(8, { message: "Password must be at least 8 characters." })
      .max(50, { message: "Maximum password length is 50 characters." }),
    phone: z
      .string()
      .min(10, "Phone number is too short")
      .max(15, "Phone number is too long")
      .regex(/^[+0-9\s\-()]+$/, "Invalid phone number format"),
    address: z.string().max(100),
    birthday: z.date(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "passwords do not match",
    path: ["confirmPassword"],
  });

const Register = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, signUpNewUser } = useAuth();

  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fname: "",
      lname: "",
      email: "",
      password: "",
      address: "",
      phone: undefined,
      birthday: new Date(),
    },
  });

  const handleSignUp = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    const signupInfo = values;
    try {
      const result = await signUpNewUser(signupInfo);
      if (result.success) {
        navigate("/signup/email-confirmation");
        toast.success("Successfully registered");
      } else {
        const code = result?.error?.code || result?.error;
        switch (code) {
          case "user_already_exists":
            setError(
              "This email is already registered with an account,\nplease choose another email address."
            );
            break;
          default:
            setError("Something went wrong. Please try again later.");
            break;
        }
        toast.error("Registration failed");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">Make your account</CardTitle>
            <CardDescription>
              Already have an account?{" "}
              <Link className="text-accent font-semibold underline" to="/login">
                Login here
              </Link>
            </CardDescription>
            <CardDescription className="text-stone-400">
              *Enter your account information below to register
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSignUp)}>
                <div className="flex flex-col gap-6">
                  <div className="grid grid-cols-2 gap-2 items-stretch">
                    <FormField
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="border border-stone-300"
                              placeholder="mail@example.com"
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
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="border border-stone-300"
                              placeholder="Password"
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
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <Input
                              type="password"
                              className="border border-stone-300"
                              placeholder="Confirm Password"
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
                      control={form.control}
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
                      control={form.control}
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
                      control={form.control}
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
                    Sign Up
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {error ? <p className="text-sm text-red-500">{error}</p> : ""}
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default Register;
