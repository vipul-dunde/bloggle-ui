"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
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

const Home = () => {
  const [posts, setPosts] = React.useState<Post[]>([]);

  const getAllPages = async () => {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/feed/getAllPosts`,
    );
    setPosts(response.data);
  };

  useEffect(() => {
    getAllPages();
  }, []);

  return (
    <div>
      <Navbar setLogOut={false} />
      <div className="container mx-auto p-8 mt-5">
        {posts.map((post) => (
          <Card
            key={post.id}
            className="shadow-sm flex flex-col md:flex-row h-[350px] mb-4"
          >
            <div className="md:w-1/2">
              <img
                src="https://via.placeholder.com/500x250.png?text=Sample+Image"
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
              <CardFooter className="p-0">
                <Link href={`/blog/${post.id}`}>
                  <Button className="mx-6 mt-2">Read more</Button>
                </Link>
              </CardFooter>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Home;
