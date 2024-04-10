import { db } from "@lib/utils/db";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

// TODO: add authentication (Next-auth if private api, otherwise JWT strat)
export async function GET(req: Request) {
  return new NextResponse("Success", { status: 200 });
}

export async function POST(req: Request) {
  try {
    const { name, email, emailVerified, image, password } = await req.json();

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await db.user.create({
      data: {
        name,
        email,
        emailVerified,
        image,
        password: hashedPassword,
      },
    });

    return NextResponse.json(newUser);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
