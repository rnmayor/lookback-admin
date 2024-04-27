import { validatePublicApi } from "@lib/actions/validate-public-api";
import { baseURL } from "@lib/utils/constants";
import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import { NextResponse } from "next/server";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";
const fetchOptions: RequestInit = {
  cache: "no-store", // Prevent caching
};

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
