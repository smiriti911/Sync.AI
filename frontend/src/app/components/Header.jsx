import React from 'react'; 
import Image from 'next/image';
import Link from 'next/link'; // Import Next.js Link
import { Red_Rose } from 'next/font/google';

const rubik = Red_Rose({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
});

const Header = () => {
  return (
    <header className="w-full flex justify-between items-center px-1 sm:px-3 lg:px-11 xl:px-15 py-3 lg:py-3">
      
      {/* Logo and Text Logo */}
      <div className="flex items-center gap-1">
        <Image 
          src="/logo11.png" 
          alt="Logo" 
          width={34} 
          height={28}
          className="mb-2"
        />
        <span className={`${rubik.className} text-3xl sm:text-3xl font-bold text-amber-50 tracking-tight`}>
          Sync
        </span>
      </div>

      {/* Auth Buttons with Links */}
      <div className="flex gap-2">
        <Link href="/login">
          <button className="text-sm font-medium px-3 py-[6px] sm:px-4 sm:py-[6px] rounded-md text-white bg-neutral-800 hover:bg-blue-500 border border-neutral-600 transition-colors duration-200 hover:border-blue-500">
            Sign in
          </button>
        </Link>
        <Link href="/register">
          <button className="text-sm font-medium px-3 py-[6px] sm:px-4 sm:py-[6px] rounded-md text-black bg-white hover:bg-neutral-200 border border-neutral-600 transition-colors duration-200 hover:border-neutral-200">
            Sign up
          </button>
        </Link>
      </div>
    </header>
  );
};

export default Header;
