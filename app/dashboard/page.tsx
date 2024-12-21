'use client';
import { UserButton, SignOutButton } from "@clerk/nextjs";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
export default function DashboardPage() {
  
  const handleCreateNewBook = () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = '.pdf,.epub,.txt';
    fileInput.click();

    fileInput.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        // Store the file in localStorage
        const reader = new FileReader();

      

        reader.onload = (event) => {
          if (event.target?.result) {
            // Convert pdf to base64 and store in localStorage
            const base64 = btoa(event.target.result as string);
            localStorage.setItem(file.name, base64);
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  return (
    <>
      <main className="max-w-[85rem] w-full mx-auto">
        <Navbar />
        <div className="mt-[6rem] mx-8" >
          <h1 className="text-4xl font-semibold ">Welcome to AI Reading Companion</h1>
          <p className="mt-8 text-2xl text-gray-500">My Books</p>
          <hr className="mt-2 border-t border-gray-200" />
        </div>
        <div className="mt-8 mx-8"> 
          <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold" onClick={handleCreateNewBook}>
              +&nbsp;&nbsp;Create New
          </button>
        </div>
        <div className="mt-8 mx-8">
          <Card
            title="The Kite Runner"
            description="Click to start reading"
            href="/book/1"
            className="w-full md:w-[300px]"
          />
        </div>
      </main>
    </>
  );
}
