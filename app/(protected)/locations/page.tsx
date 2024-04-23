"use client";

import LocationClient from "@components/pages/locations/client";
import { LocationColumn } from "@components/pages/locations/columns";

export default function Locations() {
  const formattedLocation: LocationColumn[] = [];

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-5">
        <LocationClient data={formattedLocation} />
      </div>
    </div>
  );
}
