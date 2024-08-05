"use client";
import { useState } from "react";
import { fetchAPI } from "@/lib/utils";

export default function Home() {
  const [message, setMessage] = useState("");
  const handleBackendConnection = async () => {
    const response: Response = await fetchAPI(`/express`);
    const responseJson = await response.json();
    console.log("[Response] : ", responseJson.message);
    setMessage(responseJson.message);
    return message;
  };
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        <div>Landing Page</div>
        <a href="/signup">SignUp</a>
        <p></p>
        <a href="/login">Login</a>
      </div>
      <div>
        <button onClick={handleBackendConnection}>Backend {message}</button>
      </div>
    </main>
  );
}
