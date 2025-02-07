"use client";

import { DataTable } from "@components/ui/data-table";
import { usePathname } from "next/navigation";
import { UserColumn, columns } from "./columns";

interface UsersClientProps {
  data: UserColumn[];
}

const UsersClient = ({ data }: UsersClientProps) => {
  const pathname = usePathname();
  const mainPage = pathname.split("/")[1];

  return <DataTable columns={columns} data={data} page={mainPage} />;
};

export default UsersClient;
