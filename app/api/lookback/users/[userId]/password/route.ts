import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getUserById } from "@lib/data/user";
import { db } from "@lib/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/users/{userId}/password:
 *  patch:
 *    description: Update user's password by the authorized user
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
 *              password:
 *                type: string
 *                description: User's password
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
    // we can update the user's password
    const existingUser = await getUserById(params.userId);
    if (!existingUser) {
      return new NextResponse("User is not existing", { status: 400 });
    }

    const { password } = await req.json();
    if (!password) {
      return new NextResponse("Password is required", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(`${password}`, 10);
    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        password: hashedPassword,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USER_PASSWORD_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
