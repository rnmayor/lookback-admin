import LocationForm from "@components/pages/locations/location-form";
import { getAllBarangays } from "@lib/data/barangay";
import { getAllCityMunicipalities } from "@lib/data/cityMun";
import { getAllProvinces } from "@lib/data/province";
import { getAllRegions } from "@lib/data/region";
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

  const regions = await getAllRegions();
  const provinces = await getAllProvinces();
  const cityMunicipalities = await getAllCityMunicipalities();
  const barangays = await getAllBarangays();

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
