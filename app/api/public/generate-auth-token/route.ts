import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

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
    console.log("GET_TOKEN", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
