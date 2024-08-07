"use client"; // Ensure this component is rendered on the client side

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NavbarProps = {
  setLogOut: boolean;
};

const Navbar: React.FC<NavbarProps> = ({ setLogOut }) => {
  const router = useRouter(); // For client-side navigation
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Fetch the token from localStorage when the component mounts
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []); // Empty dependency array means this runs only once when the component mounts

  const handleLogout = () => {
    localStorage.removeItem("token"); // Remove token on logout
    router.push("/"); // Redirect to homepage
  };

  return (
    <nav className="bg-white p-4 md:p-8 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-0">
          <Link href="/">Bloggle</Link> {/* Link to the homepage */}
        </div>
        {!token ? (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>{" "}
              {/* Link to login page */}
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button> {/* Link to signup page */}
            </Link>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            {window.location.pathname === "/dashboard" ? (
              <>
                <Link href="/dashboard/post">
                  <Button>Create New Post</Button>{" "}
                  {/* Link to create new post */}
                </Link>
                <Button onClick={handleLogout}>Log Out</Button>{" "}
                {/* Logout button */}
              </>
            ) : (
              <Link href="/dashboard">
                <Button>Dashboard</Button> {/* Link to dashboard */}
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
