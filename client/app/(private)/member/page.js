"use client";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Loading from "@/app/components/loading";
export default function Member() {
  const router = useRouter();

  useEffect(() => {
    router.push("/member/information");
  }, []);

  return (
    <div className="h-full flex items-center">
      <Loading />
    </div>
  );
}
