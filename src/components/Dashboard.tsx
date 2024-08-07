"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/components/Login";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Button } from "@/components/ui/button";
``;

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  imageURL: string;
  excerpt: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [posts, setPosts] = React.useState<Post[]>([]);

  const getAuthenticity = async () => {
    const auth = await isAuthenticated();
    if (!auth) {
      router.push("/login");
    }
    getAllPages();
  };

  useEffect(() => {
    getAuthenticity();
  }, []);

  const getAllPages = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const createResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/getAuthorPosts`,
      { token: localStorage.getItem("token") },
      { headers },
    );

    if (!(createResponse.status === 200)) {
      localStorage.removeItem("token");
      throw new Error("Session expired. Please login again.");
    }
    setPosts(createResponse.data);
  };

  const handleDeletePost = async (id: number) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/deletePost/${id}`,
      { headers },
    );
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <Navbar setLogOut={true} />
      <div>
        <div className="container mx-auto p-8 mt-5">
          {posts.map((post) => (
            <Card
              key={post.id}
              className="shadow-sm flex flex-col md:flex-row h-[350px] mb-4"
            >
              <div className="md:w-1/2">
                <img
                  src={post.imageURL}
                  alt={post.title}
                  className="object-cover w-full"
                  style={{ height: "350px" }}
                />
              </div>
              <div className="md:w-1/2 p-4">
                <CardHeader>
                  <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700 mb-4">
                    {post.content.slice(0, 270) + "..."}
                  </p>
                </CardContent>
                <CardFooter className="p-0 justify-end">
                  <Link href={`/blog/${post.id}?canDelete=true`}>
                    <Button className="mx-6 mt-2">Read more</Button>
                  </Link>
                </CardFooter>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
