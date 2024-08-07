import React, { useEffect } from "react";
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

  const [token, setToken] = React.useState<string | null>(null);
  useEffect(() => {
    setToken(localStorage.getItem("token"));
  }, [token]);

  return (
    <nav className="bg-white p-4 md:p-8 sticky top-0 z-50">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        <div className="text-2xl md:text-4xl font-extrabold mb-4 md:mb-0">
          <Link href="/">Bloggle</Link>
        </div>
        {!token ? (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/login">
              <Button variant="outline">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        ) : window.location.pathname === "/dashboard" ? (
          <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-4">
            <Link href="/dashboard/post">
              <Button>Create New Post</Button>
            </Link>
            <Link href="/login">
              <Button onClick={handleLogout}>Log Out</Button>
            </Link>
          </div>
        ) : (
          <div className="space-x-4">
            <Link href="/dashboard">
              <Button>Dashboard</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
