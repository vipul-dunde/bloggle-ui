import { DashboardIcon } from "@radix-ui/react-icons";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import Link from "next/link";

export function UsernameInfo() {
  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <Button variant="link" className="text-lg text-yellow-600 font-bold">
          {localStorage.getItem("username")}
        </Button>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="flex justify-between space-x-4">
          <Avatar>
            <AvatarFallback>
              {(localStorage.getItem("username") as string)
                .slice(0, 1)
                .toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="space-y-1">
            <h4 className="text-sm font-semibold">
              {localStorage.getItem("username")}
            </h4>
            <p className="text-sm font-extralight">
              You are logged in as User on Bloggle. Explore, create, and share
              your own blog posts with the world.
            </p>
            <div className="flex items-center pt-2">
              <DashboardIcon className="mr-2 h-4 w-4 opacity-70" />{" "}
              <Link
                href="/dashboard/post"
                className="text-xs text-muted-foreground"
              >
                Start Creating Now!
              </Link>
            </div>
          </div>
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
