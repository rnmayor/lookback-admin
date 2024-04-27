"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@components/ui/alert-dialog";
import { Button } from "@components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { Separator } from "@components/ui/separator";
import { useCurrentRole } from "@lib/hooks/client-auth";
import { UserRole } from "@lib/utils/types";
import axios from "axios";
import { Edit, MoreHorizontal, Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import toast from "react-hot-toast";
import { LocationColumn } from "./columns";

interface CellActionProps {
  data: LocationColumn;
}

const CellAction = ({ data }: CellActionProps) => {
  const role = useCurrentRole();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/locations/${data.id}`);
      toast.success("Location successfully deleted.");

      router.refresh();
    } catch (error) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertDialog>
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
                onClick={() => router.push(`/locations/${data.id}`)}
              >
                <Edit className="mr-2 h-4 w-4" /> Update
              </Button>
            </DropdownMenuItem>
            {role === UserRole.SUPER_ADMIN && (
              <DropdownMenuItem disabled={loading} className="px-0">
                <AlertDialogTrigger asChild>
                  <Button disabled={loading} variant="ghost" size="sm">
                    <Trash className="mr-2 h-4 w-4" /> Delete
                  </Button>
                </AlertDialogTrigger>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction
                onClick={onDelete}
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              >
                Continue
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </DropdownMenu>
      </AlertDialog>
    </>
  );
};

export default CellAction;
