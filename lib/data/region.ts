import { Region } from "@lib/utils/types";
import { promises as fs } from "fs";
import path from "path";

export async function getAllRegions() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refregion.json",
      "utf-8"
    );

    const regions = JSON.parse(fileContents);

    return regions;
  } catch (error) {
    throw new Error("Failed to fetch API province data");
  }
}

export async function getRegion(regCode: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refregion.json",
      "utf-8"
    );

    const regions = JSON.parse(fileContents);
    const region = regions.find((x: Region) => x.regCode === regCode);

    return region;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}
