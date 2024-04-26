import { IconType } from "react-icons";

export type SortOrder = "asc" | "desc";

export enum UserRole {
  SUPER_ADMIN = "SUPER_ADMIN",
  ADMIN = "ADMIN",
  USER = "USER",
}

export enum Gender {
  FEMALE = "FEMALE",
  MALE = "MALE",
}

export enum CovidStatus {
  POSITIVE = "POSITIVE",
  NEGATIVE = "NEGATIVE",
}

export interface AdminRoute {
  icon: IconType;
  label: string;
  href: string;
}

export interface Region {
  regCode: string;
  regDesc: string;
}

export type Province = {
  regCode: string;
  provCode: string;
  provDesc: string;
};

export type CityMunicipality = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  citymunDesc: string;
};

export type Barangay = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string;
  brgyDesc: string;
};
