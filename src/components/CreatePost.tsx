"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

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
    console.log("Post created: ", createPostResponse.data);
    router.push(`/dashboard`);
  };

  return (
    <div>
      <Navbar setLogOut={true} />
      <div className="container mx-auto p-6">
        <Card className="mb-12 shadow-md rounded-sm overflow-hidden w-[70%] mx-auto h-[550px] mt-5">
          <CardHeader>
            <h2 className="text-2xl font-bold">Create New Blog</h2>
          </CardHeader>
          <CardContent className="p-6">
            <form onSubmit={handleCreatePost}>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Title
                </label>
                <Input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Content
                </label>
                <Textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                  rows={10}
                  required
                />
              </div>
              <Button
                type="submit"
                className="w-20 py-4 rounded-md hover:bg-blue-700 text-md"
              >
                Post
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
