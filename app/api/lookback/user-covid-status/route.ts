import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getUserByEmail } from "@lib/data/user";
import { db } from "@lib/utils/db";
import { CovidStatus } from "@lib/utils/types";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/user-covid-status:
 *  post:
 *    description: Create record for user-covid-status by the authorized user
 *    security:
 *      - bearerAuth: []
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                description: User's email address
 *              covidStatus:
 *                type: string
 *                enum:
 *                  - POSITIVE
 *                  - NEGATIVE
 *                description: User's covid status
 *            required:
 *              - email
 *              - covidStatus
 *    responses:
 *      200:
 *        description: Success
 *      400:
 *        description: User is not existing
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
    // validate the user's covid status to create
    const { email, covidStatus } = await req.json();

    const user = await getUserByEmail(email);
    if (!user) {
      return new NextResponse("User is not existing", {
        status: 400,
      });
    }
    if (!covidStatus) {
      return new NextResponse("Missing 'covidStatus' in request body.", {
        status: 400,
      });
    }
    // Check if user to update has existing status
    if (user.userCovidStatus) {
      return new NextResponse(
        "User has existing status. Please update one using a PATCH request.",
        { status: 400 }
      );
    }
    // Check if the status value is a valid CovidStatus enum value
    if (!Object.values(CovidStatus).includes(covidStatus)) {
      return new NextResponse("Invalid CovidStatus value", { status: 400 });
    }

    const createdUserCovidStatus = await db.userCovidStatus.create({
      data: {
        status: covidStatus,
        userId: user.id,
      },
    });

    return NextResponse.json(createdUserCovidStatus);
  } catch (error) {
    console.log("[USER_COVID_STATUS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
