"use client";

import MobileSidebar from "./mobile-sidebar";
import NavbarRoutes from "./navbar-routes";

const Navbar = () => {
  return (
    <div className="p-6 border-b h-full flex items-center bg-white shadow-sm">
      <MobileSidebar />
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
