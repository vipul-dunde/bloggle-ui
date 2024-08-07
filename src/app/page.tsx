import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import Navbar from "@/components/Navbar";

async function fetchPosts() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/api/feed/getAllPosts`,
    {
      // Fetching with no-cache to ensure SSR
      cache: "no-store",
    },
  );
  if (!response.ok) {
    throw new Error("Failed to fetch posts");
  }
  return response.json();
}

const Home = async () => {
  // Fetching posts server-side
  const posts = await fetchPosts();

  return (
    <div>
      <Navbar setLogOut={false} />
      <div className="container mx-auto p-8 mt-5">
        {posts.map((post: any) => (
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
