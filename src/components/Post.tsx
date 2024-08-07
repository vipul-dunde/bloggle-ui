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

type Post = {
  id: number;
  title: string;
  content: string;
  authorId: number;
  excerpt: string;
};

const Post = ({ pageId }) => {
  console.log(pageId);
  const [post, setPost] = useState<Post | null>(null);
  const router = useRouter();
  const id = pageId;
  const getPostById = async (postId: string | string[] | undefined) => {
    if (postId) {
      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/feed/getPostById/${postId}`,
      );
      setPost(response.data);
      console.log("Post: ", response.data);
    }
  };

  useEffect(() => {
    if (id) {
      getPostById(id);
    }
  }, [id]);

  if (!post) {
    return <div>Loading...</div>;
  }

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
                src="https://via.placeholder.com/800x400.png?text=Sample+Image"
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
                <p className="text-sm text-gray-500">
                  Author ID: {post.authorId}
                </p>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
