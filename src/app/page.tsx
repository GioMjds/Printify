import { use } from "react";

async function fetchMessage()  {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}`, {
    cache: "no-store"
  });
  return response.json();
}

export default function HomePage() {
  const msg = use(fetchMessage());
  
  return (
    <h1 className="text-4xl text-text-primary">{msg.message}</h1>
  ) 
}