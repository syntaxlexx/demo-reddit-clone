import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentVoteValidator } from "@/lib/validators/vote";
import { ZodError } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();

        const { commentId, voteType } = CommentVoteValidator.parse(body)

        const existing = await db.commentVote.findFirst({
            where: {
                userId: session.user.id,
                commentId
            }
        })

        if (existing) {
            if (existing.type === voteType) {
                await db.commentVote.delete({
                    where: {
                        userId_commentId: {
                            userId: session.user.id,
                            commentId
                        }
                    }
                })
                return new Response('OK')

            } else {
                await db.commentVote.update({
                    where: {
                        userId_postId: {
                            userId: session.user.id,
                            commentId
                        }
                    },
                    data: {
                        type: voteType
                    }
                })

                return new Response('OK')
            }
        }

        await db.commentVote.create({
            data: {
                userId: session.user.id,
                commentId,
                type: voteType
            }
        })

        return new Response('OK')

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not reply to the comment", { status: 500 })
    }
}