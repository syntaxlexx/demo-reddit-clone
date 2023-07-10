"use client";

import { formatTimeToNow } from "@/lib/utils";
import { Comment, CommentVote, User } from "@prisma/client";
import { MessageSquare } from "lucide-react";
import { useRef, useState } from "react";
import CommentVotes from "./CommentVotes";
import UserAvatar from "./UserAvatar";
import { Button } from "./ui/Button";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Label } from "./ui/Label";
import { Textarea } from "./ui/Textarea";
import { useMutation } from "@tanstack/react-query";
import { CommentRequest } from "@/lib/validators/comment";
import axios, { AxiosError } from "axios";
import { useCustomToast } from "@/hooks/use-custom-toast";
import { toast } from "@/hooks/use-toast";

type ExtendedComment = Comment & {
  votes: CommentVote[];
  author: User;
};

interface PostCommentProps {
  comment: ExtendedComment;
  votesAmt: number;
  currentVote: CommentVote | undefined;
  postId: string;
}

const PostComment = ({
  comment,
  votesAmt,
  currentVote,
  postId,
}: PostCommentProps) => {
  const commentRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { data: session } = useSession();
  const [isReplying, setIsReplying] = useState(false);
  const [input, setInput] = useState("");
  const { loginToast } = useCustomToast();

  const { mutate: postComment, isLoading } = useMutation({
    mutationFn: async ({ postId, text, replyToId }: CommentRequest) => {
      const payload: CommentRequest = {
        postId,
        replyToId,
        text,
      };

      const { data } = await axios.patch(
        `/api/subreddit/post/comment`,
        payload
      );
      return data;
    },
    onError: (err) => {
      if (err instanceof AxiosError) {
        if (err.response?.status == 401) {
          return loginToast();
        }
      }

      return toast({
        title: "There was a problem",
        description: "Comment wasn't posted successfully. Please try again",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      router.refresh();
      setInput("");
      setIsReplying(false);
    },
  });

  return (
    <div ref={commentRef} className="flex flex-col ">
      <div className="flex items-center">
        <UserAvatar
          user={{
            name: comment.author.name || null,
            image: comment.author.image || null,
          }}
          className="h-6 w-6"
        >
          <div className="ml-2 flex items-center gap-x-2">
            <p className="text-sm font-medium text-gray-900">
              u/{comment.author.username}
            </p>
            <p className="max-h-40 truncate text-xs text-zinc-500">
              {formatTimeToNow(comment.createdAt)}
            </p>
          </div>
        </UserAvatar>
      </div>

      <p className="text-sm text-zinc-900 mt-2">{comment.text}</p>

      <div className="flex gap-2 items-center flex-wrap">
        <CommentVotes
          commentId={comment.id}
          initialVotesAmt={votesAmt}
          initialVote={currentVote}
        />

        <Button
          variant="ghost"
          size="xs"
          aria-label="reply"
          onClick={() => {
            if (!session) return router.push("sign-in");
            setIsReplying(true);
          }}
        >
          <MessageSquare className="h-4 w-4 mr-1.5"></MessageSquare>
          Reply
        </Button>

        {isReplying && (
          <div className="grid w-full gap-1.5">
            <div className="grid w-full gap-1.5">
              <Label htmlFor="comment">Your comment</Label>
              <div className="mt-2">
                <Textarea
                  id="comment"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={1}
                  placeholder="What are your thoughts?"
                ></Textarea>

                <div className="mt-2 flex justify-end">
                  <Button
                    tabIndex={-1}
                    variant="subtle"
                    onClick={() => setIsReplying(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    isLoading={isLoading}
                    disabled={input.length === 0}
                    onClick={() => {
                      if (!input) return;

                      postComment({
                        postId,
                        text: input,
                        replyToId: comment.replyToId ?? comment.id,
                      });
                    }}
                  >
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PostComment;
