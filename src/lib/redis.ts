import { Redis } from '@upstash/redis'

export const redis = new Redis({
    // @ts-ignore
    url: process.env.REDIS_URL,
    token: process.env.REDIS_SECRET,
})
