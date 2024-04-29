import UsersClient from "@components/pages/users/client";
import { UserColumn } from "@components/pages/users/columns";
import { getUserWithAddress } from "@lib/data/user";

export default async function Users() {
  const users = await getUserWithAddress();
  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    region: user.region,
    province: user.province,
    cityMunicipality: user.cityMunicipality,
    barangay: user.barangay,
    age: user.age,
    covidStatus: user.userCovidStatus ? user.userCovidStatus.status : "",
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-3">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
}
