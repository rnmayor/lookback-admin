import { getUserByEmail } from "@lib/data/user";
import { currentUser } from "@lib/hooks/auth";
import { db } from "@lib/utils/db";
import bcrypt from "bcryptjs";
import { differenceInYears, formatISO } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const users = await db.user.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      fname,
      lname,
      email,
      dob,
      regCode,
      provCode,
      citymunCode,
      brgyCode,
      gender,
      covidStatus,
    } = body;

    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return new NextResponse("Email already existing", { status: 400 });
    }

    const age = differenceInYears(formatISO(new Date()), formatISO(dob));

    const hashedPassword = await bcrypt.hash(
      `${process.env.DEFAULT_PASSWORD}`,
      10
    );
    const user = await db.user.create({
      data: {
        name: `${fname} ${lname}`,
        email,
        password: hashedPassword,
        fname,
        lname,
        regCode,
        provCode,
        citymunCode,
        brgyCode,
        gender,
        birthDate: formatISO(dob),
        age,
      },
    });

    if (covidStatus) {
      await db.userCovidStatus.create({
        data: {
          status: covidStatus ? "POSITIVE" : "NEGATIVE",
          userId: user.id,
        },
      });
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
