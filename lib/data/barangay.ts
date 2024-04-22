import { Barangay } from "@lib/utils/types";
import { promises as fs } from "fs";
import path from "path";

export async function getAllBarangays() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refbrgy.json",
      "utf-8"
    );

    const barangays = JSON.parse(fileContents);

    return barangays;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}

export async function getBarangays(citymunCode?: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refbrgy.json",
      "utf-8"
    );

    const barangays = JSON.parse(fileContents);

    if (citymunCode) {
      return barangays.filter((x: Barangay) => x.citymunCode === citymunCode);
    }

    return barangays;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}

export async function getBarangay(brgyCode: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refbrgy.json",
      "utf-8"
    );

    const barangays = JSON.parse(fileContents);
    const barangay = barangays.find((x: Barangay) => x.brgyCode === brgyCode);

    return barangay;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}
