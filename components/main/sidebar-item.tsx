import { cn } from "@lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconType } from "react-icons";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  href: string;
}

const SidebarItem = ({ icon: Icon, label, href }: SidebarItemProps) => {
  const pathname = usePathname();
  const isActive = pathname === href || pathname.startsWith(`${href}`);

  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-x-2 h-[50%] text-slate-500 text-sm font-[500] pl-6 hover:text-slate-600 hover:bg-slate-300/20 transition-all",
        isActive &&
          "text-orange-600 bg-orange-400/20 hover:bg-orange-300/20 hover:text-orange-600"
      )}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon size={22} />
        {label}
      </div>
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-orange-700 h-full transition-all",
          isActive && "opacity-100"
        )}
      />
    </Link>
  );
};

export default SidebarItem;
