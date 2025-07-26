"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    fetch("api/the-pickle/login", {
      method: "DELETE",
    }).then(() => router.replace("/login"));
  }, [router]);

  return (
    <p className="h-screen flex justify-center items-center">Logging out...</p>
  );
}
