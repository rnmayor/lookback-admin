import { validatePublicApi } from "@lib/actions/validate-public-api";
import {
  getBarangaysByCitymunCode,
  getCityMunicipalitiesByProvCode,
  getProvincesByRegCode,
  getRegions,
} from "@lib/data/location";
import { db } from "@lib/utils/db";
import { Barangay, CityMunicipality, Province, Region } from "@lib/utils/types";
import { NextResponse } from "next/server";

/**
 * @swagger
 * /api/lookback/locations/{locationId}:
 *  get:
 *    description: Get management data by the authorized user
 *    parameters:
 *      - name: locationId
 *        in: path
 *        required: true
 *        description: The ID of the management
 *        schema:
 *          type: string
 *    security:
 *      - bearerAuth: []
 *    responses:
 *      200:
 *        description: Success
 *      401:
 *        description: Unauthorized - Invalid or missing token
 */
export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { locationId: string };
  }
) {
  try {
    const authorization = req.headers.get("authorization");
    const validationResult = await validatePublicApi(authorization);
    if (!validationResult.loginUser) {
      return new NextResponse(`${validationResult.message}`, {
        status: validationResult.status,
      });
    }

    // now we have fully verified the management and role accessing this api
    // we can get the management's information
    const location = await db.management.findUnique({
      where: {
        id: params.locationId,
      },
    });
    if (!location) {
      return new NextResponse("Location is not existing", { status: 400 });
    }
    const locationPromises = [location].map(async (location) => {
      const regions = await getRegions();
      const region = regions.find(
        (x: Region) => x.regCode === location.regCode
      );

      const provinces = await getProvincesByRegCode(location.regCode);
      const province = provinces.find(
        (x: Province) => x.provCode === location.provCode
      );

      const cityMunicipalities = await getCityMunicipalitiesByProvCode(
        location.provCode
      );
      const cityMunicipality = cityMunicipalities.find(
        (x: CityMunicipality) => x.citymunCode === location.citymunCode
      );

      const barangays = await getBarangaysByCitymunCode(location.citymunCode);
      const barangay = barangays.find(
        (x: Barangay) => x.brgyCode === location.brgyCode
      );

      const locationHistory = await db.userHistory.findMany({
        where: {
          managementId: location.id,
        },
      });
      const promisedManagementHistories = locationHistory.map(
        async (history) => {
          const user = await db.user.findUnique({
            where: {
              id: history.userId,
            },
          });
          return {
            ...history,
            userName: user?.name,
            userEmail: user?.email,
          };
        }
      );
      const userHistories = await Promise.all(promisedManagementHistories);

      return {
        ...location,
        region: region.regDesc,
        province: province.provDesc,
        cityMunicipality: cityMunicipality.citymunDesc,
        barangay: barangay.brgyDesc,
        userHistories: userHistories,
      };
    });

    // Wait for all promises to resolve
    const [formattedLocation] = await Promise.all(locationPromises);
    return NextResponse.json(formattedLocation);
  } catch (error) {
    console.log("MANAGEMENT_GET", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
