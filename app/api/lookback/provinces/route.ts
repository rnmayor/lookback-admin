import { dataPath } from "@lib/utils/constants";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

/**
 * @swagger
 * /api/lookback/provinces:
 *  get:
 *    description: Returns all provinces in the Philippines
 *    responses:
 *      200:
 *        description: Success
 */
export async function GET() {
  try {
    const jsonDirectory = path.join(process.cwd(), dataPath); // Ensure correct base directory
    const filePath = path.join(jsonDirectory, "refprovince.json");

    const fileExists = await fs
      .access(filePath, fs.constants.F_OK)
      .then(() => true)
      .catch(() => false);

    if (!fileExists) {
      return new NextResponse("File for provinces not found", { status: 400 });
    }

    const fileContents = await fs.readFile(filePath, "utf-8");
    const provinces = JSON.parse(fileContents);

    return NextResponse.json(provinces);
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
