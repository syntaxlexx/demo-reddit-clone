import { getAuthSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { UsernameValidator } from "@/lib/validators/username";
import { ZodError } from "zod";

export async function PATCH(req: Request) {
    try {
        const session = await getAuthSession()

        if (!session?.user) {
            return new Response('Unauthorized', { status: 401 })
        }

        const body = await req.json();

        const { name } = UsernameValidator.parse(body)

        const formattedUsername = name.replaceAll(' ', '')

        const exists = await db.user.findFirst({
            where: {
                username: formattedUsername,
            }
        })

        if (exists) {
            return new Response('Username already taken!', { status: 409 })
        }

        await db.user.update({
            where: {
                id: session.user.id,
            },
            data: {
                username: formattedUsername,
            }
        })

        return new Response('OK')

    } catch (error) {
        if (error instanceof ZodError) {
            return new Response("Invalid request data passed!", { status: 422 })
        }

        console.log("error", error);

        return new Response("Could not update username", { status: 500 })
    }
}