import * as z from "zod";

export const LoginSchema = z.object({
  email: z.string().min(1, { message: "Email is required" }).email(),
  password: z.string().min(1, { message: "Password is required" }),
});

export const UserSchema = z.object({
  email: z.string().email().min(1, {
    message: "Email is required",
  }),
  fname: z.string().min(1, {
    message: "First name is required",
  }),
  lname: z.string().min(1, {
    message: "Last name is required",
  }),
  regCode: z.string().min(1, {
    message: "Region is required",
  }),
  provCode: z.string().min(1, {
    message: "Province is required",
  }),
  citymunCode: z.string().min(1, {
    message: "City is required",
  }),
  brgyCode: z.string().min(1, {
    message: "Barangay is required",
  }),
  gender: z.string().min(1, {
    message: "Gender is required",
  }),
  dob: z.date().refine((date) => date !== undefined, {
    message: "Date of birth is required",
  }),
  covidStatus: z.boolean().optional(),
});

export const LocationSchema = z.object({
  email: z.string().email().min(1, {
    message: "Email is required",
  }),
  name: z.string().min(1, {
    message: "Name is required",
  }),
  regCode: z.string().min(1, {
    message: "Region is required",
  }),
  provCode: z.string().min(1, {
    message: "Province is required",
  }),
  citymunCode: z.string().min(1, {
    message: "City is required",
  }),
  brgyCode: z.string().min(1, {
    message: "Barangay is required",
  }),
});
