import UserForm from "@components/pages/users/user-form";
import { getBarangays } from "@lib/data/barangay";
import { getCityMunicipalities } from "@lib/data/cityMun";
import { getProvinces } from "@lib/data/province";
import { getRegions } from "@lib/data/region";
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
  const provinces = await getProvinces(user?.regCode);
  const cityMunicipalities = await getCityMunicipalities(user?.provCode);
  const barangays = await getBarangays(user?.citymunCode);

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <UserForm
          initialData={user}
          regions={regions}
          provinces={provinces}
          cityMunicipalities={cityMunicipalities}
          barangays={barangays}
        />
      </div>
    </div>
  );
}
