import { cn } from "@lib/utils";

interface HeadingProps {
  title: string;
  description: string;
  subHeading?: boolean;
}

const Heading = ({ title, description, subHeading }: HeadingProps) => {
  return (
    <div>
      <h2
        className={cn(
          "font-bold",
          subHeading ? "text-2xl" : "text-3xl tracking-tight"
        )}
      >
        {title}
      </h2>
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
};

export default Heading;
