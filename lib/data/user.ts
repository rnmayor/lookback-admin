import { baseURL } from "@lib/utils/constants";
import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";

export const getUserWithAddress = async () => {
  const fetchOptions: RequestInit = {
    cache: "no-store", // Prevent caching
  };

  const users = await db.user.findMany({
    include: {
      userCovidStatus: true,
    },
    orderBy: {
      email: "asc",
    },
  });

  const userPromises = users.map(async (user) => {
    const region = await fetch(`${baseURL}/api/lookback/regions`)
      .then((data) => {
        return data.json();
      })
      .then((regions) => {
        return regions.find((x: Region) => x.regCode === user.regCode);
      });

    const province = await fetch(`${baseURL}/api/lookback/provinces`)
      .then((data) => {
        return data.json();
      })
      .then((provinces) => {
        return provinces.find((x: Province) => x.provCode === user.provCode);
      });

    const cityMunicipality = await fetch(
      `${baseURL}/api/lookback/city-municipalities`
    )
      .then((data) => {
        return data.json();
      })
      .then((cityMunicipalities) => {
        return cityMunicipalities.find(
          (x: CityMunicipality) => x.citymunCode === user.citymunCode
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
        return barangays.find((x: Barangay) => x.brgyCode === user.brgyCode);
      });

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
