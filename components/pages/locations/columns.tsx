import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import { ColumnDef } from "@tanstack/react-table";
import CellAction from "./cell-action";

export type LocationColumn = {
  id: string;
  name: string;
  email: string;
  region: Region;
  province: Province;
  cityMunicipality: CityMunicipality;
  barangay: Barangay;
};

export const columns: ColumnDef<LocationColumn>[] = [
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
];
