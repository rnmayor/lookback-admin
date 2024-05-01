import LocationForm from "@components/pages/locations/location-form";
import { getRegions } from "@lib/data/location";
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

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <LocationForm initialData={management} regions={regions} />
      </div>
    </div>
  );
}
