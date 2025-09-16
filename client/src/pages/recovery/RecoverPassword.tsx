import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
import zxcvbn from "zxcvbn";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useUserProfile } from "@/hooks/profile/useUserProfile";
import { IoEye, IoEyeOff } from "react-icons/io5";
const Recovery = () => {
  const [showPass, setShowPass] = useState(false);
  const [showPassC, setShowPassC] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { updatePassword } = useAuth();
  const navigate = useNavigate();
  const {
    profile,
    loading: profileLoading,
    error: profileErr,
  } = useUserProfile();

  const formSchema = z
    .object({
      password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/\d.*\d/, "Password must contain at least 2 digits")
        .regex(
          /[!#$&?]/,
          "Password must contain at least one special character (!, #, $, &, ?)"
        )
        .max(50, { message: "Maximum password length is 50 characters." }),
      confirmPassword: z
        .string()
        .min(8, { message: "Password must be at least 8 characters." })
        .max(50, { message: "Maximum password length is 50 characters." }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "passwords do not match",
      path: ["confirmPassword"],
    })
    .superRefine(async (data, ctx) => {
      const { password } = data;

      // Run zxcvbn check
      const result = zxcvbn(password);

      // Require "score >= 3" (0–4 scale)
      if (result.score < 3) {
        ctx.addIssue({
          code: "custom",
          message:
            "Password is too weak: " + result.feedback.suggestions.join(" "),
          path: ["password"],
        });
      }

      // Disallow personal info
      if (profile) {
        const { fname, lname, email } = profile;
        const disallowed = [
          fname,
          lname,
          email,
          fname.toLowerCase(),
          lname.toLowerCase(),
          email.toLowerCase(),
          email.split("@")[0],
        ].filter(Boolean);

        for (const bad of disallowed) {
          if (bad && password.toLowerCase().includes(bad.toLowerCase())) {
            ctx.addIssue({
              code: "custom",
              message: "Password cannot contain your personal information",
              path: ["password"],
            });
            break;
          }
        }
      }
    });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });
  const handleRecovery = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await updatePassword(values.password);
      if (result) {
        toast.success("Successfully updated password");
        navigate("/login");
      } else {
        toast.error("Failed to update password");
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen px-4 lg:px-auto pt-21">
        <Card className="bg-white shadow-xl w-full max-w-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">Recover your password</CardTitle>
            <CardDescription>
              Don't have an account?{" "}
              <Link
                className="text-accent font-semibold underline"
                to="/signup"
              >
                Sign-up here
              </Link>
            </CardDescription>
            <CardDescription className="text-stone-400">
              *Enter your new password
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRecovery)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="font-semibold">
                            Password
                          </FormLabel>
                          <FormDescription>
                            <ul className="font-semibold text-xs text-stone-500">
                              <li>*Password must be 8 characters long*</li>
                              <li>
                                *Must include at least one of these special
                                characters'!#$&?'*
                              </li>
                              <li>*Must have 2 digits*</li>
                            </ul>
                          </FormDescription>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPass ? "text" : "password"}
                                className="border border-stone-300"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-stone-500 hover:text-stone-700 hover:bg-transparent"
                              type="button"
                              onClick={() => setShowPass((prev) => !prev)}
                            >
                              {showPass ? <IoEyeOff /> : <IoEye />}
                            </Button>
                          </div>

                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">
                            Confrim Password
                          </FormLabel>
                          <FormDescription className="font-semibold text-xs text-stone-500">
                            *Confirmed password must match your password above*
                          </FormDescription>
                          <div className="relative">
                            <FormControl>
                              <Input
                                type={showPassC ? "text" : "password"}
                                className="border border-stone-300"
                                placeholder="Password"
                                {...field}
                              />
                            </FormControl>
                            <Button
                              className="absolute right-0 top-1/2 -translate-y-1/2 bg-transparent text-stone-500 hover:text-stone-700 hover:bg-transparent"
                              type="button"
                              onClick={() => setShowPassC((prev) => !prev)}
                            >
                              {showPassC ? <IoEyeOff /> : <IoEye />}
                            </Button>
                          </div>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full border border-stone-300 hover:bg-accent hover:text-white"
                  >
                    Change Password
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

export default Recovery;
