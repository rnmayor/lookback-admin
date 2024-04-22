"use client";

import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import { UserCovidStatus } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type UserColumn = {
  id: string;
  name: string | null;
  email: string | null;
  // regCode: string;
  region: Region;
  // provCode: string;
  province: Province;
  // citymunCode: string;
  cityMunicipality: CityMunicipality;
  // brgyCode: string;
  barangay: Barangay;
  age: number;
  covidStatus?: UserCovidStatus["status"];
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
    accessorKey: "region",
    header: "Region",
    cell: ({ row }) => {
      const region = row.original.region;
      return <div>{region.regDesc}</div>;
    },
  },
  {
    accessorKey: "province",
    header: "Province",
    cell: ({ row }) => {
      const province = row.original.province;
      return <div>{province.provDesc}</div>;
    },
  },
  {
    accessorKey: "cityMunicipality",
    header: "City/Municipality",
    cell: ({ row }) => {
      const cityMunicipality = row.original.cityMunicipality;
      return <div>{cityMunicipality.citymunDesc}</div>;
    },
  },
  // {
  //   accessorKey: "citymunCode",
  //   header: "City",
  // },
  // {
  //   accessorKey: "brgyCode",
  //   header: "Barangay",
  // },
  {
    accessorKey: "barangay",
    header: "Barangay",
    cell: ({ row }) => {
      const barangay = row.original.barangay;
      return <div>{barangay.brgyDesc}</div>;
    },
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
