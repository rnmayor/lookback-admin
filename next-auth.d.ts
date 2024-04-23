import { type DefaultSession } from "next-auth";

/**
 * Additional properties for Session.ExtendedUser.
 * Once added, define them in auth.ts session and jwt callbacks.
 * @type {*}
 **/
export type ExtendedUser = DefaultSession["user"] & {
  role: UserRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
