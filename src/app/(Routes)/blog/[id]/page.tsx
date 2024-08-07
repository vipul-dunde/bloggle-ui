import React from "react";
import Post from "@/components/Post";

interface ChatIdPageProps {
  params: {
    id: string;
  };
}

const BlogId = ({ params }: ChatIdPageProps) => {
  return (
    <div>
      <Post pageId={params.id} />
    </div>
  );
};

export default BlogId;
