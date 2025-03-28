import { getToken } from "next-auth/jwt";
import { NextResponse } from "next/server";
import { isProtectedRoute, isAuthRoute } from "@/lib/config/middleware";

export async function middleware(request) {
  try {
    // Проверяем наличие всех необходимых cookies
    const cookies = request.cookies.getAll();
    const hasSessionToken = cookies.some(
      (c) => c.name === "next-auth.session-token",
    );

    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    const isAuth = !!token;
    const path = request.nextUrl.pathname;

    // Если есть session-token, но токен не валиден, возможно сессия истекла
    if (hasSessionToken && !isAuth) {
      // Очищаем невалидные cookies
      const response = NextResponse.redirect(
        new URL("/auth/signin", request.url),
      );
      response.cookies.delete("next-auth.session-token");
      response.cookies.delete("next-auth.csrf-token");
      return response;
    }

    // Redirect to signin if trying to access protected route while not authenticated
    if (isProtectedRoute(path) && !isAuth) {
      const signInUrl = new URL("/auth/signin", request.url);
      signInUrl.searchParams.set("callbackUrl", path);
      return NextResponse.redirect(signInUrl);
    }

    // Redirect to profile if trying to access auth routes while authenticated
    if (isAuthRoute(path) && isAuth) {
      return NextResponse.redirect(new URL("/profile", request.url));
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware Error:", error);
    return NextResponse.redirect(new URL("/auth/error", request.url));
  }
}

export const config = {
  matcher: ["/profile/:path*", "/plans/:path*", "/auth/:path*"],
};
