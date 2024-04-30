import { validatePublicApi } from "@lib/actions/validate-public-api";
import {
  getBarangays,
  getCityMunicipalities,
  getProvinces,
  getRegions,
} from "@lib/data/location";
import { getUserByEmail } from "@lib/data/user";
import { db } from "@lib/utils/db";
import {
  Barangay,
  CityMunicipality,
  CovidStatus,
  Province,
  Region,
} from "@lib/utils/types";
import bcrypt from "bcryptjs";
import { differenceInYears, formatISO } from "date-fns";
import { NextResponse } from "next/server";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/lookback/users:
 *  get:
 *    description: Get users data that are within the city/municipality of the authorized user
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized - Invalid or missing token
 */
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
    console.log("[USERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/lookback/users:
 *  post:
 *    description: Create record for users table by authorized user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              fname:
 *                type: string
 *                description: User's first name
 *              lname:
 *                type: string
 *                description: User's last name
 *              email:
 *                type: string
 *                description: User's email address (must be unique)
 *              dob:
 *                type: string
 *                format: date-time
 *                description: User's date of birth (ISO 8601 format)
 *              regCode:
 *                type: string
 *                description: User's region code
 *              provCode:
 *                type: string
 *                description: User's province code
 *              citymunCode:
 *                type: string
 *                description: User's city/municipality code
 *              brgyCode:
 *                type: string
 *                description: User's barangay code
 *              gender:
 *                type: string
 *                enum:
 *                  - FEMALE
 *                  - MALE
 *                description: User's gender
 *              covidStatus:
 *                type: string
 *                enum:
 *                  - POSITIVE
 *                  - NEGATIVE
 *                description: User's covid status
 *            required:
 *              - fname
 *              - lname
 *              - email
 *              - dob
 *              - regCode
 *              - provCode
 *              - citymunCode
 *              - brgyCode
 *              - gender
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized - Invalid or missing token
 */
export async function POST(req: Request) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    // now we have fully verified the user and role accessing this api
    // we can create the user
    const {
      fname,
      lname,
      email,
      dob,
      regCode,
      provCode,
      citymunCode,
      brgyCode,
      gender,
      covidStatus,
    } = await req.json();

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new NextResponse("Email already existing", { status: 400 });
    }

    const age = differenceInYears(formatISO(new Date()), formatISO(dob));
    const hashedPassword = await bcrypt.hash(
      `${process.env.DEFAULT_PASSWORD}`,
      10
    );
    const user = await db.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        password: hashedPassword,
        fname,
        lname,
        regCode,
        provCode,
        citymunCode,
        brgyCode,
        gender,
        birthDate: formatISO(dob),
        age,
      },
    });
    if (typeof covidStatus !== "undefined") {
      await db.userCovidStatus.create({
        data: {
          status: covidStatus ? CovidStatus.POSITIVE : CovidStatus.NEGATIVE,
          userId: user.id,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
