"use client";

import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import { UserCovidStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type UserColumn = {
  id: string;
  name: string | null;
  email: string | null;
  region: Region;
  province: Province;
  cityMunicipality: CityMunicipality;
  barangay: Barangay;
  age: number;
  covidStatus: UserCovidStatus["status"];
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
    accessorKey: "region.regDesc",
    header: "Region",
  },
  {
    accessorKey: "province.provDesc",
    header: "Province",
  },
  {
    accessorKey: "cityMunicipality.citymunDesc",
    header: "City/Municipality",
  },
  {
    accessorKey: "barangay.brgyDesc",
    header: "Barangay",
  },
  {
    accessorKey: "age",
    header: "Age",
  },
  {
    accessorKey: "covidStatus",
    header: "Covid Status",
  },
];
