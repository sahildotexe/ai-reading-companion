import { UserButton, SignOutButton } from "@clerk/nextjs";

export default async function DashboardPage() {
  return (
    <>
      <main className="max-w-[85rem] w-full mx-auto">
        <div className="grid">
          <div>
            <header className="flex items-center justify-between w-full h-16 gap-4 mt-4">
              <div className="flex gap-4">
                <h1 className="text-2xl font-bold">AI Reading Companion</h1>
              </div>
              <div className="flex items-center gap-2">
                <SignOutButton redirectUrl="/">
                  <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold">
                    Sign Out
                  </button>
                </SignOutButton>
              </div>
            </header>
          </div>
        </div>
      </main>
    </>
  );
}
