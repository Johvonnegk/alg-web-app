import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSubmitGrowth } from "@/hooks/growth/useSubmitGrowth";
import toast from "react-hot-toast";

const courses = ["101", "201", "301", "401"];

const growthFormSchema = z.object({
  email: z
    .string()
    .email("Invalid email format")
    .transform((val) => val.trim().toLowerCase()),
  courses: z
    .array(
      z.object({
        course_name: z
          .string({ required_error: "Course is required" })
          .min(1, "Select a course"),
        status: z.enum(["passed", "incomplete", "failed"], {
          required_error: "Status is required",
        }),
      })
    )
    .min(1, "provide at least one course")
    .max(4, "You can only enter up to 4 courses")
    .superRefine((courses, ctx) => {
      const seen = new Set<string>();

      courses.forEach((course, index) => {
        if (seen.has(course.course_name)) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Duplicate course selected",
            path: [index, "course_name"],
          });
        }
        seen.add(course.course_name);
      });
    }),
});

type growthFormInput = z.infer<typeof growthFormSchema>;

const Growth = () => {
  const growthForm = useForm<growthFormInput>({
    resolver: zodResolver(growthFormSchema),
    defaultValues: {
      email: "",
      courses: [{ course_name: "", status: "incomplete" }],
    },
  });

  const { submit: submitGrowth, loading: growthLoading } = useSubmitGrowth();

  const { control, handleSubmit } = growthForm;

  const { fields, append, remove } = useFieldArray({
    control,
    name: "courses",
  });

  const onSubmit = async (data: growthFormInput) => {
    const result = await submitGrowth(data);
    if (result.success) {
      toast.success("Submitted growth tracks");
    } else {
      toast.error("An error occurred while submitting growth tracks");
    }
  };
  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full lg:w-1/2 px-2 md:px-4">
        <div>
          <h1 className="text-2xl mb-2 font-semibold">
            Record Growth Tracks Data
          </h1>
        </div>
        <Card className="w-full">
          <CardHeader>
            <CardDescription className="font-semibold text-gray-600">
              *Record growth tracks data here. You can update all courses at
              once by selecting add course*
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...growthForm}>
              <form onSubmit={handleSubmit(onSubmit)}>
                <div className="pb-2">
                  <FormField
                    key="email"
                    name="email"
                    control={growthForm.control}
                    render={({ field }) => (
                      <FormItem className="w-1/2">
                        <FormLabel>Email</FormLabel>
                        <FormMessage className="text-sm text-red-500" />
                        <FormControl>
                          <Input
                            className="border-stone-300"
                            placeholder="mail@example.com"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4"
                  >
                    {/* Course Field */}
                    <FormField
                      control={control}
                      name={`courses.${index}.course_name`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col justify-end min-h-[100px]">
                          <FormLabel>Course</FormLabel>
                          <FormMessage
                            className={
                              fieldState.invalid
                                ? "text-sm text-red-500 h-[20px]"
                                : "invisible text-sm h-[20px]"
                            }
                          >
                            {fieldState.error?.message ?? ""}
                          </FormMessage>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  fieldState.invalid ? "border-red-500" : ""
                                }
                              >
                                <SelectValue placeholder="Select course" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              {courses.map((course) => (
                                <SelectItem key={course} value={course}>
                                  {course}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />

                    {/* Status Field */}
                    <FormField
                      control={control}
                      name={`courses.${index}.status`}
                      render={({ field, fieldState }) => (
                        <FormItem className="flex flex-col justify-end min-h-[100px]">
                          <FormLabel>Status</FormLabel>
                          <FormMessage
                            className={
                              fieldState.invalid
                                ? "text-sm text-red-500 h-[20px]"
                                : "invisible text-sm h-[20px]"
                            }
                          >
                            {fieldState.error?.message ?? ""}
                          </FormMessage>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger
                                className={
                                  fieldState.invalid ? "border-red-500" : ""
                                }
                              >
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent className="bg-white">
                              <SelectItem value="passed">Passed</SelectItem>
                              <SelectItem value="incomplete">
                                Incomplete
                              </SelectItem>
                              <SelectItem value="failed">Failed</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                    {fields.length > 1 && (
                      <div className="flex items-end justify-start h-full">
                        <Button
                          type="button"
                          className="btn-danger ml-5"
                          onClick={() => remove(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
                <div className="mt-4">
                  {fields.length < 4 && (
                    <Button
                      type="button"
                      variant="outline"
                      className="hover:text-white"
                      onClick={() =>
                        append({ course_name: "", status: "incomplete" })
                      }
                    >
                      + Add Another Course
                    </Button>
                  )}
                  <Button type="submit" className="btn-primary ml-4">
                    Submit
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Growth;
