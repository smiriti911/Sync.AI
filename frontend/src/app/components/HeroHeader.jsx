import Image from "next/image";

export default function HeroHeader() {
  return (
    <div className="text-center space-y-2 w-full">
      <h1 className="text-4xl sm:text-5xl font-bold flex justify-center items-center gap-2">
        Code in
        <span className="flex items-center gap-1 ml-3">
          <Image
            src="/logo11.png"
            alt="CodeSync Logo"
            width={30}
            height={30}
            className="w-8 h-8 sm:w-10 sm:h-10 mt-0.5"
          />
          <span className="font-bold">Sync</span>
        </span>
      </h1>
      <p className="text-lg sm:text-xl">— With AI and Your Team —</p>
    </div>
  );
}
