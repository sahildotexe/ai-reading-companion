import { SignInButton, SignedIn, SignedOut } from "@clerk/nextjs"
import "./home.css"
import Link from "next/link"
import Image from "next/image"

const features = [
  {
    title: "AI-Powered Analysis",
    description: "Advanced algorithms analyze your text to provide deep, meaningful insights and understanding.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
  },
  {
    title: "Smart Summaries",
    description: "Get concise, intelligent summaries of complex texts in seconds, saving you valuable time.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
  },
  {
    title: "Interactive Learning",
    description: "Engage with content through interactive features that enhance comprehension and retention.",
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
  },
]

export default function Home() {
  return (
    <div className="bg-white text-black">
      {/* Hero Section */}
      <main className="flex relative overflow-hidden">
        <div className="absolute top-20 -z-10 h-[500px] w-[500px] bg-gradient-to-r from-blue-500/10 to-purple-500/10 blur-[128px] rounded-full"></div>

        <div className="container mx-auto px-4 py-20">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-12 min-h-[50vh]">
            <div className="flex flex-col items-center text-center justify-center">
              <Image src="/logo.png" alt="MindScape" width={100} height={100} className="my-8"/>
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
                MindScape
              </h1>
              <p className="text-xl text-gray-600 mt-4">
                Transform text into insight - your AI companion for deeper understanding
              </p>

              <div className="flex gap-4 mt-12">
                <SignedIn>
                  <Link
                    href="/dashboard"
                    className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-800 text-white text-md font-semibold hover:bg-[#2a2a2e] transition-colors"
                  >
                    Go to Dashboard
                  </Link>
                </SignedIn>
                <SignedOut>
                  <SignInButton>
                    <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-800 text-white text-md font-semibold hover:bg-[#2a2a2e] transition-colors">
                      Get Started
                    </button>
                  </SignInButton>
                </SignedOut>
              </div>
            </div>


          </div>
        </div>
      </main>

      {/* Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-12 bg-gradient-to-r from-blue-600 to-purple-800 bg-clip-text text-transparent">
            Powerful Features
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
