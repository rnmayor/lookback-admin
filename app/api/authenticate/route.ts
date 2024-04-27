import { getUserByEmail } from "@lib/data/user";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    if (!email || !password) {
      return new NextResponse("Invalid request", { status: 400 });
    }

    const user = await getUserByEmail(email);
    if (!user || !user.password) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return new NextResponse("Invalid credentials", { status: 400 });
    }

    // all validation passed, return success
    return NextResponse.json(user);
    // return new NextResponse("success", { status: 200 });
  } catch {
    return new NextResponse("Internal error", { status: 500 });
  }
}
