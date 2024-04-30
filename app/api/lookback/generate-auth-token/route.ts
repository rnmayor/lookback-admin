import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/generate-auth-token:
 *  post:
 *    description: Returns generated token that can be used for Authorization Headers in calling other lookback-admin APIs
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
 *              password:
 *                type: string
 *                description: User's password
 *            required:
 *              - email
 *              - password
 *    responses:
 *      200:
 *        description: Success
 */
export async function POST(req: Request) {
  try {
    const jwtSecret = process.env.JWT_SECRET as jwt.Secret;
    const { email, password } = await req.json();

    const payload = {
      email: email,
      password: password,
    };

    const token = jwt.sign(payload, jwtSecret, { expiresIn: "1h" });

    return NextResponse.json(token);
  } catch (error) {
    console.log("[TOKEN_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
