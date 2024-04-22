import { Province } from "@lib/utils/types";
import { promises as fs } from "fs";
import path from "path";

export async function getAllProvinces() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refprovince.json",
      "utf-8"
    );

    const provinces = JSON.parse(fileContents);

    return provinces;
  } catch (error) {
    throw new Error("Failed to fetch API province data");
  }
}

export async function getProvinces(regCode?: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refprovince.json",
      "utf-8"
    );

    const provinces = JSON.parse(fileContents);

    if (regCode) {
      return provinces.filter((x: Province) => x.regCode === regCode);
    }

    return provinces;
  } catch (error) {
    throw new Error("Failed to fetch API province data");
  }
}

export async function getProvince(provCode: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refprovince.json",
      "utf-8"
    );

    const provinces = JSON.parse(fileContents);
    const province = provinces.find((x: Province) => x.provCode === provCode);

    return province;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}
