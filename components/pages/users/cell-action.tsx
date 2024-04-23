"use client";

import { Button } from "@components/ui/button";
import { Edit } from "lucide-react";
import { useRouter } from "next/navigation";
import { UserColumn } from "./columns";

interface CellActionProps {
  data: UserColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();

  return (
    <Button
      title="Update"
      variant="ghost"
      className="h-8 w-8 p-0"
      onClick={() => router.push(`/users/${data.id}`)}
    >
      <span className="sr-only">Update user</span>
      <Edit className="h-4 w-4" />
    </Button>
  );
};

export default CellAction;
