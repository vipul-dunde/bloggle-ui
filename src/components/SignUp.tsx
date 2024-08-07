"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log(email, password);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      if (!response.ok) {
        console.log(response.body);
        setError("Username Already Exists. Try Logging In.");
        throw new Error("SignUp failed");
      }

      const data = await response.json();
      const { token } = data;
      // Store the JWT token in localStorage
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      console.error("SignUp error:", err);
      setError("Username Already Exists. Try Logging In.");
    }
  };
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setLogOut={false} />
      <div className="flex justify-center items-center bg-gray-50 lg:mt-4 md:mt-4 grow">
        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full ">
          <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label className="block text-gray-700">Name</label>
              <Input
                type="text"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700">Email</label>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-6">
              <label className="block text-gray-700">Password</label>
              <Input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/login" className="text-sm text-blue-600 hover:underline">
              Already have an account? Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
