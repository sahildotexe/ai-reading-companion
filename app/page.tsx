import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import "./home.css"
import Link from "next/link"


export default function Home() {
  return (
    <>
      <main className="flex flex-col items-center justify-center h-screen">
            <div className="flex flex-col items-center justify-center h-screen">
              <h1 className="text-4xl font-bold">AI Reading Companion</h1>
              <p className="text-lg text-gray-600 mt-4">
                Tagline for AI Reading Companion
              </p>
              <div className="relative flex gap-3 mt-8"></div>
              <SignedIn>
                <Link
                  href="/dashboard"
                  className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold"
                >
                  Go to Dashboard
                </Link>
              </SignedIn>
              <SignedOut>
                <SignInButton>
                  <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                    Sign in
                  </button>
                </SignInButton>
              </SignedOut>
            </div>
        </main>
    </>
  )
}
