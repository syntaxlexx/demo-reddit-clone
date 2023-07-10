import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { CommentValidator } from "@/lib/validators/comment";
import { ZodError } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();

        const { postId, text, replyToId } = CommentValidator.parse(body)

        await db.comment.create({
            data: {
                text,
                postId,
                authorId: session.user.id,
                replyToId
            }
        })

        return new Response('OK')

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not comment to post", { status: 500 })
    }
}