import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { redis } from "@/lib/redis";
import { PostVoteValidator } from "@/lib/validators/vote";
import { CachedPost } from "@/types/redis";
import { ZodError } from "zod";

const CACHE_AFTER_UPVOTES = 1

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        const { postId, voteType } = PostVoteValidator.parse(body)

        const post = await db.post.findUnique({
            where: {
                id: postId,
            },
            include: {
                author: true,
                votes: true,
            }
        })

        if (!post) {
            return new Response("Post not found!", { status: 404 })
        }

        const existing = await db.vote.findFirst({
            where: {
                userId: session.user.id,
                postId,
            }
        })

        if (existing) {
            if (existing.type === voteType) {
                await db.vote.delete({
                    where: {
                        userId_postId: {
                            postId,
                            userId: session.user.id,
                        }
                    }
                })

                return new Response('OK')
            }

            await db.vote.update({
                where: {
                    userId_postId: {
                        postId,
                        userId: session.user.id,
                    }
                },
                data: {
                    type: voteType
                }
            })

            // recount the votes
            const votesAmt = post.votes.reduce((acc, vote) => {
                if (vote.type == "UP") return acc + 1;
                if (vote.type == "DOWN") return acc - 1;
                return acc;
            }, 0)

            if (votesAmt > CACHE_AFTER_UPVOTES) {
                const cachePayload: CachedPost = {
                    authorUsername: post.author.username ?? '',
                    content: JSON.stringify(post.content),
                    id: post.id,
                    title: post.title,
                    currentVote: voteType,
                    createdAt: post.createdAt,
                }

                await redis.hset(`post:${postId}`, cachePayload)
            }

            return new Response('OK')
        }

        const savedPost = await db.vote.create({
            data: {
                type: voteType,
                userId: session.user.id,
                postId: post.id,
            }
        })

        // recount the votes
        const votesAmt = post.votes.reduce((acc, vote) => {
            if (vote.type == "UP") return acc + 1;
            if (vote.type == "DOWN") return acc - 1;
            return acc;
        }, 0)

        if (votesAmt > CACHE_AFTER_UPVOTES) {
            const cachePayload: CachedPost = {
                authorUsername: post.author.username ?? '',
                content: JSON.stringify(post.content),
                id: post.id,
                title: post.title,
                currentVote: voteType,
                createdAt: post.createdAt,
            }

            await redis.hset(`post:${postId}`, cachePayload)
        }

        return new Response('OK')

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not post your vote. Please try again", { status: 500 })
    }
}
