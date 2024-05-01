import UserForm from "@components/pages/users/user-form";
import { getRegions } from "@lib/data/location";
import { db } from "@lib/utils/db";

export default async function User({ params }: { params: { userId: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      userCovidStatus: true,
    },
  });

  const regions = await getRegions();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <UserForm initialData={user} regions={regions} />
      </div>
    </div>
  );
}
