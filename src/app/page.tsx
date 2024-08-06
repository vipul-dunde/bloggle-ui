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
    console.log("Posts: ", posts);
  };

  useEffect(() => {
    getAllPages();
  }, []);

  return (
    <div>
      <Navbar setLogOut={false} />
      <div className="container mx-auto p-6">
        <div className="flex justify-center">
          <div className="w-full max-w-3xl">
            <div className="grid grid-cols-1 gap-4">
              {posts.map((post) => (
                <Card
                  key={post.id}
                  className="shadow-md flex flex-col md:flex-row"
                >
                  <div className="md:w-1/2">
                    <img
                      src="https://via.placeholder.com/500x250.png?text=Sample+Image"
                      alt={post.title}
                      className="object-cover w-full"
                      style={{ height: "350px" }} // Fixed height for the image
                    />
                  </div>
                  <div className="md:w-1/2 p-4">
                    <CardHeader>
                      <h2 className="text-2xl font-bold mb-2">{post.title}</h2>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-700 mb-4">
                        {post.content.slice(0, 130) + "..."}
                      </p>
                    </CardContent>
                    <CardFooter className="p-0">
                      <Link href={`/post/${post.id}`}>
                        <Button>Read more</Button>
                      </Link>
                    </CardFooter>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
