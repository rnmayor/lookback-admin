import { auth } from "@auth";

export default async function Users() {
  const session = await auth();
  return (
    <div>
      Users page
      <div>
        server session
        {JSON.stringify(session?.user)}
      </div>
    </div>
  );
}
