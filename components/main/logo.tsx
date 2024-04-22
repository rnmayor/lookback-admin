import Image from "next/image";

const Logo = () => {
  return (
    <div className="flex items-center justify-center">
      <Image
        src="/images/logo-uic.png"
        alt="lookback"
        height={48}
        width={48}
        priority
        className="object-contain w-12 h-12"
      />
      <p className="uppercase pl-2 text-xl bg-gradient-to-r from-white via-orange-1 00 to-orange-500 hover-scale-110 hover:text-orange-600/90 transition-all duration-200">
        <span className="font-semibold tracking-widest">Lookback</span>
      </p>
    </div>
  );
};

export default Logo;
