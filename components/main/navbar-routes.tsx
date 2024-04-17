import { capitalizeFirstLetter } from "@lib/utils";
import { usePathname } from "next/navigation";
import Heading from "./heading";
import UserButton from "./user-button";

const NavbarRoutes = () => {
  const pathname = usePathname();
  const pageTitle = capitalizeFirstLetter(pathname.slice(1));

  return (
    <div className="flex items-center justify-between w-full">
      <Heading title={`Manage ${pageTitle}`} description="" />
      <UserButton />
    </div>
  );
};

export default NavbarRoutes;
