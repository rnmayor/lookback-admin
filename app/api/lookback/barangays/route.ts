import { dataPath } from "@lib/utils/constants";
import { promises as fs } from "fs";
import { NextResponse } from "next/server";
import path from "path";

export async function GET() {
  try {
    const jsonDirectory = path.join(dataPath);
    const fileContents = await fs.readFile(
      jsonDirectory + "/refbrgy.json",
      "utf-8"
    );

    const barangays = JSON.parse(fileContents);

    return NextResponse.json(barangays);
  } catch (error) {
    return new NextResponse("Internal error", {
      status: 500,
    });
  }
}
