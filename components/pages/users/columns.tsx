"use client";

import { UserCovidStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";

export type UserColumn = {
  name: string | null;
  email: string | null;
  regCode: number;
  provCode: number;
  citymunCode: number;
  brgyCode: number | null;
  gender: string | null;
  covidStatus?: UserCovidStatus["status"] | null;
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "regCode",
    header: "Region",
  },
  {
    accessorKey: "provCode",
    header: "Province",
  },
  {
    accessorKey: "citymunCode",
    header: "City",
  },
  {
    accessorKey: "brgyCode",
    header: "Barangay",
  },
  {
    accessorKey: "gender",
    header: "Gender",
  },
  {
    accessorKey: "covidStatus",
    header: "Covid Status",
  },
];
