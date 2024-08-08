"use client"; // Ensure this component is rendered on the client side

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Navbar from "@/components/Navbar";
import { useRouter } from "next/navigation";

// Client-side Login component
const Login = () => {
  const router = useRouter(); // For client-side navigation
  const [authenticated, setAuthenticated] = useState(false); // State to manage authentication status
  const [email, setEmail] = useState(""); // State to manage email input
  const [password, setPassword] = useState(""); // State to manage password input
  const [error, setError] = useState(""); // State to manage error messages

  useEffect(() => {
    // Check if the user is already authenticated
    const checkAuth = async () => {
      const auth = await isAuthenticated();
      setAuthenticated(auth);
      if (auth) {
        router.push("/dashboard");
      }
    };

    checkAuth(); // Call checkAuth on component mount
  }, [router]);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state
    try {
      // Make a POST request to authenticate the user
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

      // Handle unsuccessful authentication
      if (!response.ok) {
        localStorage.removeItem("token");
        router.push("/login");
        throw new Error("Session expired. Please login again.");
      }

      // Handle successful authentication
      const data = await response.json();
      const { token, username } = data;
      localStorage.setItem("token", token);
      localStorage.setItem("username", username);

      router.push("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Invalid email or password"); // Set error message for invalid credentials
    }
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

// Function to check if the user is authenticated
export const isAuthenticated = async () => {
  const token = localStorage.getItem("token"); // Get token from localStorage
  if (token) {
    // Verify token with the backend
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

    // Handle token verification response
    if (!verifyTokenResponse.ok) {
      localStorage.removeItem("token");
      return false;
    }

    const data = await verifyTokenResponse.json();
    const { username } = data;
    localStorage.setItem("username", username);
    return true;
  } else {
    return false;
  }
};

export default Login;
