import { getUserByEmail } from "@lib/data/user";
import { currentRole, currentUser } from "@lib/utils/auth";
import { db } from "@lib/utils/db";
import { CovidStatus, UserRole } from "@lib/utils/types";
import bcrypt from "bcryptjs";
import { differenceInYears, formatISO } from "date-fns";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const role = await currentRole();
    if (role === UserRole.USER) {
      return new NextResponse("Forbidden", { status: 403 });
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
    const role = await currentRole();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }
    if (role !== UserRole.SUPER_ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

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
    } = await req.json();

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

    if (typeof covidStatus !== "undefined") {
      await db.userCovidStatus.create({
        data: {
          status: covidStatus ? CovidStatus.POSITIVE : CovidStatus.NEGATIVE,
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
