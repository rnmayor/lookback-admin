import { ColumnDef } from "@tanstack/react-table";

export type LocationColumn = {
  id: string;
  name: string;
  email: string;
};

export const columns: ColumnDef<LocationColumn>[] = [
  {
    id: "actions",
    cell: ({ row }) => <div></div>,
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "email",
    header: "Email",
  },
];
