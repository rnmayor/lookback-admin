import { IconType } from "react-icons";

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

export type CityMun = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  citymunDesc: string;
};

export type Brgy = {
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string;
  brgyDesc: string;
};
