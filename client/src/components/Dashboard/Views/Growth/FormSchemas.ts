import { z } from "zod";
const REQUIRED_MSG = "Required";
const RANGE_MSG_0_5 = "Must be between 0 and 5";
const RANGE_MSG_0_20 = "Must be between 0 and 20";

export const giftsFormSchema = z.object({
  serving: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  administrator: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  encouragement: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  giving: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  mercy: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  teaching: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),

  prophecy: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 20, { message: RANGE_MSG_0_20 }),
  email: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        val === "" ||
        z.string().email().safeParse(val).success,
      {
        message: "Invalid email",
      }
    ),
});
export type GiftsFormInput = z.input<typeof giftsFormSchema>;
export const ministriesFormSchema = z.object({
  outreach: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  techArts: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  worship: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  smallGroups: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  youth: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  followUp: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),

  impressions: z
    .string()
    .refine((val) => val.trim() !== "", { message: REQUIRED_MSG })
    .transform((val) => Number(val))
    .refine((val) => val >= 0 && val <= 5, { message: RANGE_MSG_0_5 }),
  email: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        val === null ||
        val === undefined ||
        val === "" ||
        z.string().email().safeParse(val).success,
      {
        message: "Invalid email",
      }
    ),
});
export type MinistriesFormInput = z.input<typeof ministriesFormSchema>;

export const gifts = {
  serving: { display: "Serving", name: "serving" },
  administrator: { display: "Administrator", name: "administrator" },
  encouragement: { display: "Encouragement", name: "encouragement" },
  giving: { display: "Giving", name: "giving" },
  mercy: { display: "Mercy", name: "mercy" },
  teaching: { display: "Teaching", name: "teaching" },
  prophecy: { display: "Prophecy", name: "prophecy" },
};

export const ministries = {
  outreach: { display: "Outreach", name: "outreach" },
  techArts: { display: "Tech Arts", name: "techArts" },
  worship: { display: "Worship", name: "worship" },
  smallGroups: { display: "Small Groups", name: "smallGroups" },
  youth: { display: "Children & Youth", name: "youth" },
  followUp: { display: "Follow-Ups", name: "followUp" },
  impressions: { display: "First Impressions", name: "impressions" },
};
