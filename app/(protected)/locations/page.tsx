import LocationClient from "@components/pages/locations/client";
import { LocationColumn } from "@components/pages/locations/columns";
import { getLocationWithAddress } from "@lib/data/location";

export default async function Locations() {
  const locations = await getLocationWithAddress();
  const formattedLocation: LocationColumn[] = locations.map((location) => ({
    ...location,
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-5">
        <LocationClient data={formattedLocation} />
      </div>
    </div>
  );
}
