"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

const Login = () => {
  const router = useRouter();
  const [authenticated, setAuthenticated] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getAuthenticity();
    if (authenticated) {
      router.push("/dashboard");
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    console.log(email, password);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/login`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email, password }),
        },
      );

      console.log("Response: ", response.ok);

      if (!response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      const data = await response.json();
      const { token, username } = data;
      localStorage.setItem("token", token);
      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password");
    }
  };

  const getAuthenticity = async () => {
    const auth = await isAuthenticated();
    setAuthenticated(auth);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar setLogOut={false} />
      <div className="flex justify-center items-center bg-gray-50 lg:mt-4 md:mt-4 grow">
        <div className="bg-white p-8 rounded shadow-lg max-w-md w-full">
          <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <form onSubmit={handleSubmit}>
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
              Login
            </Button>
          </form>
          <div className="mt-4 text-center">
            <a href="/signup" className="text-sm text-blue-600 hover:underline">
              Dont have an account? Sign up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export const isAuthenticated = async () => {
  const token: string = localStorage.getItem("token") as string;
  if (token != null) {
    const verifyTokenResponse = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/auth/verify-token`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      },
    );
    console.log("Verify Token Response: ", verifyTokenResponse.ok);
    if (!verifyTokenResponse.ok) {
      localStorage.removeItem("token");
      return false;
    }
  } else {
    return false;
  }

  return true;
};

export default Login;
