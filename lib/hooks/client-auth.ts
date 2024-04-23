import { useSession } from "next-auth/react";

export function currentUser() {
  const session = useSession();
  return session.data?.user;
}

export function currentRole() {
  const session = useSession();
  return session.data?.user.role;
}
