import { Post, Vote, VoteType } from "@prisma/client";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import PostVoteClient from "./PostVoteClient";

// a hybrid component that either streams data when initial(s) are provide,
// or fetches via Suspense
interface PostVoteServerProps {
  postId: string;
  initialVotesAmt?: number;
  initialVote?: Vote;
  getData?: () => Promise<(Post & { votes: Vote[] }) | null>;
}

// const wait = (ms: number) => new Promise((res) => setTimeout(res, ms));

const PostVoteServer = async ({
  postId,
  initialVote,
  initialVotesAmt,
  getData,
}: PostVoteServerProps) => {
  const session = await getServerSession();

  let _votesAmt: number = 0;
  let _currentVote: VoteType | null | undefined = undefined;

  if (getData) {
    // await wait(2000); // artificial wait
    const post = await getData();

    if (!post) return notFound();

    _votesAmt = post.votes.reduce((acc, vote) => {
      if (vote.type === "UP") return acc + 1;
      if (vote.type === "DOWN") return acc - 1;
      return acc;
    }, 0);

    _currentVote = post.votes.find(
      (vote) => vote.userId === session?.user.id
    )?.type;
  } else {
    _votesAmt = initialVotesAmt!;
    _currentVote = initialVote?.type!;
  }

  return (
    <PostVoteClient
      postId={postId}
      initialVote={_currentVote}
      initialVotesAmt={_votesAmt}
    ></PostVoteClient>
  );
};

export default PostVoteServer;
