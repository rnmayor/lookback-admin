import { Button } from "@components/ui/button";
import { DEFAULT_LOGIN_REDIRECT } from "@lib/utils/routes";
import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import Link from "next/link";

interface ErrorProps {
  title: string;
  subtitle?: string;
  message?: string;
}

const Error = ({ title, subtitle, message }: ErrorProps) => {
  return (
    <div className="flex flex-col gap-y-4 text-center justify-center items-center h-full">
      <h2 className="font-bold text-5xl tracking-tight">{title}</h2>
      <p className="text-md text-muted-foreground">{subtitle}</p>
      <div className="w-full flex items-center justify-center ">
        <ExclamationTriangleIcon className="h-16 w-16 text-destructive" />
      </div>
      {message && <p className="text-muted-foreground text-lg">{message}</p>}
      <Button variant="link" className="font-normal w-full" size="lg" asChild>
        <Link href={`${DEFAULT_LOGIN_REDIRECT}`}>Back to home page</Link>
      </Button>
    </div>
  );
};

export default Error;
