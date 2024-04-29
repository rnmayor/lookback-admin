import Image from "next/image";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className="flex items-center justify-center">
      <Image
        src="/images/logo-uic.png"
        alt="lookback"
        height={48}
        width={48}
        priority
        className="object-contain w-12 h-12"
      />
      <p className="uppercase pl-2 text-xl p-2 rounded-sm border-0 shadow-lg bg-gradient-to-t from-orange-400 via-orange-500 to-orange-600 text-primary-foreground">
        <span className="font-semibold tracking-widest">Lookback</span>
      </p>
    </Link>
  );
};

export default Logo;
