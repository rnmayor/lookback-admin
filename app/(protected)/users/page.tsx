import UsersClient from "@components/pages/users/client";
import { UserColumn } from "@components/pages/users/columns";
import { getAllBarangays } from "@lib/data/barangay";
import { getCityMunicipalities } from "@lib/data/cityMun";
import { getAllProvinces } from "@lib/data/province";
import { getAllRegions } from "@lib/data/region";
import { getUserWithAddress } from "@lib/data/user";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";

export default async function Users() {
  const users = await getUserWithAddress();
  const regions = await getAllRegions();
  const provinces = await getAllProvinces();
  const cityMunicipalities = await getCityMunicipalities();
  const barangays = await getAllBarangays();

  const formattedUsers: UserColumn[] = users.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    // regCode: user.regCode,
    region: regions.find((item: Region) => item.regCode === user.regCode),
    // provCode: user.provCode,
    province: provinces.find(
      (item: Province) => item.provCode === user.provCode
    ),
    // citymunCode: user.citymunCode,
    cityMunicipality: cityMunicipalities.find(
      (item: CityMunicipality) => item.citymunCode === user.citymunCode
    ),
    // brgyCode: user.brgyCode,
    barangay: barangays.find(
      (item: Barangay) => item.brgyCode === user.brgyCode
    ),
    age: user.age,
    covidStatus: user.userCovidStatus?.status,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-3">
        <UsersClient data={formattedUsers} />
      </div>
    </div>
  );
}
