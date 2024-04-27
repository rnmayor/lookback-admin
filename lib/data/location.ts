import { baseURL } from "@lib/utils/constants";
import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";

export const getLocationWithAddress = async () => {
  const fetchOptions: RequestInit = {
    cache: "no-store", // Prevent caching
  };

  const locations = await db.management.findMany({
    orderBy: {
      email: "asc",
    },
  });

  const locationPromises = locations.map(async (location) => {
    const region = await fetch(`${baseURL}/api/lookback/regions`)
      .then((data) => {
        return data.json();
      })
      .then((regions) => {
        return regions.find((x: Region) => x.regCode === location.regCode);
      });

    const province = await fetch(`${baseURL}/api/lookback/provinces`)
      .then((data) => {
        return data.json();
      })
      .then((provinces) => {
        return provinces.find(
          (x: Province) => x.provCode === location.provCode
        );
      });
    const cityMunicipality = await fetch(
      `${baseURL}/api/lookback/city-municipalities`
    )
      .then((data) => {
        return data.json();
      })
      .then((cityMunicipalities) => {
        return cityMunicipalities.find(
          (x: CityMunicipality) => x.citymunCode === location.citymunCode
        );
      });
    const barangay = await fetch(
      `${baseURL}/api/lookback/barangays`,
      fetchOptions
    )
      .then((data) => {
        return data.json();
      })
      .then((barangays) => {
        return barangays.find(
          (x: Barangay) => x.brgyCode === location.brgyCode
        );
      });

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
