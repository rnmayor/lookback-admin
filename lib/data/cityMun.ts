import { CityMunicipality } from "@lib/utils/types";
import { promises as fs } from "fs";
import path from "path";

export async function getAllCityMunicipalities() {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refcitymun.json",
      "utf-8"
    );

    const cityMunicipalities = JSON.parse(fileContents);

    return cityMunicipalities;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}

export async function getCityMunicipalities(provCode?: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refcitymun.json",
      "utf-8"
    );

    const cityMunicipalities = JSON.parse(fileContents);

    if (provCode) {
      return cityMunicipalities.filter(
        (x: CityMunicipality) => x.provCode === provCode
      );
    }

    return cityMunicipalities;
  } catch (error) {
    throw new Error("Failed to fetch API city/municipality data");
  }
}

export async function getCityMunicipality(citymunCode: string) {
  try {
    const jsonDirectory = path.join(process.cwd(), "public", "data");
    const fileContents = await fs.readFile(
      jsonDirectory + "/refcitymun.json",
      "utf-8"
    );

    const cityMuns = JSON.parse(fileContents);
    const cityMun = cityMuns.find(
      (x: CityMunicipality) => x.citymunCode === citymunCode
    );

    return cityMun;
  } catch (error) {
    throw new Error("Failed to fetch API barangay data");
  }
}
