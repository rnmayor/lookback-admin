import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const UserSchema = z.object({
  fname: z.string().min(1),
  lname: z.string().min(1),
  regCode: z.string().min(1),
  provCode: z.string().min(1),
  citymunCode: z.string().min(1),
  brgyCode: z.string().min(1),
  gender: z.string().min(1),
  covidStatus: z.string().optional().nullable(),
});
