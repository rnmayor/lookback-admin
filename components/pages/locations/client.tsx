"use client";

import { DataTable } from "@components/ui/data-table";
import { usePathname } from "next/navigation";
import { LocationColumn, columns } from "./columns";

interface LocationClientProps {
  data: LocationColumn[];
}

const LocationClient = ({ data }: LocationClientProps) => {
  const pathname = usePathname();
  const mainPage = pathname.split("/")[1];

  return <DataTable columns={columns} data={data} page={mainPage} />;
};

export default LocationClient;
