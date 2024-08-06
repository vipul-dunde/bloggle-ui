import React from "react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

type NavbarProps = {
  setLogOut: boolean;
};
const Navbar: React.FC<NavbarProps> = ({ setLogOut }) => {
  const router = useRouter();
  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/");
  };
  return (
    <nav className="bg-white shadow p-8 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center">
        <div className="text-4xl font-extrabold">
          <Link href="/">Bloggle</Link>
        </div>
        {(!setLogOut as boolean) ? (
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Button onClick={handleLogout}>Log Out</Button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
