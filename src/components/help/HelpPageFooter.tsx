"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export function HelpPageFooter() {
  const router = useRouter();

  return (
    <div className="mt-6 flex justify-end">
      <Button
        type="button"
        variant="outline"
        onClick={() => router.back()}
        className="border-pink-500 text-pink-600 hover:bg-pink-500 hover:text-white w-full md:w-auto"
      >
        <X className="mr-2 h-4 w-4" />
        Cancelar
      </Button>
    </div>
  );
}
