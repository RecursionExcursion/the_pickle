"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteCookie } from "../../service/cookieService";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    deleteCookie().then(() => router.replace("/login"));
  }, [router]);

  return (
    <p className="h-screen flex justify-center items-center">Logging out...</p>
  );
}
