import UserForm from "@components/pages/users/user-form";
import { baseURL } from "@lib/utils/constants";
import { db } from "@lib/utils/db";

const fetchOptions: RequestInit = {
  cache: "no-store", // Prevent caching
};

export default async function User({ params }: { params: { userId: string } }) {
  const user = await db.user.findUnique({
    where: {
      id: params.userId,
    },
    include: {
      userCovidStatus: true,
    },
  });

  const regions = await fetch(`${baseURL}/api/lookback/regions`).then(
    (data) => {
      return data.json();
    }
  );
  const provinces = await fetch(`${baseURL}/api/lookback/provinces`).then(
    (data) => {
      return data.json();
    }
  );
  const cityMunicipalities = await fetch(
    `${baseURL}/api/lookback/city-municipalities`
  ).then((data) => {
    return data.json();
  });
  const barangays = await fetch(
    `${baseURL}/api/lookback/barangays`,
    fetchOptions
  ).then((data) => {
    return data.json();
  });

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-6 pt-4">
        <UserForm
          initialData={user}
          regions={regions}
          provinces={provinces}
          cityMunicipalities={cityMunicipalities}
          barangays={barangays}
        />
      </div>
    </div>
  );
}
