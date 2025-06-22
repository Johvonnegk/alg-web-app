import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { useCreateGroup } from "../../../../hooks/groups/useCreateGroup"; // Adjust the import path as necessary
import toast from "react-hot-toast";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "The mininmum group name length is 4 characters" })
    .max(24, { message: "The maximum group name length is 24 characters" }),
  description: z
    .string()
    .max(500, { message: "Maximum description length is 500 characters." })
    .optional(),
});

const CreateGroup = () => {
  const [error, setError] = useState("");
  const { createGroup, loading } = useCreateGroup();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const handleNewGroup = async (values: z.infer<typeof formSchema>) => {
    setError(""); // Reset error state
    const result = await createGroup({
      name: values.name,
      description: values.description ?? "",
    });
    if (result.success) {
      toast.success("Successfully created group, reloading to see changes.");
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } else {
      console.error("Error creating group:", result.error);
      setError(
        `An nerror occurred while creating the group please try again: ${result.error}`
      );
    }
  };

  return (
    <>
      <>
        <Card className="w-full max-w-sm border-0">
          <CardHeader>
            <CardTitle className="text-lg">Create Group</CardTitle>
            <CardDescription>
              Enter your group name and a short description about what it means
              to be apart of this group!
            </CardDescription>
            <CardDescription className="text-stone-400">
              *Enter your account information below to login
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleNewGroup)}>
                <div className="flex flex-col gap-6">
                  <div className="grid gap-2">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">
                            Group Name
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="border border-stone-300"
                              placeholder="Group Name"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-sm text-red-500" />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="grid gap-2 ">
                    <FormField
                      control={form.control}
                      name="description"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel className="font-semibold">
                            Description
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="border border-stone-300"
                              placeholder="Max 500 characters"
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
                    Create Group
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex-col gap-2">
            {error ? <p className="text-sm text-red-500">{error}</p> : ""}
          </CardFooter>
        </Card>
      </>
    </>
  );
};

export default CreateGroup;
