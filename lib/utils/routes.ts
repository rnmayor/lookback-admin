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
 * An array of routes that will be exposed to public. Authentication will be handled through JWT strategy and not by Next-Auth
 * @type {string[]}
 */
export const publicApiRoutes: string[] = ["/api/users"];

/**
 * The default redirect path after logging in
 * @type {string}
 */
export const DEFAULT_LOGIN_REDIRECT: string = "/users";
