import { Avatar, AvatarFallback, AvatarImage } from "@components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@components/ui/dropdown-menu";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import LogoutButton from "./logout-button";

const UserButton = () => {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="border-none focus:outline-none">
        <Avatar>
          <AvatarImage src="" />
          <AvatarFallback className="bg-gradient-to-r from-orange-100 via-orange-300 to-orange-500">
            <FaUser />
          </AvatarFallback>
        </Avatar>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-80" align="end">
        <div className="flex space-x-2">
          <div className="px-2 py-2">
            <Avatar className="h-8 w-8">
              <AvatarImage src="" />
              <AvatarFallback className="bg-gradient-to-r from-orange-100 via-orange-300 to-orange-500">
                <FaUser />
              </AvatarFallback>
            </Avatar>
          </div>
          <div className="flex flex-col py-2">
            <p className="text-sm">Ronel Mayor</p>
            <p className="text-muted-foreground text-xs">
              ronelmayor0428@gmail.com
            </p>
          </div>
        </div>
        <LogoutButton>
          <DropdownMenuItem className="cursor-pointer">
            <FiLogOut className="h-4 w-4 mx-4" />
            Logout
          </DropdownMenuItem>
        </LogoutButton>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserButton;
