import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import {
  getBarangays,
  getCityMunicipalities,
  getProvinces,
  getRegions,
} from "./location";

export const getUserWithAddress = async () => {
  const users = await db.user.findMany({
    include: {
      userCovidStatus: true,
    },
    orderBy: {
      email: "asc",
    },
  });

  const userPromises = users.map(async (user) => {
    const regions = await getRegions();
    const region = regions.find((x: Region) => x.regCode === user.regCode);

    const provinces = await getProvinces();
    const province = provinces.find(
      (x: Province) => x.provCode === user.provCode
    );

    const cityMunicipalities = await getCityMunicipalities();
    const cityMunicipality = cityMunicipalities.find(
      (x: CityMunicipality) => x.citymunCode === user.citymunCode
    );

    const barangays = await getBarangays();
    const barangay = barangays.find(
      (x: Barangay) => x.brgyCode === user.brgyCode
    );

    return {
      ...user,
      region,
      province,
      cityMunicipality,
      barangay,
    };
  });

  // Wait for all promises to resolve
  const formattedUsers = await Promise.all(userPromises);
  return formattedUsers;
};

export const getUserByEmail = async (email: string) => {
  const user = await db.user.findUnique({
    where: {
      email,
    },
    include: {
      userCovidStatus: true,
    },
  });

  return user;
};

export const getUserById = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
    include: {
      userCovidStatus: true,
    },
  });

  return user;
};
