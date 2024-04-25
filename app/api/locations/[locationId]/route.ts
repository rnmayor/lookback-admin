import { currentRole, currentUser } from "@lib/hooks/auth";
import { db } from "@lib/utils/db";
import { UserRole } from "@lib/utils/types";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const role = await currentRole();
    if (role === UserRole.USER) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const { name, regCode, provCode, citymunCode, brgyCode } = await req.json();

    const location = await db.management.update({
      where: {
        id: params.locationId,
      },
      data: {
        name,
        regCode,
        provCode,
        citymunCode,
        brgyCode,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[LOCATIONS_PATCH]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { locationId: string } }
) {
  try {
    const userSession = await currentUser();
    if (!userSession) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const role = await currentRole();
    if (role !== UserRole.SUPER_ADMIN) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    if (!params.locationId) {
      return new NextResponse("Location id is required", { status: 400 });
    }

    const location = await db.management.delete({
      where: {
        id: params.locationId,
      },
    });

    return NextResponse.json(location);
  } catch (error) {
    console.log("[LOCATIONS_DELETE]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
