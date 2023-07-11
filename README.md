# Breddit - Reddit Clone
A demo project showcasing how one would go about building the next Reddit using the new Next13 file-based routing.

### Techs
- Next13
- React18
- Tailwindcss
- Shadcn-ui
- Upstash (redis)
- Prisma
- Zod
- Uploadthing (S3)
- Editorjs (block-based editor)
- axios

It runs on steroids when built and deployed! Hooly!

## Things I've Loved Over Sveltekit
>NB: This only applies to the new 'app' file-based routing. RSCs are actually GOATED!
- Not typing the extra `+` when creating `page.*`
- [React Query](https://tanstack.com/query/v3/) is actually goated! Better than using [Svelte Actions](https://kit.svelte.dev/docs/form-actions)
- Once you get the hang of `JSX`, you kinda miss creating *components* inside another *component* on other frameworks/libraries such as Vue, Svelte[kit], e.t.c
- Abundant npm libraries
- Framer motion
- Parallel routes (Haven't seen a Svelte implementation yet)
- API routes feel more superior to *Svelte* routes. The super integration of same `zod` valdiators between ReactQuery, ReactHookForm, and inside API routes is actually **GOATED**! Pretty **based** is you ask me.
- Same *routing ideology* as [Sveltekit](https://kit.svelte.dev/docs/routing), which is really nice.
- [ShadCN-UI](https://ui.shadcn.com/docs/installation) is pretty dope once you get the hang of it! Faster prototyping = better productivity.
- [UploadThing](https://uploadthing.com/) works flawlessly on react. (It is being ported to other libraries/frameworks as well, but in react land, it's a clear winner)
- And finally, *kind-of-a-biased-take*, [according to Theo's take](https://www.youtube.com/watch?v=uEx9sZvTwuI), coupled with JSX's logical take by [ThePrimeagen](https://twitch.tv/ThePrimeagen) (with regards to abstraction), will get you seeing and appreciating the bigger picture. What that means to you, is up to you. 

## Things I've Hated Over Sveltekit
- Longer dev-build time. Svelketkit's snappy dev-build times is unmatched.
