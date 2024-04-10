// export { auth as middleware } from "@auth";

import NextAuth from "next-auth";

import authConfig from "@auth.config";
import {
  DEFAULT_LOGIN_REDIRECT,
  apiAuthPrefix,
  authRoutes,
  publicApiRoutes,
} from "@lib/utils/routes";

/**
 * NextJS Middleware is compatible only on EDGE enviroment
 * PRISMA does not support Edge, so we need to initialize/configure
 * auth and auth.config in lib/auth to support and use prisma
 **/
const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;

  const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix);
  const isAuthRoute = authRoutes.includes(nextUrl.pathname);
  const isPublicApiRoute = publicApiRoutes.includes(nextUrl.pathname);

  if (isApiAuthRoute || isPublicApiRoute) {
    return null;
  }

  if (isAuthRoute) {
    if (isLoggedIn) {
      return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl));
    }

    if (nextUrl.search.includes("error=")) {
      const urlError = nextUrl.search.split("=")[1];
      const errorUrl = `/auth/error?message=${encodeURIComponent(urlError)}`;
      return Response.redirect(new URL(errorUrl, nextUrl));
    }

    return null;
  }

  if (!isLoggedIn) {
    let callbackUrl = nextUrl.pathname;
    if (nextUrl.search) {
      callbackUrl += nextUrl.search;
    }

    const encodedCallbackUrl = encodeURIComponent(callbackUrl);

    return Response.redirect(
      new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
    );
  }

  return null;
});

/**
 * Optionally, don't invoke Middleware on some paths
 * This matcher is same with configuration in clerk (https://clerk.com)
 **/
export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
};
