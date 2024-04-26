import { validatePublicApi } from "@lib/actions/validate-public-api";
import { getBarangay } from "@lib/data/barangay";
import { getCityMunicipality } from "@lib/data/cityMun";
import { getProvince } from "@lib/data/province";
import { getRegion } from "@lib/data/region";
import { db } from "@lib/utils/db";
import { saveAs } from "file-saver";
import fs from "fs";
import { NextResponse } from "next/server";
import path from "path";

interface User {
  email: string;
  fname: string;
  lname: string;
  region: string;
  province: string;
  cityMunicipality: string;
  barangay: string;
  gender: string;
  age: string;
  covidStatus: string;
}

export async function GET(req: Request, response: NextResponse) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    const loginUser = validationResult.loginUser;
    // now we have fully verified the user and role accessing this api
    // get users that is under the authorized user's city
    const users = await db.user.findMany({
      select: {
        fname: true,
        lname: true,
        email: true,
        regCode: true,
        provCode: true,
        citymunCode: true,
        brgyCode: true,
        gender: true,
        birthDate: true,
        age: true,
        userCovidStatus: {
          select: {
            status: true,
          },
        },
      },
      where: {
        citymunCode: loginUser.citymunCode,
      },
    });

    const userPromises = users.map(async (user) => {
      const region = await getRegion(user.regCode);
      const province = await getProvince(user.provCode);
      const cityMunicipality = await getCityMunicipality(user.citymunCode);
      const barangay = await getBarangay(user.brgyCode);

      return {
        email: user.email,
        fname: user.fname,
        lname: user.lname,
        gender: user.gender,
        age: user.age,
        covidStatus: user.userCovidStatus ? user.userCovidStatus.status : "",
        region: region.regDesc,
        province: province.provDesc,
        cityMunicipality: cityMunicipality.citymunDesc,
        barangay: barangay.brgyDesc,
      };
    });

    // Wait for all promises to resolve
    const formattedUsers = await Promise.all(userPromises);

    // Extract column names from the user object
    const columns: Array<keyof User> = [
      "email",
      "fname",
      "lname",
      "region",
      "province",
      "cityMunicipality",
      "barangay",
      "gender",
      "age",
      "covidStatus",
    ];
    // Construct the header row by joining column names with commas
    const headerRow = columns.join(",");

    // Create a CSV file with the user's data
    const dataRows = formattedUsers.map((user) => {
      const values = columns.map((column) => {
        let value = user[column];
        return value ? value.toString() : "";
      });
      return values.join(",");
    });
    // Combine header and data rows
    const csvContent = [headerRow, ...dataRows].join("\n");

    // Write CSV content to a file
    const filePath = path.join(process.cwd(), "users.csv");
    fs.writeFileSync(filePath, csvContent);

    // Create a new Headers object to set the response headers
    const headers = new Headers();
    headers.set("Content-Disposition", "attachment; filename=users.csv");
    headers.set("Content-Type", "text/csv");

    // Return the file content as the response
    const fileContent = fs.readFileSync(filePath);

    // Create a Blob object from the file content
    const blob = new Blob([fileContent], { type: "text/csv" });
    // Trigger file download on the client-side
    saveAs(blob, "users.csv");

    // Return an empty response
    return new NextResponse(csvContent, { status: 200, headers });
  } catch (error) {
    console.log("USERS_DOWNLOAD_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
