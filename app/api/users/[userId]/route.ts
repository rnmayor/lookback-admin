import { currentUser } from "@lib/hooks/auth";
import { db } from "@lib/utils/db";
import { differenceInYears, formatISO } from "date-fns";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const body = await req.json();
    const {
      fname,
      lname,
      dob,
      regCode,
      provCode,
      citymunCode,
      brgyCode,
      gender,
      covidStatus,
    } = body;

    const age = differenceInYears(formatISO(new Date()), formatISO(dob));

    const user = await db.user.update({
      where: {
        id: params.userId,
      },
      data: {
        name: `${fname} ${lname}`,
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
      const userCovidStatus = await db.userCovidStatus.findFirst({
        where: {
          userId: user.id,
        },
      });

      if (userCovidStatus) {
        await db.userCovidStatus.update({
          where: {
            userId: user.id,
          },
          data: {
            status: covidStatus ? "POSITIVE" : "NEGATIVE",
          },
        });
      } else {
        await db.userCovidStatus.create({
          data: {
            status: covidStatus ? "POSITIVE" : "NEGATIVE",
            userId: user.id,
          },
        });
      }
    }

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { userId: string } }
) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!params.userId) {
      return new NextResponse("User id is required", { status: 400 });
    }

    const user = await db.user.delete({
      where: {
        id: params.userId,
      },
    });

    return NextResponse.json(user);
  } catch (error) {
    console.log("[USERS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
