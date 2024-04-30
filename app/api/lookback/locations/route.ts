import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getLocationByEmail } from "@lib/data/location";
import { db } from "@lib/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/locations:
 *  post:
 *    description: Create record for management table by authorized user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                description: Location name
 *              email:
 *                type: string
 *                description: Location's email address (must be unique)
 *              password:
 *                type: string
 *                description: User's password
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
 *            required:
 *              - name
 *              - email
 *              - password
 *              - regCode
 *              - provCode
 *              - citymunCode
 *              - brgyCode
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
    // we can create the management/location
    const { name, email, password, regCode, provCode, citymunCode, brgyCode } =
      await req.json();

    const existingLocation = await getLocationByEmail(email);
    if (existingLocation) {
      return new NextResponse("Location already existing", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(`${password}`, 10);
    const location = await db.management.create({
      data: {
        name,
        email,
        password: hashedPassword,
        regCode,
        provCode,
        citymunCode,
        brgyCode,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[LOCATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
