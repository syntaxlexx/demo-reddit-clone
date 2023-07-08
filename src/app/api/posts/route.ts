import { getAuthSession } from "@/lib/auth"
import { db } from "@/lib/db";
import { ZodError, z } from "zod";

export async function GET(req: Request) {
    const url = new URL(req.url)

    const session = await getAuthSession()

    let followedCommunitiesIds: string[] = [];

    if (session?.user) {
        const followedCommunities = await db.subscription.findMany({
            where: {
                userId: session.user.id,
            },
            include: {
                subreddit: true,
            }
        })
        followedCommunitiesIds = followedCommunities.map(({ subreddit }) => subreddit.id)
    }

    try {
        const { limit, page, subredditName } = z.object({
            limit: z.string(),
            page: z.string(),
            subredditName: z.string().nullish().optional(),
        }).parse({
            subredditName: url.searchParams.get('subredditName'),
            limit: url.searchParams.get('limit'),
            page: url.searchParams.get('page'),
        })

        let whereClause = {}

        if (subredditName) {
            whereClause = {
                subreddit: {
                    name: subredditName
                }
            }
        } else if (session?.user) {
            whereClause = {
                subreddit: {
                    id: {
                        in: followedCommunitiesIds
                    }
                }
            }
        }

        const posts = await db.post.findMany({
            take: parseInt(limit),
            skip: (parseInt(page) - 1) * parseInt(limit),
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                subreddit: true,
                votes: true,
                author: true,
                comments: true,
            },
            where: whereClause,
        })

        return new Response(JSON.stringify(posts));
    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not fetch posts. Please try again", { status: 500 })

    }


}