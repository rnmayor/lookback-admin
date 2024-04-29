import LocationClient from "@components/pages/locations/client";
import { LocationColumn } from "@components/pages/locations/columns";
import { getLocationWithAddress } from "@lib/data/location";

export default async function Locations() {
  const locations = await getLocationWithAddress();
  const formattedLocation: LocationColumn[] = locations.map((location) => ({
    id: location.id,
    name: location.name,
    email: location.email,
    region: location.region,
    province: location.province,
    cityMunicipality: location.cityMunicipality,
    barangay: location.barangay,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-5">
        <LocationClient data={formattedLocation} />
      </div>
    </div>
  );
}
