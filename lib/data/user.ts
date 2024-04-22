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

  const formattedUsers = users.map((user) => ({
    ...user,
    region: getRegion(user.regCode),
    province: getProvince(user.provCode),
    cityMunicipality: getCityMunicipality(user.citymunCode),
    barangay: getBarangay(user.brgyCode),
  }));

  return formattedUsers;
};

export const getUserByEmail = async (email: string) => {
  try {
    const user = await db.user.findUnique({
      where: {
        email,
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
