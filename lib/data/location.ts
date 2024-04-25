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

  const locationPromises = locations.map(async (location) => {
    const region = await getRegion(location.regCode);
    const province = await getProvince(location.provCode);
    const cityMunicipality = await getCityMunicipality(location.citymunCode);
    const barangay = await getBarangay(location.brgyCode);

    return {
      ...location,
      region,
      province,
      cityMunicipality,
      barangay,
    };
  });

  // Wait for all promises to resolve
  const formattedLocations = await Promise.all(locationPromises);
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
