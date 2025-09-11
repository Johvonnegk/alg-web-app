import React from "react";
import { Label } from "@/components/ui/label";
import toast from "react-hot-toast";
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { useState } from "react";
import {
  gifts,
  GiftsFormInput,
  giftsFormSchema,
  ministries,
  MinistriesFormInput,
  ministriesFormSchema,
  discipleship,
  discipleshipFormSchema,
  DiscipleshipFormInput,
} from "./FormSchemas";
import { Gifts } from "@/types/Gifts";
import { Ministries } from "@/types/Ministries";
import { Discipleship } from "@/types/Discipleship";
import { giftsDescriptions, ministriesDesc } from "./GiftDescriptions";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useSubmitGifts } from "@/hooks/surveys/useSubmitGifts";
import { useSubmitMinistry } from "@/hooks/surveys/useSubmitMinistry";
import { useSubmitDiscipleship } from "@/hooks/surveys/useSubmitDiscipleship";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
const Surveys = () => {
  const [helperGifts, setHelperGifts] = useState(true);
  const [helperMins, setHelperMinistries] = useState(true);
  const [helperDiscipleship, setHelperDiscipleship] = useState(true);
  const [error, setError] = useState("");
  const { submit: uploadGifts, loading: giftsLoading } = useSubmitGifts();
  const { submit: uploadMinistries, loading: ministriesLoading } =
    useSubmitMinistry();
  const { submit: uploadDiscipleship, loading: discipleshipLoading } =
    useSubmitDiscipleship();

  const giftsForm = useForm<GiftsFormInput>({
    resolver: zodResolver(giftsFormSchema),
    defaultValues: {
      serving: "",
      administrator: "",
      encouragement: "",
      giving: "",
      mercy: "",
      teaching: "",
      prophecy: "",
      email: "",
    },
  });

  const ministriesForm = useForm<MinistriesFormInput>({
    resolver: zodResolver(ministriesFormSchema),
    defaultValues: {
      outreach: "",
      techArts: "",
      worship: "",
      smallGroups: "",
      youth: "",
      followUp: "",
      impressions: "",
      email: "",
    },
  });

  const discipleshipForm = useForm<DiscipleshipFormInput>({
    resolver: zodResolver(discipleshipFormSchema),
    defaultValues: { email: "" },
  });
  const submitGifts = async (values: Gifts) => {
    if (!helperGifts && values.email === "") {
      setError(
        "If you wish to enter for yourself please uncheck the box, otherwise please provide an email"
      );
      toast.error("Please provide an email");
      return;
    }
    const result = await uploadGifts(values);
    if (result.success) {
      toast.success("Successfully uploaded gifts");
      giftsForm.reset();
      return;
    } else if (result.error) {
      toast.error(result.error);
    }
  };
  const submitMinistries = async (values: Ministries) => {
    if (!helperMins && values.email === "") {
      setError(
        "If you wish to enter for yourself please uncheck the box, otherwise please provide an email"
      );
      toast.error("Please provide an email");
      return;
    }
    const result = await uploadMinistries(values);
    if (result.success) {
      toast.success("Successfully uploaded ministry data");
      ministriesForm.reset();
      return;
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  const submitDiscipleship = async (values: Discipleship) => {
    if (!helperDiscipleship && values.email === "") {
      toast.error("Please provide an email");
      return;
    }

    const result = await uploadDiscipleship(values);
    if (result.success) {
      toast.success("Successfully uploaded discipleship data");
      discipleshipForm.reset();
      return;
    } else if (result.error) {
      toast.error(result.error);
    }
  };

  return (
    <>
      <div className="px-4 xl:px-14">
        <h1 className="text-2xl mb-2 font-semibold border-stone-300">
          Spritual Surveys
        </h1>
        <hr className="mb-4 xl:mb-20 text-stone-300 w-7/8" />
        <div className="gifts-container gap-y-5 flex flex-col w-full lg:grid lg:grid-cols-2 lg:gap-20 lg:mb-20 ">
          <div className="flex flex-col gap-y-5 mb-5 lg:mb-auto lg:grid lg:grid-rows-2 lg:gap-y-2">
            <Form {...giftsForm}>
              <form onSubmit={giftsForm.handleSubmit(submitGifts)}>
                <Card className="border-accent shadow-lg w-full">
                  <CardHeader>
                    <CardTitle>Gifts</CardTitle>
                    <CardDescription>
                      Enter your score for your gifts
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-y-5 xl:grid xl:grid-cols-2 w-full xl:gap-x-5 xl:gap-y-3">
                    {(Object.keys(gifts) as Array<keyof typeof gifts>).map(
                      (key, index) => {
                        const isLast =
                          index === Object.keys(ministries).length - 1;
                        const isOdd = Object.keys(ministries).length % 2 !== 0;
                        return (
                          <FormField
                            key={key}
                            control={giftsForm.control}
                            name={gifts[key].name as keyof typeof gifts}
                            render={({ field }) => (
                              <FormItem
                                className={`${
                                  isLast && isOdd
                                    ? "col-span-2 w-full flex flex-col justify-center items-center"
                                    : ""
                                }`}
                              >
                                <FormLabel className="self-start lg:self-center">
                                  {gifts[key].display}
                                </FormLabel>
                                <FormMessage className="text-sm text-red-500" />
                                <FormControl>
                                  <div className="w-full flex justify-center">
                                    <Input
                                      className={`border-stone-300 w-full ${
                                        isLast && isOdd
                                          ? "xl:w-1/2 border-stone-300"
                                          : ""
                                      }`}
                                      placeholder={gifts[key].display}
                                      {...field}
                                    />
                                  </div>
                                </FormControl>
                              </FormItem>
                            )}
                          />
                        );
                      }
                    )}
                    <div className="flex flex-col items-center gap-y-2 col-span-2">
                      {!helperGifts ? (
                        <FormField
                          key="email"
                          name="email"
                          control={giftsForm.control}
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
                      ) : (
                        <div></div>
                      )}

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="helper"
                          onCheckedChange={() => {
                            setHelperGifts(!helperGifts);
                          }}
                        />
                        <Label htmlFor="helper">
                          I am entering for someone else
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-center">
                      <Button
                        type="submit"
                        className="btn-primary w-1/4 rounded-lg px-2 py-0.5"
                      >
                        Submit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Form>

            <Card className="gifts-description border-accent shadow-lg h-fit lg:place-self-center">
              <CardHeader>
                <CardTitle>
                  What is spritual growth and how might God be calling you to
                  help build His kingdom??
                </CardTitle>
                <CardDescription className="font-semibold text-stone-600">
                  Ministries and Gifts
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p key="Spiritual Growth Description">
                  Spiritual growth is the process of becoming more and more like
                  Jesus Christ. When we place our faith in Jesus, the Holy
                  Spirit begins the process of making us more like Him,
                  conforming us to His image.
                </p>
              </CardContent>
              <CardFooter>
                <a
                  className="font-semibold btn-primary px-2 py-1.5 rounded-lg"
                  href="https://app.agolix.com/assessment/9922"
                >
                  Assessment here
                </a>
              </CardFooter>
            </Card>
          </div>

          <div className="gifts-description mb-30 lg:mb-auto h-full flex items-start">
            <ul className="bg-accent text-white rounded-lg px-7 py-8 xl:px-10 shadow-2xl">
              {Object.entries(giftsDescriptions).map(([key, gift]) => (
                <li key={key} className="pb-5">
                  <h4 className="text-center font-semibold">{gift.name}</h4>
                  <span>{gift.desc}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="ministries-container flex flex-col gap-y-5 xl:grid xl:grid-rows-2 xl:gap-y-2">
            <Form {...ministriesForm}>
              <form onSubmit={ministriesForm.handleSubmit(submitMinistries)}>
                <Card className="border-accent shadow-lg">
                  <CardHeader>
                    <CardTitle>Ministries</CardTitle>
                    <CardDescription>
                      Enter your scores for the different ministries
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-y-5 lg:grid lg:grid-cols-2 w-full lg:gap-x-5 lg:gap-y-3">
                    {(
                      Object.keys(ministries) as Array<keyof typeof ministries>
                    ).map((key, index) => {
                      const isLast =
                        index === Object.keys(ministries).length - 1;
                      const isOdd = Object.keys(ministries).length % 2 !== 0;

                      return (
                        <FormField
                          key={key}
                          control={ministriesForm.control}
                          name={
                            ministries[key].name as keyof z.infer<
                              typeof ministriesFormSchema
                            >
                          }
                          render={({ field }) => (
                            <FormItem
                              className={`${
                                isLast && isOdd
                                  ? "col-span-2 w-full flex flex-col justify-center items-center"
                                  : ""
                              }`}
                            >
                              <FormLabel className="self-start lg:self-center">
                                {ministries[key].display}
                              </FormLabel>
                              <FormMessage className="text-sm text-red-500" />
                              <FormControl>
                                <div className="w-full flex justify-center">
                                  <Input
                                    value={field.value ?? ""}
                                    placeholder={ministries[key].display}
                                    onChange={(e) =>
                                      field.onChange(e.target.value)
                                    }
                                    className={`border-stone-300 ${
                                      isLast && isOdd
                                        ? "w-full xl:w-1/2 border-stone-300"
                                        : ""
                                    }`}
                                  />
                                </div>
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      );
                    })}
                    <div className="flex flex-col items-center gap-y-2 col-span-2">
                      {!helperMins ? (
                        <FormField
                          key="email"
                          name="email"
                          control={ministriesForm.control}
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
                      ) : (
                        <div></div>
                      )}

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="helper"
                          onCheckedChange={() => {
                            setHelperMinistries(!helperMins);
                          }}
                        />
                        <Label htmlFor="helper">
                          I am entering for someone else
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-center">
                      <Button
                        type="submit"
                        className="w-1/4 btn-primary rounded-lg px-2 py-0.5"
                      >
                        Submit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Form>
            <Card className="border-accent h-fit place-self-center shadow-lg">
              <CardHeader>
                <CardTitle className="text-lg">Discipleship Survey</CardTitle>
                <CardDescription className="font-semibold text-stone-600">
                  Discipleship
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p key="Kingdom Description">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Eligendi dignissimos facilis rerum accusamus earum. Labore ex
                  asperiores error laborum quo recusandae suscipit? Harum
                  quaerat rem ratione nemo modi natus alias!
                </p>
              </CardContent>
              <CardFooter>
                <a
                  className="font-semibold btn-primary px-2 py-1.5 rounded-lg"
                  href="https://app.agolix.com/assessment/9922"
                >
                  Assessment here
                </a>
              </CardFooter>
            </Card>
          </div>
          <div className="ministries-description">
            <ul className="bg-accent px-7 mb-30 text-white rounded-lg py-8 xl:px-10 lg:mb-auto shadow-2xl">
              {Object.entries(ministriesDesc).map(([key, ministry]) => (
                <li key={key} className="pb-5">
                  <h4 className="text-center font-semibold">{ministry.name}</h4>
                  <span>
                    <span className="font-semibold">Vision: </span>
                    {ministry.vision}
                  </span>
                  <ul>
                    <span className="font-semibold">Opportunites: </span>
                    {ministry.opportunities.map((item, index) => (
                      <li key={index} className="inline">
                        {index < ministry.opportunities.length - 1
                          ? `${item}, `
                          : item}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          </div>
          <div className="discipleship-form">
            <Form {...discipleshipForm}>
              <form
                onSubmit={discipleshipForm.handleSubmit(submitDiscipleship)}
              >
                <Card className="border-accent shadow-lg w-full">
                  <CardHeader>
                    <CardTitle>Discipleship</CardTitle>
                    <CardDescription>
                      Enter your level in discipleship
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="grid grid-cols-2 w-full gap-x-5 gap-y-3">
                    <FormField
                      control={discipleshipForm.control}
                      name="stage"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Discipleship Stage</FormLabel>
                          <FormControl>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select stage..." />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {Object.values(discipleship).map(
                                  ({ name, display }) => (
                                    <SelectItem
                                      className="focus:text-white"
                                      key={name}
                                      value={name}
                                    >
                                      {display}
                                    </SelectItem>
                                  )
                                )}
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    ></FormField>
                    <div className="flex flex-col items-center gap-y-2 col-span-2">
                      {!helperDiscipleship ? (
                        <FormField
                          key="email"
                          name="email"
                          control={discipleshipForm.control}
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
                      ) : (
                        <div></div>
                      )}

                      <div className="flex items-center gap-2">
                        <Checkbox
                          id="helper"
                          onCheckedChange={() => {
                            setHelperDiscipleship(!helperDiscipleship);
                          }}
                        />
                        <Label htmlFor="helper">
                          I am entering for someone else
                        </Label>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter>
                    <div className="w-full flex justify-center">
                      <Button
                        type="submit"
                        className="btn-primary w-1/4 rounded-lg px-2 py-0.5"
                      >
                        Submit
                      </Button>
                    </div>
                  </CardFooter>
                </Card>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Surveys;
