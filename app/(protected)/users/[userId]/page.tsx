import UserForm from "@components/pages/users/user-form";
import { getRegions } from "@lib/actions/getRegions";
import { db } from "@lib/utils/db";
import { Region } from "@lib/utils/types";

export default async function User({ params }: { params: { userId: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      userCovidStatus: true,
    },
  });

  const regions = await getRegions().then((data) => {
    return data.sort((a: Region, b: Region) => {
      const regDescA = a.regDesc.toUpperCase();
      const regDescB = b.regDesc.toUpperCase();

      if (regDescA < regDescB) {
        return -1;
      }
      if (regDescA > regDescB) {
        return 1;
      }
      return 0;
    });
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <UserForm initialData={user} regions={regions} />
      </div>
    </div>
  );
}
