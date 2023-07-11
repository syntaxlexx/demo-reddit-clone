import SignIn from "@/components/SignIn";
import { buttonVariants } from "@/components/ui/Button";
import { cn } from "@/lib/utils";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

const Page = () => {
  return (
    <div className="absolute inset-0">
      <div className="h-full max-w-2xl flex flex-col items-center justify-center gap-20">
        <Link
          href="/"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "self-start -mt-20"
          )}
        >
          <ChevronLeft className="mr-2 h-4 w-4"></ChevronLeft>
          Home
        </Link>

        <SignIn />
      </div>
    </div>
  );
};

export default Page;
