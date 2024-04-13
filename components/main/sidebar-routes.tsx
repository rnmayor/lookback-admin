import { ROUTES } from "@lib/utils/routes";
import SidebarItem from "./sidebar-item";

const SidebarRoutes = () => {
  return (
    <div>
      {ROUTES.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};

export default SidebarRoutes;
