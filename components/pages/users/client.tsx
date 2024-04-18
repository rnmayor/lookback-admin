"use client";

import { DataTable } from "@components/ui/data-table";
import { UserColumn, columns } from "./columns";

interface UsersClientProps {
  data: UserColumn[];
}

const UsersClient = ({ data }: UsersClientProps) => {
  return (
    <>
      <DataTable columns={columns} data={data} role="ADMIN" />
    </>
  );
};

export default UsersClient;
