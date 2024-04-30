import { getLocationByEmail } from "@lib/data/location";
import { currentRole, currentUser } from "@lib/utils/auth";
import { db } from "@lib/utils/db";
import { UserRole } from "@lib/utils/types";
import bcrypt from "bcryptjs";
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

    const locations = await db.management.findMany({
      orderBy: {
        name: "asc",
      },
    });

    return NextResponse.json(locations);
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
    const role = await currentRole();
    if (role !== UserRole.SUPER_ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { name, email, regCode, provCode, citymunCode, brgyCode } =
      await req.json();

    const existingLocation = await getLocationByEmail(email);
    if (existingLocation) {
      return new NextResponse("Location already existing", { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(
      `${process.env.DEFAULT_PASSWORD}`,
      10
    );
    const location = await db.management.create({
      data: {
        name,
        email,
        password: hashedPassword,
        regCode,
        provCode,
        citymunCode,
        brgyCode,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[LOCATIONS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
