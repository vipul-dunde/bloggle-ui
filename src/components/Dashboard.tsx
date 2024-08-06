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
import Navbar from "@/components/NavBar";
import { isAuthenticated } from "@/components/Login";
import axios from "axios";
import Link from "next/link";
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
    console.log("Create Response: ", createResponse.data);
    setPosts(createResponse.data);
  };

  useEffect(() => {
    getAllPages();
  }, []);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.push("/login");
    }
  }, [router]);

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
    console.log("Create Response: ", createResponse.data);
    setPosts(posts.filter((post) => post.id !== id));
  };

  return (
    <div>
      <Navbar setLogOut={true} />
      <div className="container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
        <Card className="mb-8">
          <CardHeader>
            <h2 className="text-2xl">Create New Blog</h2>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreatePost}>
              <div className="mb-4">
                <label className="block text-gray-700">Title</label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-gray-700">Content</label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full"
                  rows={5}
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Post
              </Button>
            </form>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-2xl font-bold mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <Card key={post.id} className="mb-4">
                <CardHeader>
                  <h3 className="text-xl font-bold">{post.title}</h3>
                </CardHeader>
                <CardContent>
                  <p>{post.content}</p>
                </CardContent>
                <CardFooter className="p-2">
                  <Badge onClick={() => handleDeletePost(post.id)}>
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
