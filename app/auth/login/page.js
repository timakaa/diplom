"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.push("/auth/signin");
  }, [router]);

  return (
    <div className='flex min-h-screen items-center justify-center'>
      <p>Перенаправление на страницу входа...</p>
    </div>
  );
}
