import { auth } from "@auth";

export default async function Users() {
  const session = await auth();
  return (
    <div className="bg-emerald-500">
      Users page
      <div>
        server session
        {JSON.stringify(session?.user)}
      </div>
    </div>
  );
}
