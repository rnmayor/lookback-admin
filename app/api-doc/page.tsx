import Error from "@components/main/error";
import ReactSwagger from "@components/pages/api-doc/react-swagger";
import { Button } from "@components/ui/button";
import { currentRole } from "@lib/utils/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@lib/utils/routes";
import { getApiDocs } from "@lib/utils/swagger";
import { UserRole } from "@lib/utils/types";
import Link from "next/link";

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
    <section className="container pt-10">
      <div className="flex w-full justify-between items-start">
        <div className="flex justify-end items-end ml-auto">
          <Button
            variant="link"
            className="font-normal w-full"
            size="lg"
            asChild
          >
            <Link href={`${DEFAULT_LOGIN_REDIRECT}`}>Back to home page</Link>
          </Button>
        </div>
      </div>
      <ReactSwagger spec={spec} />
    </section>
  );
}
