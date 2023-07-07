"use client";

import { FC } from "react";
import { Button } from "./ui/Button";
import { X } from "lucide-react";
import { useRouter } from "next/navigation";

interface CloseModalProps {}

const CloseModal: FC<CloseModalProps> = ({}) => {
  const router = useRouter();

  return (
    <Button
      variant="subtle"
      className="h-6 w-6 rounded-md "
      aria-label="close modal"
      onClick={() => router.back()}
    >
      <X className="h-4 w-4"></X>
    </Button>
  );
};

export default CloseModal;
