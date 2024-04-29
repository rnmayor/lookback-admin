import LocationForm from "@components/pages/locations/location-form";
import {
  getBarangays,
  getCityMunicipalities,
  getProvinces,
  getRegions,
} from "@lib/data/location";
import { db } from "@lib/utils/db";

export default async function Location({
  params,
}: {
  params: {
    locationId: string;
  };
}) {
  const management = await db.management.findUnique({
    where: {
      id: params.locationId,
    },
  });

  const regions = await getRegions();
  const provinces = await getProvinces();
  const cityMunicipalities = await getCityMunicipalities();
  const barangays = await getBarangays();

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <LocationForm
          initialData={management}
          regions={regions}
          provinces={provinces}
          cityMunicipalities={cityMunicipalities}
          barangays={barangays}
        />
      </div>
    </div>
  );
}
