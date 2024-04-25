import { getBarangay } from "@lib/data/barangay";
import { getCityMunicipality } from "@lib/data/cityMun";
import { getProvince } from "@lib/data/province";
import { getRegion } from "@lib/data/region";
import { getUserByEmail } from "@lib/data/user";
import { db } from "@lib/utils/db";
import { UserRole } from "@lib/utils/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    // check authorization header
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) {
      return new NextResponse("Authorization header is missing", {
        status: 401,
      });
    }

    // get token from authorization header
    const [, token] = authorizationHeader.split(" ");
    if (!token) {
      return new NextResponse("Authorization token is missing", {
        status: 401,
      });
    }

    // decode token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { email: string; password: string };

    // verify decoded token if user is existing in DB
    const loginUser = await getUserByEmail(decodedToken.email);
    if (!loginUser) {
      return new NextResponse("Invalid email", { status: 401 });
    }

    if (!loginUser.password) {
      return new NextResponse("Password missing", { status: 401 });
    }

    // compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(
      decodedToken.password,
      loginUser.password
    );

    if (!passwordMatch) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    // USER role is not allowed to access API
    if (loginUser.role === UserRole.USER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

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
