import Navbar from "@components/main/navbar";
import Sidebar from "@components/main/sidebar";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-full">
      <nav className="h-[97px] md:pl-56 fixed inset-y-0 w-full z-50">
        <Navbar />
      </nav>
      <nav className="hidden md:flex h-full w-56 flex-col fixed inset-y-0 z-50">
        <Sidebar />
      </nav>
      <main className="md:pl-56 pt-[100px] h-full">{children}</main>
    </div>
  );
}
