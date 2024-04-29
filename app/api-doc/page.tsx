import ReactSwagger from "@components/pages/api-doc/react-swagger";
import { getApiDocs } from "@lib/utils/swagger";

export default async function IndexPage() {
  const spec = await getApiDocs();
  return (
    <section className="container">
      <ReactSwagger spec={spec} />
    </section>
  );
}
