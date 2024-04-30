import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getLocationByEmail } from "@lib/data/location";
import { getUserByEmail } from "@lib/data/user";
import { db } from "@lib/utils/db";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/user-history:
 *  post:
 *    description: Create record for user-history table by authorized user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              userEmail:
 *                type: string
 *                description: User's email
 *              managementEmail:
 *                type: string
 *                description: Management's email
 *            required:
 *              - userEmail
 *              - managementEmail
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
    // we can create the user-history
    const { userEmail, managementEmail } = await req.json();

    const existingUser = await getUserByEmail(userEmail);
    if (!existingUser) {
      return new NextResponse("User does not exist", { status: 400 });
    }

    const existingLocation = await getLocationByEmail(managementEmail);
    if (!existingLocation) {
      return new NextResponse("Management does not exist", { status: 400 });
    }

    const location = await db.userHistory.create({
      data: {
        userId: existingUser.id,
        managementId: existingLocation.id,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[USER_HISTORY_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
