import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getLocationById } from "@lib/data/location";
import { db } from "@lib/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/locations/{locationId}/password:
 *  patch:
 *    description: Update management's password by the authorized user
 *    parameters:
 *      - name: locationId
 *        in: path
 *        required: true
 *        description: The ID of the management
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
 *              password:
 *                type: string
 *                description: Management's password
 *            required:
 *              - password
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
    params: { locationId: string };
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
    // we can update the user's password
    const existingLocation = await getLocationById(params.locationId);
    if (!existingLocation) {
      return new NextResponse("Management is not existing", { status: 400 });
    }

    const { password } = await req.json();
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(`${password}`, 10);
    const location = await db.management.update({
      where: {
        id: params.locationId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[MANAGEMENT_PASSWORD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
