import LocationClient from "@components/pages/locations/client";
import { LocationColumn } from "@components/pages/locations/columns";
import { getAllBarangays } from "@lib/data/barangay";
import { getAllCityMunicipalities } from "@lib/data/cityMun";
import { getLocationWithAddress } from "@lib/data/location";
import { getAllProvinces } from "@lib/data/province";
import { getAllRegions } from "@lib/data/region";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";

export default async function Locations() {
  const locations = await getLocationWithAddress();
  const regions = await getAllRegions();
  const provinces = await getAllProvinces();
  const cityMunicipalities = await getAllCityMunicipalities();
  const barangays = await getAllBarangays();

  const formattedLocation: LocationColumn[] = locations.map((location) => ({
    id: location.id,
    name: location.name,
    email: location.email,
    region: regions.find((item: Region) => item.regCode === location.regCode),
    province: provinces.find(
      (item: Province) => item.provCode === location.provCode
    ),
    cityMunicipality: cityMunicipalities.find(
      (item: CityMunicipality) => item.citymunCode === location.citymunCode
    ),
    barangay: barangays.find(
      (item: Barangay) => item.brgyCode === location.brgyCode
    ),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-5">
        <LocationClient data={formattedLocation} />
      </div>
    </div>
  );
}
