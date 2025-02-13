import { validatePublicApi } from "@lib/actions/validate-public-api";
import {
  getBarangaysByCitymunCode,
  getCityMunicipalitiesByProvCode,
  getProvincesByRegCode,
  getRegions,
} from "@lib/data/location";
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
 * /api/lookback/users/{userId}:
 *  get:
 *    description: Get user data by the authorized user
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized - Invalid or missing token
 */
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    // now we have fully verified the user and role accessing this api
    // we can get the user's information
    const user = await db.user.findUnique({
      where: {
        id: params.userId,
      },
    });
    if (!user) {
      return new NextResponse("User is not existing", { status: 400 });
    }
    const userPromises = [user].map(async (user) => {
      const regions = await getRegions();
      const region = regions.find((x: Region) => x.regCode === user.regCode);

      const provinces = await getProvincesByRegCode(user.regCode);
      const province = provinces.find(
        (x: Province) => x.provCode === user.provCode
      );

      const cityMunicipalities = await getCityMunicipalitiesByProvCode(
        user.provCode
      );
      const cityMunicipality = cityMunicipalities.find(
        (x: CityMunicipality) => x.citymunCode === user.citymunCode
      );

      const barangays = await getBarangaysByCitymunCode(user.citymunCode);
      const barangay = barangays.find(
        (x: Barangay) => x.brgyCode === user.brgyCode
      );

      const userHistory = await db.userHistory.findMany({
        where: {
          userId: user.id,
        },
      });
      const promisedUserHistories = userHistory.map(async (history) => {
        const management = await db.management.findUnique({
          where: {
            id: history.managementId,
          },
        });
        return {
          ...history,
          management: management?.name,
          managementEmail: management?.email,
        };
      });
      const userHistories = await Promise.all(promisedUserHistories);

      const notifications = await db.notification.findMany({
        where: {
          userId: user.id,
        },
      });

      return {
        ...user,
        region: region.regDesc,
        province: province.provDesc,
        cityMunicipality: cityMunicipality.citymunDesc,
        barangay: barangay.brgyDesc,
        userHistories: userHistories,
        notifications: notifications,
      };
    });

    // Wait for all promises to resolve
    const [formattedUser] = await Promise.all(userPromises);
    return NextResponse.json(formattedUser);
  } catch (error) {
    console.log("USER_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

/**
 * @swagger
 * /api/lookback/users/{userId}:
 *  patch:
 *    description: Update user's record by the authorized user
 *    parameters:
 *      - name: userId
 *        in: path
 *        required: true
 *        description: The ID of the user
 *        schema:
 *          type: string
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
 *              password:
 *                type: string
 *                description: User's password
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
 *              - password
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
export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    // now we have fully verified the user and role accessing this api
    // we can update the user
    const {
      fname,
      lname,
      password,
      dob,
      regCode,
      provCode,
      citymunCode,
      brgyCode,
      gender,
      covidStatus,
    } = await req.json();

    const age = differenceInYears(formatISO(new Date()), formatISO(dob));
    const hashedPassword = await bcrypt.hash(`${password}`, 10);

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: `${fname} ${lname}`,
        fname,
        lname,
        password: hashedPassword,
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
      // Check if the status value is a valid CovidStatus enum value
      if (!Object.values(CovidStatus).includes(covidStatus)) {
        return new NextResponse("Invalid CovidStatus value", { status: 400 });
      }

      const userCovidStatus = await db.userCovidStatus.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (userCovidStatus) {
        await db.userCovidStatus.update({
          where: {
            userId: user.id,
          },
          data: {
            status: covidStatus,
          },
        });
      } else {
        await db.userCovidStatus.create({
          data: {
            status: covidStatus,
            userId: user.id,
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
