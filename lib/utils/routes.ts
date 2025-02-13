import { AdminRoute } from "@lib/utils/types";
import { FaUserCog } from "react-icons/fa";
import { MdLocationCity } from "react-icons/md";

/**
 * An array of routes that are used for authentication.
 * These routes will redirect logged in users to DEFAULT_LOGIN_REDIRECT
 * @type {string[]}
 */
export const authRoutes: string[] = ["/auth/login", "/auth/error"];

/**
 * The prefix for API authentication routes.
 * Routes that starts with this prefix are used for API authentication purposes
 * @type {string}
 */
export const apiAuthPrefix: string = "/api/auth";

/**
 * The prefix for API public routes.
 * Routes that starts with this prefix are used for public purposes
 * Authentication of this apis are through JWT strategy and not handled by Next-Auth
 * @type {string}
 */
export const apiPublicPrefix: string = "/api/lookback";

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/users";

export const ROUTES: AdminRoute[] = [
  {
    icon: FaUserCog,
    label: "Users",
    href: "/users",
  },
  {
    icon: MdLocationCity,
    label: "Locations",
    href: "/locations",
  },
];
