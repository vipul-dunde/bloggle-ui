"use client"; // Ensure this component is rendered on the client side

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/components/Login"; // Import authentication check function
import axios from "axios";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  imageURL: string;
  excerpt: string;
};

// Client-side Dashboard component
const Dashboard = () => {
  const router = useRouter(); // For client-side navigation
  const [posts, setPosts] = useState<Post[]>([]); // State to manage posts

  // Check if the user is authenticated and fetch posts
  const getAuthenticity = async () => {
    const auth = await isAuthenticated();
    if (!auth) {
      // Redirect to login if not authenticated
      router.push("/login");
    } else {
      // Fetch posts if authenticated
      getAllPages();
    }
  };

  useEffect(() => {
    getAuthenticity(); // Check authentication and fetch posts on mount
  }, []);

  // Fetch posts from the backend
  const getAllPages = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/getAuthorPosts`,
        { token: localStorage.getItem("token") },
        { headers },
      );

      if (response.status === 200) {
        setPosts(response.data); // Set posts if the response is successful
      } else {
        // Handle unauthorized access
        localStorage.removeItem("token");
        throw new Error("Session expired. Please login again.");
      }
    } catch (error) {
      console.error("Error fetching posts:", error);
      localStorage.removeItem("token"); // Ensure token is removed on error
      router.push("/login"); // Redirect to login on error
    }
  };

  // Delete a post
  const handleDeletePost = async (id: number) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    try {
      await axios.delete(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/deletePost/${id}`,
        { headers },
      );
      setPosts(posts.filter((post) => post.id !== id)); // Remove post from state
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <Navbar setLogOut={true} />
      <div className="container mx-auto p-8 mt-5">
        {posts.length > 0 ? (
          posts.map((post) => (
            <Card
              key={post.id}
              className="shadow-sm flex flex-col md:flex-row h-auto md:h-[350px] mb-4"
            >
              <div className="w-full md:w-1/2">
                <img
                  src={post.imageURL}
                  alt={post.title}
                  className="object-cover w-full"
                  style={{ height: "auto", maxHeight: "350px" }}
                />
              </div>
              <div className="w-full md:w-1/2 p-4">
                <CardHeader>
                  <h2 className="text-xl md:text-2xl font-bold mb-2">
                    {post.title}
                  </h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {post.content.slice(0, 270) + "..."}
                  </p>
                </CardContent>
                <CardFooter className="p-0">
                  <Link href={`/blog/${post.id}?canDelete=true`}>
                    <Button className="mx-6 mt-2">Read more</Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">No blogs available</h2>
            <p className="text-gray-600 mb-6">
              It looks like there are no blogs to display. Start creating
              content now!
            </p>
            <Link href="/dashboard/post">
              <Button>Create a Blog</Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
