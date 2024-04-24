import { db } from "@lib/utils/db";
import { getBarangay } from "./barangay";
import { getCityMunicipality } from "./cityMun";
import { getProvince } from "./province";
import { getRegion } from "./region";

export const getLocationWithAddress = async () => {
  const locations = await db.management.findMany({
    orderBy: {
      email: "asc",
    },
  });

  const formattedLocations = locations.map((location) => ({
    ...location,
    region: getRegion(location.regCode),
    province: getProvince(location.provCode),
    cityMunicipality: getCityMunicipality(location.citymunCode),
    barangay: getBarangay(location.brgyCode),
  }));

  return formattedLocations;
};

export const getLocationByEmail = async (email: string) => {
  try {
    const location = await db.management.findUnique({
      where: {
        email,
      },
    });

    return location;
  } catch {
    return null;
  }
};
