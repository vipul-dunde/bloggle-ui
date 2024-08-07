"use client";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/components/Login";
import axios from "axios";
import { Badge } from "@/components/ui/badge";
``;

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  excerpt: string;
};

const Dashboard = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [posts, setPosts] = React.useState<Post[]>([]);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

  const getAllPages = async () => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };

    const createResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/getAuthorPosts`,
      { authorId: 1 },
      { headers },
    );
    setPosts(createResponse.data);
  };

  useEffect(() => {
    getAllPages();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
    const newPost = { authorId: 1, title, content };
    const createPostResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/createPost`,
      newPost,
      { headers },
    );
    setPosts([...posts, createPostResponse.data]);
    setTitle("");
    setContent("");
  };

  const handleDeletePost = async (id: number) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
    const createResponse = await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/deletePost/${id}`,
      { headers },
    );
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <Navbar setLogOut={true} />
      <div className="container mx-auto p-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Posts</h2>
          {posts.length === 0 ? (
            <p className="text-gray-600">No posts yet. Start creating!</p>
          ) : (
            posts.map((post) => (
              <Card
                key={post.id}
                className="mb-6 shadow-md rounded-lg overflow-hidden"
              >
                <CardHeader className="bg-gray-50 p-4">
                  <h3 className="text-xl font-bold text-gray-800">
                    {post.title}
                  </h3>
                </CardHeader>
                <CardContent className="p-4">
                  <p className="text-gray-700">{post.content}</p>
                </CardContent>
                <CardFooter className="p-4 flex justify-end">
                  <Badge
                    onClick={() => handleDeletePost(post.id)}
                    className="cursor-pointer p-2 rounded-md hover:bg-red-600"
                  >
                    Delete Blog
                  </Badge>
                </CardFooter>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
