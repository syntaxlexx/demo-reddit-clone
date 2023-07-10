import { db } from "@/lib/db";

export async function GET(req: Request) {
    try {
        const url = new URL(req.url);
        const q = url.searchParams.get('q')

        if (!q) {
            return new Response('Invalid query!', { status: 400 })
        }

        const results = await db.subreddit.findMany({
            where: {
                name: {
                    startsWith: q,
                }
            },
            include: {
                _count: true,
            },
            take: 5,
        })

        return new Response(JSON.stringify(results))
    } catch (error) {
        console.log("error", error);

        return new Response('Could not perorm search', { status: 500 })
    }
}