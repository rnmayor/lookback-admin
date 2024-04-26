import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getBarangay } from "@lib/data/barangay";
import { getCityMunicipality } from "@lib/data/cityMun";
import { getProvince } from "@lib/data/province";
import { getRegion } from "@lib/data/region";
import { db } from "@lib/utils/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    const loginUser = validationResult.loginUser;
    // now we have fully verified the user and role accessing this api
    // get users that is under the authorized user's city
    const users = await db.user.findMany({
      select: {
        fname: true,
        lname: true,
        email: true,
        regCode: true,
        provCode: true,
        citymunCode: true,
        brgyCode: true,
        gender: true,
        birthDate: true,
        age: true,
        userCovidStatus: {
          select: {
            status: true,
          },
        },
      },
      where: {
        citymunCode: loginUser.citymunCode,
      },
    });

    const userPromises = users.map(async (user) => {
      const region = await getRegion(user.regCode);
      const province = await getProvince(user.provCode);
      const cityMunicipality = await getCityMunicipality(user.citymunCode);
      const barangay = await getBarangay(user.brgyCode);

      return {
        ...user,
        region: region.regDesc,
        province: province.provDesc,
        cityMunicipality: cityMunicipality.citymunDesc,
        barangay: barangay.brgyDesc,
      };
    });

    // Wait for all promises to resolve
    const formattedUsers = await Promise.all(userPromises);
    return NextResponse.json(formattedUsers);
  } catch (error) {
    console.log("USERS_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
