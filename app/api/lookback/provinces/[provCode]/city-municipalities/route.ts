import { CityMunicipality } from "@lib/utils/types";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

// Force this route to be dynamic, allowing dynamic server-side logic
export const dynamic = "force-dynamic";

/**
 * @swagger
 * /api/lookback/provinces/{provCode}/city-municipalities:
 *  get:
 *    description: Returns all city/municipalities in the Philippines for specific provCode
 *    parameters:
 *      - name: provCode
 *        in: path
 *        required: true
 *        description: The provCode of the province
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: Success
 */
export async function GET(
  req: Request,
  { params }: { params: { provCode: string } }
) {
  try {
    const jsonDirectory = path.join(
      process.cwd(),
      process.env.DATA_PATH ?? "public/data"
    ); // Ensure correct base directory
    const filePath = path.join(jsonDirectory, "refcitymun.json");

    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return new NextResponse("File for city/municipalities not found", {
        status: 400,
      });
    }

    const fileContents = await fs.readFile(filePath, "utf-8");
    const cityMunicipalities = JSON.parse(fileContents).filter(
      (x: CityMunicipality) => x.provCode === params.provCode
    );

    return NextResponse.json(cityMunicipalities);
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
