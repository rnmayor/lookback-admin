import { promises as fs } from "fs";
import path from "path";

export async function getRegions() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refregion.json",
      "utf-8"
    );
    return JSON.parse(fileContents);
  } catch (error) {
    throw new Error("Failed to fetch API region data");
  }
}
