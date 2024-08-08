"use client";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Navbar from "@/components/Navbar";
import { isAuthenticated } from "@/components/Login";

const CreatePost = () => {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [disableAI, setDisableAI] = useState(true);

  const getAuthenticity = async () => {
    const auth = await isAuthenticated();
    if (!auth) {
      router.push("/login");
    }
  };

  useEffect(() => {
    getAuthenticity();
  }, []);

  const handleCreatePost = async (e: React.FormEvent) => {
    e.preventDefault();
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
    const token: string = localStorage.getItem("token") as string;
    if (!token) {
      router.push("/login");
    }
    const newPost = { authorId: 1, title, content, imageUrl, token: token };
    const createPostResponse = await axios.post(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/createPost`,
      newPost,
      { headers },
    );
    router.push(`/dashboard`);
  };

  const fetchWithTimeout = async (
    url: string,
    options: RequestInit,
    timeout: number,
  ) => {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal,
      });
      clearTimeout(id); // Clear timeout on success
      return response;
    } catch (error) {
      throw error;
    }
  };

  const handleAIEnhance = async (content: string, title: string) => {
    setDisableAI(true);
    console.log("Enhancing Content with AI");
    const newPost = { title, content };
    const aiResponse = await fetchWithTimeout(
      `/api/v1/ai/enhance`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      },
      30000,
    );
    const { enhancedContent } = await aiResponse.json();
    console.log("Response from AI", enhancedContent);
    setContent(enhancedContent);
    setDisableAI(false);
  };

  useEffect(() => {
    if (content.length === 0) {
      setDisableAI(true);
    } else {
      setDisableAI(false);
    }
  }, [content]);

  return (
    <div>
      <Navbar setLogOut={true} />
      <div className="container mx-auto p-6">
        <Card className="mb-12 shadow-md rounded-sm overflow-hidden w-[70%] mx-auto h-[700px] mt-5">
          <CardHeader>
            <h2 className="text-2xl font-bold">
              Create New Blog
              <p className="text-sm font-light">
                Give Title, Some Content, Hit <strong>AI Content</strong>. Let
                AI do the Job for you!!
              </p>
            </h2>
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
                  ImageURL
                </label>
                <Input
                  type="text"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
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
                  placeholder={
                    content.length === 0
                      ? "Write Content or Prompt for AI to Generate Content, Click AI Content to Enhance Content"
                      : "Write Content for Your Blog"
                  }
                  onChange={(e) => setContent(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-md focus:ring focus:ring-blue-500"
                  rows={10}
                  required
                  disabled={title.length === 0}
                />
              </div>
              <Button
                type="submit"
                className="w-20 py-4 rounded-md hover:bg-blue-700 text-md"
              >
                Post
              </Button>
              <Button
                type="button"
                onClick={() => handleAIEnhance(content, title)}
                className="ml-2 w-30 py-4 rounded-md hover:bg-blue-700 text-md"
                disabled={disableAI}
              >
                AI Content
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CreatePost;
