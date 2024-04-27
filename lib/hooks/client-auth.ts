import { useSession } from "next-auth/react";

export function useCurrentUser() {
  const session = useSession();
  return session.data?.user;
}

export function useCurrentRole() {
  const session = useSession();
  return session.data?.user.role;
}
