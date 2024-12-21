'use client';
import { UserButton, SignOutButton } from "@clerk/nextjs";
import Card from "../components/Card";
import Navbar from "../components/Navbar";
import { useState } from "react";
import { useEffect } from "react";
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
            let fileName = file.name.split('.')[0];
            let fileId = cards.length + 1;
            setCards([...cards, { title: fileName, description: 'Click to start reading', href: `/book/${fileId}` }]);
            localStorage.setItem('cards', JSON.stringify([...cards, { title: fileName, description: 'Click to start reading', href: `/book/${fileId}` }]));
          }
        };
        reader.readAsDataURL(file);
      }
    };
  };

  const [cards, setCards] = useState<any[]>([]);

  useEffect(() => {
    const storedCards = localStorage.getItem('cards');
    if (storedCards) {
      setCards(JSON.parse(storedCards));
    }
  }, []);

  

  return (
    <>
      <main className="max-w-[85rem] w-full mx-auto">
        <Navbar />
        <div className="mt-[6rem] mx-8" >
          <h1 className="text-4xl font-semibold">Welcome to MindScape</h1>
          <p className="mt-8 text-2xl text-gray-500">My Books</p>
          <hr className="mt-2 border-t border-gray-200" />
        </div>
        <div className="mt-8 mx-8"> 
          <button className="px-4 py-2 rounded-full bg-[#131316] text-white text-sm font-semibold" onClick={handleCreateNewBook}>
              +&nbsp;&nbsp;Create New
          </button>
        </div>
        <div className="mt-8 mx-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cards.map((card, index) => (
              <Card
                key={index}
                title={card.title}
                description={card.description}
                href={card.href}
              />
            ))}
          </div>
        </div>
      </main>
    </>
  );
}
