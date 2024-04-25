import { db } from "@lib/utils/db";
import { getBarangay } from "./barangay";
import { getCityMunicipality } from "./cityMun";
import { getProvince } from "./province";
import { getRegion } from "./region";

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
    const region = await getRegion(user.regCode);
    const province = await getProvince(user.provCode);
    const cityMunicipality = await getCityMunicipality(user.citymunCode);
    const barangay = await getBarangay(user.brgyCode);

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
  try {
    const user = await db.user.findUnique({
      where: {
        email,
      },
      include: {
        userCovidStatus: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};

export const getUserById = async (id: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        id,
      },
      include: {
        userCovidStatus: true,
      },
    });

    return user;
  } catch {
    return null;
  }
};
