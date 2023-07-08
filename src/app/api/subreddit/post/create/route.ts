import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostValidator } from "@/lib/validators/post";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        const { subredditId, title, content } = PostValidator.parse(body)

        const subscription = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id,
            }
        })

        if (!subscription) {
            return new Response("Subscribe to post!", { status: 400 })
        }

        await db.post.create({
            data: {
                title,
                content, authorId: session.user.id,
                subredditId,
            }
        })

        return new Response('OK')

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not post to subreddit", { status: 500 })
    }
}
