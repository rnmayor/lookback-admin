import Error from "@components/main/error";
import ReactSwagger from "@components/pages/api-doc/react-swagger";
import { currentRole } from "@lib/utils/auth";
import { getApiDocs } from "@lib/utils/swagger";
import { UserRole } from "@lib/utils/types";

export default async function IndexPage() {
  const role = await currentRole();
  if (role !== UserRole.SUPER_ADMIN) {
    return (
      <section className="container w-full h-full items-center justify-center">
        <Error
          title="Unauthorized"
          subtitle="Request admin access"
          message="You are not authorized to view this page."
        />
      </section>
    );
  }

  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
