import { INFINITE_SCROLLING_PAGINATION_RESULTS } from "@/config";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { FC } from "react";
import PostFeed from "./PostFeed";

interface CustomFeedProps {}

const CustomFeed: FC<CustomFeedProps> = async ({}) => {
  const session = await getServerSession();

  const followedCommunities = await db.subscription.findMany({
    where: {
      userId: session?.user.id,
    },
    include: {
      subreddit: true,
    },
  });

  const posts = await db.post.findMany({
    orderBy: {
      createdAt: "desc",
    },
    where: {
      subreddit: {
        id: {
          in: followedCommunities.map(({ subreddit }) => subreddit.id),
        },
      },
    },
    include: {
      votes: true,
      author: true,
      comments: true,
      subreddit: true,
    },

    take: INFINITE_SCROLLING_PAGINATION_RESULTS,
  });

  return <PostFeed initialPosts={posts}></PostFeed>;
};

export default CustomFeed;
