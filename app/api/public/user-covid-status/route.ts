import { getUserByEmail } from "@lib/data/user";
import { db } from "@lib/utils/db";
import { UserRole } from "@lib/utils/types";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // check authorization header
    const authorizationHeader = req.headers.get("authorization");
    if (!authorizationHeader) {
      return new NextResponse("Authorization header is missing", {
        status: 401,
      });
    }

    // get token from authorization header
    const [, token] = authorizationHeader.split(" ");
    if (!token) {
      return new NextResponse("Authorization token is missing", {
        status: 401,
      });
    }

    // decode token
    const decodedToken = jwt.verify(
      token,
      process.env.JWT_SECRET as string
    ) as { email: string; password: string };

    // verify decoded token if user is existing in DB
    const loginUser = await getUserByEmail(decodedToken.email);
    if (!loginUser) {
      return new NextResponse("Invalid email", { status: 401 });
    }

    if (!loginUser.password) {
      return new NextResponse("Password missing", { status: 401 });
    }

    // compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(
      decodedToken.password,
      loginUser.password
    );

    if (!passwordMatch) {
      return new NextResponse("Invalid password", { status: 401 });
    }

    // USER role is not allowed to access API
    if (loginUser.role === UserRole.USER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    // now we have fully verified the user accessing this api
    // validate the user's covid staus to create
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
    if (user.citymunCode !== loginUser.citymunCode) {
      return new NextResponse(
        "You cannot create user's covid status that is not within your LGU",
        { status: 400 }
      );
    }

    // check if user to update has existing status
    if (user.userCovidStatus) {
      return new NextResponse(
        "User has existing status. Please update one using a PATCH request.",
        { status: 400 }
      );
    }

    const createdUserCovidStatus = await db.userCovidStatus.create({
      data: {
        status: covidStatus,
        userId: user.id,
      },
    });

    return NextResponse.json(createdUserCovidStatus);
  } catch (error) {
    console.log("USER_COVID_STATUS_POST", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
