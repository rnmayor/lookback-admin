import { dataPath } from "@lib/utils/constants";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const jsonDirectory = path.join(dataPath);
    const fileContents = await fs.readFile(
      jsonDirectory + "/refcitymun.json",
      "utf-8"
    );

    const cityMunicipalities = JSON.parse(fileContents);

    return NextResponse.json(cityMunicipalities);
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
