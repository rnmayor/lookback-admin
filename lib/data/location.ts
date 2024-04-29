import { baseURL } from "@lib/utils/constants";
import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";

export const getLocationWithAddress = async () => {
  const locations = await db.management.findMany({
    orderBy: {
      email: "asc",
    },
  });

  const locationPromises = locations.map(async (location) => {
    const regions = await getRegions();
    const region = regions.find((x: Region) => x.regCode === location.regCode);

    const provinces = await getProvinces();
    const province = provinces.find(
      (x: Province) => x.provCode === location.provCode
    );

    const cityMunicipalities = await getCityMunicipalities();
    const cityMunicipality = cityMunicipalities.find(
      (x: CityMunicipality) => x.citymunCode === location.citymunCode
    );

    const barangays = await getBarangays();
    const barangay = barangays.find(
      (x: Barangay) => x.brgyCode === location.brgyCode
    );

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

export async function getRegions() {
  try {
    const response = await fetch(`${baseURL}/api/lookback/regions`);
    if (!response.ok) {
      throw new Error("Failed to fetch regions");
    }

    const regions = await response.json();
    return regions;
  } catch (error) {
    console.log("Error fetching regions", error);
    throw error;
  }
}

export async function getProvinces() {
  try {
    const response = await fetch(`${baseURL}/api/lookback/provinces`);
    if (!response.ok) {
      throw new Error("Failed to fetch provinces");
    }

    const provinces = await response.json();
    return provinces;
  } catch (error) {
    console.log("Error fetching provinces", error);
    throw error;
  }
}

export async function getCityMunicipalities() {
  try {
    const response = await fetch(`${baseURL}/api/lookback/city-municipalities`);
    if (!response.ok) {
      throw new Error("Failed to fetch city-municipalities");
    }

    const cityMunicipalities = await response.json();
    return cityMunicipalities;
  } catch (error) {
    console.log("Error fetching city-municipalities", error);
    throw error;
  }
}

export async function getBarangays() {
  const fetchOptions: RequestInit = {
    cache: "no-store", // Prevent caching
  };

  try {
    const response = await fetch(
      `${baseURL}/api/lookback/barangays`,
      fetchOptions
    );
    if (!response.ok) {
      throw new Error("Failed to fetch barangays");
    }

    const barangays = await response.json();
    return barangays;
  } catch (error) {
    console.log("Error fetching barangays", error);
    throw error;
  }
}
