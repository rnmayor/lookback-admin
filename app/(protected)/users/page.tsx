import UsersClient from "@components/pages/users/client";
import { UserColumn } from "@components/pages/users/columns";
import { db } from "@lib/utils/db";

export default async function Users() {
  const users = await db.user.findMany({
    include: {
      userCovidStatus: true,
    },
    orderBy: {
      email: "asc",
    },
  });

  const formattedUsers: UserColumn[] = users.map((item) => ({
    name: item.name,
    email: item.email,
    regCode: item.regCode,
    provCode: item.provCode,
    citymunCode: item.citymunCode,
    brgyCode: item.brgyCode,
    gender: item.gender,
    covidStatus: item.userCovidStatus?.status,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
}
