"use client";

import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "./navbar-routes";

const Navbar = () => {
  return (
    <div className="px-6 border-b h-full flex items-center shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
