import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export default function Navbar() {
  return (
    <div className="grid mx-8">
      <div>
        <header className="flex items-center justify-between w-full h-16 gap-4 mt-4">
          <div className="flex gap-4">
            <Link href="/dashboard">
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                MindScape
              </h1>
            </Link>
          </div>
          <div className="flex items-center gap-2">
            <SignOutButton redirectUrl="/">
              <button className="px-4 py-2 rounded-full bg-gradient-to-r from-blue-600 to-purple-800 text-white text-sm font-semibold">
                Sign Out
              </button>
            </SignOutButton>
          </div>
        </header>
      </div>
    </div>
  );
} 