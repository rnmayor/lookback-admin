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

    const provinces = await getProvincesByRegCode(location.regCode);
    const province = provinces.find(
      (x: Province) => x.provCode === location.provCode
    );

    const cityMunicipalities = await getCityMunicipalitiesByProvCode(
      location.provCode
    );
    const cityMunicipality = cityMunicipalities.find(
      (x: CityMunicipality) => x.citymunCode === location.citymunCode
    );

    const barangays = await getBarangaysByCitymunCode(location.citymunCode);
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

export const getLocationById = async (locationId: string) => {
  try {
    const location = await db.management.findUnique({
      where: {
        id: locationId,
      },
    });

    return location;
  } catch {
    return null;
  }
};

export async function getRegions() {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/lookback/regions`
    );
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

export async function getProvincesByRegCode(regCode: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/lookback/regions/${regCode}/provinces`
    );
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

export async function getCityMunicipalitiesByProvCode(provCode: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/lookback/provinces/${provCode}/city-municipalities`
    );
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

export async function getBarangaysByCitymunCode(citymunCode: string) {
  try {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/lookback/city-municipalities/${citymunCode}/barangays`
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
