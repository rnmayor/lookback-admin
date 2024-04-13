import { capitalizeFirstLetter } from "@lib/utils";
import { usePathname } from "next/navigation";
import UserButton from "./user-button";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const pageTitle = capitalizeFirstLetter(pathname.slice(1));

  return (
    <div className="flex items-center justify-between w-full">
      <h1 className="text-2xl font-medium">Manage {pageTitle}</h1>
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;
