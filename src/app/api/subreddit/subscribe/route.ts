import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { SubredditSubscriptionValidator } from "@/lib/validators/subreddit";
import { ZodError } from "zod";

export async function POST(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json()

        const { subredditId } = SubredditSubscriptionValidator.parse(body)

        const subscription = await db.subscription.findFirst({
            where: {
                subredditId: subredditId,
                userId: session.user.id,
            }
        })

        if (subscription) {
            return new Response("You are already subscribed", { status: 400 })
        }

        const sub = await db.subscription.create({
            data: {
                subredditId: subredditId,
                userId: session.user.id,
            }
        })

        return new Response(sub.subredditId)

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not subscribe to subreddit", { status: 500 })
    }
}
