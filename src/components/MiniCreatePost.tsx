"use client";

import { Session } from "next-auth";
import { usePathname, useRouter } from "next/navigation";
import { FC } from "react";
import UserAvatar from "./UserAvatar";
import { Input } from "./ui/Input";
import { Button } from "./ui/Button";
import { Image, Link2 } from "lucide-react";

interface MiniCreatePostProps {
  session: Session | null;
}

const MiniCreatePost: FC<MiniCreatePostProps> = ({ session }) => {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <li className="overflow-hidden rounded-md bg-white shadow list-none">
      <div className="h-full px-6 py-4 flex justify-between gap-6">
        <div className="relative">
          <UserAvatar
            user={{
              name: session?.user?.name,
              image: session?.user?.image,
            }}
          ></UserAvatar>

          <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 outline outline-2 outline-white"></span>
        </div>

        <Input
          readOnly
          onClick={() => router.push(pathname + "/submit")}
          placeholder="Create Post"
        ></Input>

        <Button
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <Image className="text-zinc-600"></Image>
        </Button>

        <Button
          variant="ghost"
          onClick={() => router.push(pathname + "/submit")}
        >
          <Link2 className="text-zinc-600"></Link2>
        </Button>
      </div>
    </li>
  );
};

export default MiniCreatePost;
