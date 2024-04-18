"use client";

import { UserCovidStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type UserColumn = {
  id: string;
  name: string | null;
  email: string | null;
  regCode: string;
  provCode: string;
  citymunCode: string;
  brgyCode: string | null;
  gender: string | null;
  covidStatus?: UserCovidStatus["status"] | null;
};

export const columns: ColumnDef<UserColumn>[] = [
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />,
  },
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
