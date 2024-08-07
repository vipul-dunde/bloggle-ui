"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";
import axios from "axios";
import { isAuthenticated } from "@/components/Login";

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  excerpt: string;
  imageURL: string;
};

interface PostProps {
  pageId: string;
}

const Post: React.FC<PostProps> = ({ pageId }) => {
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const [canDelete, setCanDelete] = useState(false);
  const id = pageId;
  const getPostById = async (postId: string | string[] | undefined) => {
    if (postId) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/feed/getPostById/${postId}`,
      );
      setPost(response.data);
    }
  };

  const getAuthenticity = async () => {
    const auth = await isAuthenticated();
    if (!auth) {
      setCanDelete(false);
    }
  };

  useEffect(() => {
    const currentUrl = window.location.href;
    const url = new URL(currentUrl);
    const params = new URLSearchParams(url.search);
    const queryParam: string | null = params.get("canDelete");

    if (id) {
      getPostById(id);
    }

    if (queryParam && queryParam === "true") {
      setCanDelete(true);
    }
    getAuthenticity();
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

  const handleDeletePost = async (id: number | undefined) => {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      "Content-Type": "application/json",
    };
    await axios.delete(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/posts/deletePost/${id}`,
      { headers },
    );
    router.push("/dashboard");
  };

  return (
    <div>
      <Navbar setLogOut={false} />
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <Card className="shadow-md">
              <CardHeader>
                <CardTitle className="text-3xl font-bold mb-4">
                  {post.title}
                </CardTitle>
              </CardHeader>
              <img
                src={post.imageURL}
                alt={post.title}
                className="object-cover w-full h-64 mb-6 rounded-lg"
              />
              <CardContent>
                <article className="prose max-w-none text-gray-800 leading-relaxed">
                  {post.content}
                </article>
              </CardContent>
              <CardFooter className="flex justify-between items-center mt-6">
                <Button
                  onClick={() => router.back()}
                  className="bg-gray-600 hover:bg-gray-700 text-white"
                >
                  Go Back
                </Button>
                {canDelete && (
                  <Button
                    onClick={() => handleDeletePost(post?.id)}
                    className="cursor-pointer p-2 rounded-md hover:bg-red-600"
                  >
                    Delete Blog
                  </Button>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
