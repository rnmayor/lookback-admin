"use client";

import ConfirmModal from "@components/modals/confirm-modal";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Separator } from "@components/ui/separator";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { UserColumn } from "./columns";

interface CellActionProps {
  data: UserColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/users/${data.id}`);
      router.refresh();
      // TODO: toast success
      console.log("SUCCESS DELETE");
    } catch (error) {
      // TODO: toast error
      console.log("error", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <Separator />
          <DropdownMenuItem disabled={loading} className="px-0">
            <Button
              disabled={loading}
              variant="ghost"
              size="sm"
              onClick={() => router.push(`/users/${data.id}`)}
            >
              <Edit className="mr-2 h-4 w-4" /> Update
            </Button>
          </DropdownMenuItem>
          <DropdownMenuItem
            disabled={loading}
            className="px-0"
            onSelect={(e) => e.preventDefault()}
          >
            <ConfirmModal onConfirm={onDelete}>
              <Button disabled={loading} variant="ghost" size="sm">
                <Trash className="mr-2 h-4 w-4" /> Delete
              </Button>
            </ConfirmModal>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};

export default CellAction;
