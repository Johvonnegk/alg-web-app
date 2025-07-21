import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import toast from "react-hot-toast";
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
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const formSchema = z.object({
  email: z.string().email(),
});

const Recovery = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { session, recoverPassword } = useAuth();
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });
  const handleRecovery = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const result = await recoverPassword(values.email);
      if (result) {
        toast.success("Successfully sent recovery email");
        navigate("/recovery-confirmation");
      } else {
        toast.error("Failed to send recovery email");
      }
    } catch (error) {
      setError("An error occured");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen">
        <Card className="w-full max-w-sm border-0">
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
              *Enter the email address for the account you'd like to reset
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleRecovery)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">Email</FormLabel>
                          <FormControl>
                            <Input
                              className="border border-stone-300"
                              placeholder="Email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <Button
                    type="submit"
                    className="w-full border border-stone-300 hover:bg-accent hover:text-white"
                  >
                    Recover Password
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
