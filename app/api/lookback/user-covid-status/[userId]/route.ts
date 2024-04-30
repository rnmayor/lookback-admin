import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getUserById } from "@lib/data/user";
import { db } from "@lib/utils/db";
import { CovidStatus } from "@lib/utils/types";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/user-covid-status/{userId}:
 *  patch:
 *    description: Update user's covid status by the authorized user
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
 *              status:
 *                type: string
 *                enum:
 *                  - POSITIVE
 *                  - NEGATIVE
 *                description: User's covid status
 *            required:
 *              - status
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized - Invalid or missing token
 */
export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
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
    // validate the user to update for the covid status
    const user = await getUserById(params.userId);
    if (!user) {
      return new NextResponse("User is not existing", {
        status: 400,
      });
    }
    // Check if user to update is within the admin's LGU
    if (user.citymunCode !== loginUser.citymunCode) {
      return new NextResponse(
        "You cannot update user's covid status that is not within your LGU",
        { status: 400 }
      );
    }
    // check if user to update has status
    if (!user.userCovidStatus) {
      return new NextResponse(
        "User has no status. Please create one using a POST request.",
        { status: 400 }
      );
    }

    const { status } = await req.json();
    // Check if the status value is a valid CovidStatus enum value
    if (!Object.values(CovidStatus).includes(status)) {
      return new NextResponse("Invalid CovidStatus value", { status: 400 });
    }

    const updatedUser = await db.userCovidStatus.update({
      where: {
        userId: params.userId,
      },
      data: {
        status,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.log("[USER_COVID_STATUS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
